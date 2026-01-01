const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const postcss = require('postcss');
const safeParser = require('postcss-safe-parser');
const fixMediaQueryFormatting = postcss.plugin('fix-media-query-formatting', () => {
    return root => {
        root.walkAtRules('media', atRule => {
            atRule.params = atRule.params
                .replace(/(\w+)\s*:\s*(\d+)/g, (match, prop, value) => {
                    return `${prop}: ${value}`;
                })
                .replace(/\s{2,}/g, ' ')
                .trim();
        });
    };
});
function replaceEnvWithVar(cssRoot) {
    const envRegex = /env\(\s*([\w-]+)\s*(?:,\s*([^)]+))?\s*\)/g;

    cssRoot.walkDecls(decl => {
        decl.value = decl.value.replace(envRegex, (match, envVarName, fallback) => {
            const emulatorVarName = `--emulator-${envVarName.trim().replace(/_/g, '-')}`;

            if (fallback) {
                return `var(${emulatorVarName}, ${fallback.trim()})`;
            } else {
                return `var(${emulatorVarName})`;
            }
        });
    });
}

function copyRecursiveSync(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyRecursiveSync(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

function deleteFolderRecursive(targetPath) {
    if (fs.existsSync(targetPath)) {
        fs.readdirSync(targetPath).forEach(file => {
            const curPath = path.join(targetPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(targetPath);
    }
}

function copyProjectToRender() {
    const src = path.join(__dirname, 'project');
    const dest = path.join(__dirname, 'render');
    try {
        deleteFolderRecursive(dest);
        copyRecursiveSync(src, dest);
        console.log('Copied files from ./project to ./render');
        return true;
    } catch (error) {
        console.error('Error during copying:', error);
        return false;
    }
}

function getAllFiles(dir, ext = ['.html', '.htm', '.php']) {
    let files = [];
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            files = files.concat(getAllFiles(fullPath, ext));
        } else if (ext.includes(path.extname(file))) {
            files.push(fullPath);
        }
    });
    return files;
}

function getLinkedCSSPaths($, htmlPath) {
    const links = $('link[rel="stylesheet"]');
    return links
        .map((_, el) => {
            const href = $(el).attr('href');
            return href ? path.resolve(path.dirname(htmlPath), href) : null;
        })
        .get()
        .filter(Boolean);
}

const extractStyleBlocks = html => {
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    const styles = [];
    let match;
    while ((match = styleRegex.exec(html))) {
        styles.push({
            css: match[1],
            start: match.index,
            end: styleRegex.lastIndex
        });
    }
    return styles;
};

async function transformCSSFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const isHTMLLike = ['.html', '.htm', '.php'].includes(ext);
    const content = fs.readFileSync(filePath, 'utf-8');
    let styleBlocks = [];

    if (isHTMLLike) {
        styleBlocks = extractStyleBlocks(content);
        if (styleBlocks.length === 0) return;
    } else {
        styleBlocks.push({ css: content, start: 0, end: content.length });
    }

    let output = content;
    for (const block of styleBlocks.reverse()) {
        const root = postcss.parse(block.css, { parser: safeParser });
        await postcss([fixMediaQueryFormatting]).process(root, { from: undefined });

        root.walkAtRules('media', atRule => {
            const orBlocks = atRule.params.split(/\s*,\s*/);
            const replacementNodes = [];
            const allClassSelectors = [];

            orBlocks.forEach(orBlock => {
                const andConditions = orBlock.split(/\s+and\s+/i).map(c => c.trim());
                const className =
                    'emulator-' +
                    andConditions
                        .map(cond =>
                            cond
                                .replace(/\./g, '--dot--')
                                .replace(/[()]/g, '')
                                .replace(/\s+/g, '-')
                                .replace(/\//g, '-')
                                .replace(/[^a-zA-Z0-9-]/g, '')
                                .toLowerCase()
                        )
                        .join('.');
                if (className) allClassSelectors.push(className);
            });

            atRule.walkRules(rule => {
                const newRule = rule.clone();
                newRule.selectors = rule.selectors.flatMap(sel => {
                    const parts = sel.trim().split(/\s+/);
                    let last = parts.pop();

                    let element = '';
                    let pseudo = '';
                    const match = last.match(/^([^\:]+)?(:{1,2}[a-zA-Z0-9-()]+)?$/);

                    if (match) {
                        element = match[1] || '';
                        pseudo = match[2] || '';
                    } else {
                        element = last;
                        pseudo = '';
                    }

                    return allClassSelectors.map(className => {
                        if (pseudo === ':root' && element === '') {
                            return [...parts, `html.${className}`].join(' ');
                        }
                        const lastWithClass = element ? `${element}.${className}${pseudo}` : `.${className}${pseudo}`;
                        return [...parts, lastWithClass].join(' ');
                    });
                });
                replacementNodes.push(newRule);
            });

            atRule.replaceWith(...replacementNodes);
        });

        replaceEnvWithVar(root);
        const transformed = root.toString();

        if (isHTMLLike) {
            output = output.slice(0, block.start) + `<style>\n${transformed}\n</style>` + output.slice(block.end);
        } else {
            output = transformed;
        }
    }

    fs.writeFileSync(filePath, output, 'utf-8');
    console.log(`CSS has been converted at ${path.basename(filePath)}`);
}

function parseCSSContent(css) {
    const root = postcss.parse(css, { parser: safeParser });
    const entries = [];

    root.walkAtRules('media', atRule => {
        const orBlocks = atRule.params.split(/\s*,\s*/);
        const classSelectors = [];

        orBlocks.forEach(orBlock => {
            const andConditions = orBlock.split(/\s+and\s+/i).map(c => c.trim());
            const className =
                'emulator-' +
                andConditions
                    .map(cond =>
                        cond
                            .replace(/\./g, '--dot--')
                            .replace(/[()]/g, '')
                            .replace(/\s+/g, '-')
                            .replace(/\//g, '-')
                            .replace(/[^a-zA-Z0-9-]/g, '')
                            .toLowerCase()
                    )
                    .join('.');
            if (className) classSelectors.push(className);
        });

        const selectors = [];
        const selectorsForJSON = [];
        const declarations = [];

        atRule.walkRules(rule => {
            rule.selectors.forEach(sel => {
                const trimmed = sel.trim();

                // Obsługa :root → zamiana na html z klasą emulatora
                if (trimmed === ':root') {
                    classSelectors.forEach(className => {
                        selectors.push(`html.${className}`);
                    });
                    return;
                }

                // Rozpoznanie pseudoklasy/pseudoelementu na końcu
                const pseudoMatch = last.match(/(:{1,2}[a-zA-Z0-9-()]+.*)?$/);
                let pseudo = '';
                let element = last;

                if (pseudoMatch) {
                    pseudo = pseudoMatch[0] || '';
                    element = last.slice(0, -pseudo.length).trim();
                }

                // Pomijamy selektory, które są tylko pseudoelementem (np. ::-webkit-scrollbar-thumb)
                if (!element && pseudo.startsWith('::')) {
                    return;
                }

                // Generujemy selektory z klasą emulatora
                classSelectors.forEach(className => {
                    const selector = element ? `${element}.${className}${pseudo}` : `.${className}${pseudo}`;

                    if (selector.trim()) {
                        selectors.push(selector);
                    }
                });
            });

            rule.walkDecls(decl => {
                declarations.push({
                    property: decl.prop,
                    value: decl.value
                });
            });
        });

        entries.push({
            className: classSelectors.join(', '),
            selectors: [...new Set(selectors)],
            selectorsForJSON: [...new Set(selectorsForJSON)],
            declarations,
            media: orBlocks.join(', ')
        });
    });

    return entries;
}

const parseCSSFile = async filePath => {
    const css = fs.readFileSync(filePath, 'utf-8');
    return parseCSSContent(css);
};

async function analyzeMediaQueries() {
    const renderDir = path.join(__dirname, 'render');
    const files = getAllFiles(renderDir);
    const output = {};

    console.log(`${files.length} HTML files found for analysis.`);

    for (const file of files) {
        const html = fs.readFileSync(file, 'utf-8');
        const $ = cheerio.load(html);
        const cssPaths = getLinkedCSSPaths($, file);
        const relativePath = path.relative(renderDir, file);
        output[relativePath] = {};

        console.log(`File processing: ${relativePath}`);
        console.log(`  ${cssPaths.length} CSS files found:`);

        for (const cssPath of cssPaths) {
            console.log(`    - ${cssPath}`);
            const entries = await parseCSSFile(cssPath);
            console.log(`    - Loaded ${entries.length} media queries blocks from ${cssPath}`);

            processEntries(entries, $, output[relativePath]);
        }

        const inlineStyles = [];
        $('style').each((_, el) => {
            const css = $(el).html();
            if (css && css.trim()) {
                inlineStyles.push(css);
            }
        });

        for (const inlineCSS of inlineStyles) {
            const entries = parseCSSContent(inlineCSS);
            console.log(`    - Loaded ${entries.length} media queries blocks from <style>`);
            processEntries(entries, $, output[relativePath]);
        }
    }

    for (const file in output) {
        for (const className in output[file]) {
            const value = output[file][className];
            if (value instanceof Set) {
                output[file][className] = Array.from(value).join(', ');
            } else {
                output[file][className] = String(value).replace(/^,\s*/, '');
            }
        }
    }

    const outputPath = path.join(__dirname, 'media-query-map.json');
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
    console.log(`Media queries analysis saved to: ${outputPath}`);
}

function processEntries(entries, $, fileOutput) {
    for (const entry of entries) {
        const { className, selectors, declarations, media } = entry;
        console.log(`      - Class analysis: ${className} (media: ${media})`);

        let baseElements = selectors.map(sel => {
            const first = sel.trim().split('.emulator-')[0];
            return first;
        });
        baseElements = [...new Set(baseElements)];
        fileOutput[className] = baseElements.join(', ');
        console.log(`        - The class ${className} has been assigned to the element: ${fileOutput[className]}`);
    }
}

async function transformAllCSS() {
    const renderDir = path.join(__dirname, 'render');
    const allCSS = getAllFiles(renderDir, ['.css', '.html', '.htm', '.php']);
    for (const cssFile of allCSS) {
        await transformCSSFile(cssFile);
    }
}

async function appendScriptToAllHTMLFilesInRender() {
    const baseDir = path.resolve('./render');
    const scriptTag = `<script src="http://localhost/screen_emulator/emulator/media-query.js"></script>`;

    function processFile(filePath) {
        const ext = path.extname(filePath).toLowerCase();
        if (!['.html', '.htm', '.php'].includes(ext)) return;
        const content = fs.readFileSync(filePath, 'utf-8');
        const $ = cheerio.load(content, { decodeEntities: false });
        const hasBody = $('body').length > 0;
        const hasHead = $('head').length > 0;
        if (!hasBody) return;
        if (hasHead) {
            const stylesheetLink = `<link rel="stylesheet" href="http://localhost/screen_emulator/emulator/environment-variables.css">`;
            $('head').prepend(stylesheetLink);
        }
        $('body').append(scriptTag);
        const updatedContent = $.html();
        fs.writeFileSync(filePath, updatedContent, 'utf-8');
        console.log(`Updated ${filePath}: added <script> added${hasHead ? ' <link>' : ''}`);
    }

    function walkDir(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                walkDir(fullPath);
            } else if (entry.isFile()) {
                processFile(fullPath);
            }
        }
    }

    walkDir(baseDir);
}

module.exports = {
    copyProjectToRender,
    analyzeMediaQueries,
    transformAllCSS,
    appendScriptToAllHTMLFilesInRender
};
