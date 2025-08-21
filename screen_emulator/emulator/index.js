//Variables update---------------------------------------------------------------------------------------------------------------------------------------------------------------------
win_width = document.getElementById('window_width');
win_height = document.getElementById('window_height');
scale = document.getElementById('window_modifier');
checkbox_diagonal = document.getElementById('checkbox_diagonal');
input_diagonal = document.getElementById('diagonal');
list_diagonal = document.getElementById('list_diagonal');
input_dpi = document.getElementById('dpi');
navigation_bar_left = document.getElementById('viewport_left');
navigation_bar_right = document.getElementById('viewport_right');
navigation_bar_top = document.getElementById('viewport_top');
navigation_bar_bottom = document.getElementById('viewport_bottom');
color = document.getElementById('color');
color_gamut = document.getElementById('color_gamut_type');
color_index = document.getElementById('color_index');
forced_colors = document.getElementById('forced_colors_type');
forced_colors_type = document.getElementById('forced_colors_type_type');
inverted_colors = document.getElementById('inverted_colors_type');
monochrome = document.getElementById('monochrome_type');
monochrome_color = document.getElementById('monochrome_color_type');
checkbox_monochrome = document.getElementById('checkbox_monochrome');
dynamic_range = document.getElementById('dynamic_range_type');
color_scheme = document.getElementById('prefers_color_scheme_type');
contrast = document.getElementById('prefers_contrast_type');
reduced_motion = document.getElementById('prefers_reduced_motion_type');
reduced_transparency = document.getElementById('prefers_reduced_transparency_type');
update = document.getElementById('update_type');
grid_type = document.getElementById('grid_type');
display_mode = document.getElementById('display_mode_type');
overflow_block = document.getElementById('overflow_block_type');
overflow_inline = document.getElementById('overflow_inline_type');
wekit_transform_3d = document.getElementById('webkit_transform_3d');
browser = document.getElementById('browser_type');
scripting = document.getElementById('scripting_type');
hover = document.getElementById('hover_type');
pointer = document.getElementById('pointer_type');
screen_fold_api_max = document.getElementById('screen_fold_api_max');
checkbox_screen_fold_api = document.getElementById('checkbox_screen_fold_api');
list_screen_fold_api = document.getElementById('list_screen_fold_api');
list_viewport_segments_api = document.getElementById('list_viewport_segments_api');
safe_area_inset_left = document.getElementById('safe_area_inset_left');
safe_area_inset_right = document.getElementById('safe_area_inset_right');
safe_area_inset_top = document.getElementById('safe_area_inset_top');
safe_area_inset_bottom = document.getElementById('safe_area_inset_bottom');
titlebar_area_width = document.getElementById('titlebar_area_width');
titlebar_area_height = document.getElementById('titlebar_area_height');
titlebar_area_x = document.getElementById('titlebar_area_x');
titlebar_area_y = document.getElementById('titlebar_area_y');
checkbox_viewport_segments_api = document.getElementById('checkbox_viewport_segments_api');
checkbox_viewport_segments_api_free_mode = document.getElementById('checkbox_viewport_segments_api_free_mode');
insertPoint = document.getElementById('viewport_segments_insert_point');
let minMargins = {};
let newData = {};
const container = document.querySelector('main');
let isDown = false;
let startX;
let startY;
let scrollLeft;
let scrollTop;
onChangeElements = [
    checkbox_screen_fold_api,
    list_viewport_segments_api,
    checkbox_diagonal,
    input_diagonal,
    win_width,
    win_height,
    input_dpi,
    scale,
    checkbox_viewport_segments_api,
    color,
    color_gamut,
    color_index,
    forced_colors,
    forced_colors_type,
    inverted_colors,
    monochrome,
    monochrome_color,
    checkbox_monochrome,
    dynamic_range,
    color_scheme,
    contrast,
    reduced_motion,
    reduced_transparency,
    update,
    grid_type,
    display_mode,
    overflow_block,
    overflow_inline,
    wekit_transform_3d,
    browser,
    scripting,
    hover,
    pointer,
    screen_fold_api_max,
    safe_area_inset_left,
    safe_area_inset_right,
    safe_area_inset_top,
    safe_area_inset_bottom,
    titlebar_area_width,
    titlebar_area_height,
    titlebar_area_x,
    titlebar_area_y
];
onChangeElements.forEach(element => {
    element.addEventListener('change', () => {
        formCheck();
    });
});
navigation_bar_left.addEventListener('change', () => {
    formCheck();
    if (win_width.value - navigation_bar_left.value - navigation_bar_right.value <= 0) {
        while (win_width.value - navigation_bar_left.value - navigation_bar_right.value <= 0) {
            navigation_bar_left.value = navigation_bar_left.value - 1;
        }
    }
});
navigation_bar_right.addEventListener('change', () => {
    formCheck();
    if (win_width.value - navigation_bar_left.value - navigation_bar_right.value <= 0) {
        while (win_width.value - navigation_bar_left.value - navigation_bar_right.value <= 0) {
            navigation_bar_right.value = navigation_bar_right.value - 1;
        }
    }
});
navigation_bar_top.addEventListener('change', () => {
    formCheck();
    if (win_height.value - navigation_bar_top.value - navigation_bar_bottom.value <= 0) {
        while (win_height.value - navigation_bar_top.value - navigation_bar_bottom.value <= 0) {
            navigation_bar_top.value = navigation_bar_top.value - 1;
        }
    }
});
navigation_bar_bottom.addEventListener('change', () => {
    formCheck();
    if (win_height.value - navigation_bar_top.value - navigation_bar_bottom.value <= 0) {
        while (win_height.value - navigation_bar_top.value - navigation_bar_bottom.value <= 0) {
            navigation_bar_bottom.value = navigation_bar_bottom.value - 1;
        }
    }
});
//------------------------------------------------------------------
const inputs = [safe_area_inset_left, safe_area_inset_right, safe_area_inset_top, safe_area_inset_bottom, titlebar_area_width, titlebar_area_height, titlebar_area_x, titlebar_area_y];
const inputToCSS = {
    safe_area_inset_left: '--emulator-safe-area-inset-left',
    safe_area_inset_right: '--emulator-safe-area-inset-right',
    safe_area_inset_top: '--emulator-safe-area-inset-top',
    safe_area_inset_bottom: '--emulator-safe-area-inset-bottom',
    titlebar_area_width: '--emulator-titlebar-area-width',
    titlebar_area_height: '--emulator-titlebar-area-height',
    titlebar_area_x: '--emulator-titlebar-area-x',
    titlebar_area_y: '--emulator-titlebar-area-y'
};
// Dla każdego inputa osobno
inputs.forEach(input => {
    async function envValues() {
        for (const input of inputs) {
            const id = input.id;
            const value = input.value + 'px';
            const cssVar = inputToCSS[id];
            if (!cssVar) continue;
            await window.appAPI.setVariable(cssVar, value);
            document.documentElement.style.setProperty(cssVar, value);
        }
    }
    input.addEventListener('change', envValues);
    window.addEventListener('load', envValues);
});
//Form validation----------------------------------------------------------------------------------------------------------------------------------------------------------------------
function manageObj(el, action) {
    if (action == 0) {
        //hide
        el.style.display = 'none';
    } else if (action == 1) {
        //show table
        el.style.display = 'table-row';
    } else if (action == 2) {
        //lock object
        el.style.pointerEvents = 'none';
        el.style.opacity = '0.6';
    } else if (action == 3) {
        //unlock object
        el.style.pointerEvents = 'all';
        el.style.opacity = '1';
    }
}
function formCheck() {
    win_width.value = Math.round(win_width.value);
    win_height.value = Math.round(win_height.value);
    navigation_bar_left.value = Math.round(navigation_bar_left.value);
    navigation_bar_right.value = Math.round(navigation_bar_right.value);
    navigation_bar_top.value = Math.round(navigation_bar_top.value);
    navigation_bar_bottom.value = Math.round(navigation_bar_bottom.value);
    if (win_width.value < 1) {
        win_width.value = 1;
    }
    if (win_height.value < 1) {
        win_height.value = 1;
    }
    if (scale.value < 1) {
        scale.value = 1;
    }
    if (navigation_bar_left.value < 0) {
        navigation_bar_left.value = 0;
    }
    if (navigation_bar_right.value < 0) {
        navigation_bar_right.value = 0;
    }
    if (navigation_bar_top.value < 0) {
        navigation_bar_top.value = 0;
    }
    if (navigation_bar_bottom.value < 0) {
        navigation_bar_bottom.value = 0;
    }
    if (input_diagonal.value <= 0 && checkbox_diagonal.checked) {
        input_diagonal.value = 1;
    }
    if (input_dpi.value <= 0) {
        input_dpi.value = 1;
    }
    //Data update----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    newData.win_width = win_width.value;
    newData.win_height = win_height.value;
    newData.viewport_width = win_width.value - navigation_bar_left.value - navigation_bar_right.value;
    newData.viewport_height = win_height.value - navigation_bar_top.value - navigation_bar_bottom.value;
    newData.navigation_bar_left = navigation_bar_left.value;
    newData.navigation_bar_right = navigation_bar_right.value;
    newData.navigation_bar_top = navigation_bar_top.value;
    newData.navigation_bar_bottom = navigation_bar_bottom.value;
    color.value = Math.round(color.value);
    if (monochrome.value != 0) {
        color.value = 0;
        manageObj(color, 2);
        manageObj(monochrome_color, 3);
        manageObj(checkbox_monochrome, 3);
    } else {
        color.value = 1;
        manageObj(color, 3);
        manageObj(checkbox_monochrome, 2);
        checkbox_monochrome.checked = false;
    }
    if (monochrome.value == 0) {
        manageObj(monochrome_color, 2);
    }
    newData.color = color.value;
    newData.color_gamut = color_gamut.value;
    if (color_index.value < 0) {
        color_index.value = 0;
    }
    color_index.value = Math.round(color_index.value);
    newData.color_index = color_index.value;
    newData.forced_colors = forced_colors.value;
    if (forced_colors.value == 'active') {
        manageObj(forced_colors_type, 3);
        window.appAPI.contrastType(forced_colors_type.value);
    } else {
        manageObj(forced_colors_type, 2);
        window.appAPI.contrastType('none');
    }
    newData.inverted_colors = inverted_colors.value;
    newData.monochrome = monochrome.value;
    newData.monochrome_color = monochrome_color.value;
    newData.monochrome_filter = checkbox_monochrome.checked ? 1 : 0;
    newData.dynamic_range = dynamic_range.value;
    newData.color_scheme = color_scheme.value;
    newData.contrast = contrast.value;
    newData.reduced_motion = reduced_motion.value;
    newData.reduced_transparency = reduced_transparency.value;
    newData.update = update.value;
    newData.grid = grid_type.value;
    newData.mod = scale.value;
    newData.display_mode = display_mode.value;
    newData.overflow_block = overflow_block.value;
    newData.overflow_inline = overflow_inline.value;
    newData.wekit_transform_3d = wekit_transform_3d.value;
    newData.browser = browser.value;
    newData.scripting = scripting.value;
    newData.hover = hover.value;
    newData.pointer = pointer.value;
    if (checkbox_screen_fold_api.checked) {
        screen_fold_api_max.value = Math.round(screen_fold_api_max.value);
        if (screen_fold_api_max.value <= 0) {
            screen_fold_api_max.value = 1;
        }
        if (screen_fold_api_max.value > 360) {
            screen_fold_api_max.value = 360;
        }
        newData.screen_fold_api_max = screen_fold_api_max.value;
    } else newData.screen_fold_api_max = 0;
    if (checkbox_viewport_segments_api.checked) {
        manageObj(list_viewport_segments_api, 1);
        manageObj(insertPoint, 1);
    } else {
        manageObj(list_viewport_segments_api, 0);
        manageObj(insertPoint, 0);
        checkbox_viewport_segments_api_free_mode.checked = false;
        removeAllSegments();
    }
    newData.safe_area_inset_left = safe_area_inset_left.value;
    newData.safe_area_inset_right = safe_area_inset_right.value;
    newData.safe_area_inset_top = safe_area_inset_top.value;
    newData.safe_area_inset_bottom = safe_area_inset_bottom.value;
    newData.titlebar_area_width = titlebar_area_width.value;
    newData.titlebar_area_height = titlebar_area_height.value;
    newData.titlebar_area_x = titlebar_area_x.value;
    newData.titlebar_area_y = titlebar_area_y.value;
    //Display diagonal field, block DPI------------------------------------------------------------------------------------------------------------------------------------------------
    if (checkbox_diagonal.checked) {
        manageObj(list_diagonal, 1);
        manageObj(input_dpi, 2);
    } else if (!checkbox_diagonal.checked) {
        manageObj(list_diagonal, 0);
        manageObj(input_dpi, 3);
    }
    dpiCalc();
    if (checkbox_screen_fold_api.checked) {
        manageObj(list_screen_fold_api, 1);
    } else manageObj(list_screen_fold_api, 0);
    newData.spanning = 'none';
    if (checkbox_screen_fold_api.checked && segments['0_0'] != undefined && segments['1_0'] != undefined && Object.keys(segments).length === 2) {
        newData.spanning = 'single-fold-horizontal';
    }
    if (checkbox_screen_fold_api.checked && segments['0_0'] != undefined && segments['0_1'] != undefined && Object.keys(segments).length === 2) {
        newData.spanning = 'single-fold-vertical';
    }
    window.appAPI.saveJson(newData);

    //Device type detection------------------------------------------------------------------------------------------------------------------------------------------------------------
    let device_type = '16_9';
    if (forced_colors.value == 'active' && inverted_colors.value == 'inverted') {
        device_type = '16_9_contrast_inverted';
    } else if (forced_colors.value == 'active') {
        device_type = '16_9_contrast';
    } else if (inverted_colors.value == 'inverted') {
        device_type = '16_9_inverted';
    }
    if (win_width.value / 4 == win_height.value / 3) {
        device_type = '4_3';
        if (forced_colors.value == 'active' && inverted_colors.value == 'inverted') {
            device_type = '4_3_contrast_inverted';
        } else if (forced_colors.value == 'active') {
            device_type = '4_3_contrast';
        } else if (inverted_colors.value == 'inverted') {
            device_type = '4_3_inverted';
        }
    }
    if (win_width.value / 21 == win_height.value / 9) {
        device_type = '21_9';
        if (forced_colors.value == 'active' && inverted_colors.value == 'inverted') {
            device_type = '21_9_contrast_inverted';
        } else if (forced_colors.value == 'active') {
            device_type = '21_9_contrast';
        } else if (inverted_colors.value == 'inverted') {
            device_type = '21_9_inverted';
        }
    }
    //Smartphone
    if (pointer.value == 'coarse' && parseFloat(win_width.value) < parseFloat(win_height.value) && monochrome.value == 0) {
        device_type = 'smartphone';
    }
    //Smartwatch
    if (win_width.value == win_height.value && pointer.value == 'coarse') {
        device_type = 'smartwatch';
    }
    //Viewport segments API
    if (checkbox_viewport_segments_api.checked || checkbox_screen_fold_api.checked) {
        if (segments['0_0'] != undefined && segments['1_0'] != undefined && Object.keys(segments).length === 2) {
            device_type = 'fold';
        } else if (segments['0_0'] != undefined && segments['0_1'] != undefined && Object.keys(segments).length === 2) {
            device_type = 'flip';
        } else device_type = 'smartphone';

        if (Object.keys(segments).length >= 3) device_type = 'intresting';
    }

    //Monochrome terminals
    if (monochrome.value != 0) {
        if (monochrome_color.value == 'white') {
            device_type = 'monochrome_white';
        } else if (monochrome_color.value == 'green') {
            device_type = 'monochrome_green';
        } else if (monochrome_color.value == 'blue') {
            device_type = 'monochrome_blue';
        } else if (monochrome_color.value == 'amber') {
            device_type = 'monochrome_amber';
        }
    }
    //Grid
    if (grid_type.value == 1) {
        device_type = 'grid';
    }
    //Printer
    if (update.value == 'none') {
        device_type = 'printer';
    }
    document.querySelector('aside').style.backgroundImage = `url(devices/${device_type}.png)`;
}
//DPI calculations---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function dpiCalc() {
    if (checkbox_diagonal.checked) {
        input_dpi.value = Math.round((Math.sqrt(Math.pow(win_width.value, 2) + Math.pow(win_height.value, 2)) / input_diagonal.value) * 100) / 100;
    } else input_dpi.value = Math.round(input_dpi.value * 100) / 100;
    newData.dpi = input_dpi.value;
}
//Start screen emulating---------------------------------------------------------------------------------------------------------------------------------------------------------------
document.getElementById('openWindow').addEventListener('click', () => {
    document.getElementById('iframe_panel').src = document.getElementById('iframe_panel').src;
    document.getElementById('iframe_panel').style.display = 'block';
    manageObj(document.getElementById('closeWindow'), 3);
    manageObj(document.getElementById('openWindow'), 2);
    modifier = scale.value;
    if (parseFloat(newData.viewport_width) > parseFloat(newData.viewport_height)) {
        newData.orientation = 'landscape';
    } else newData.orientation = 'portrait';
    if (parseFloat(newData.win_width) > parseFloat(newData.win_height)) {
        newData.orientation_window = 'landscape';
    } else newData.orientation_window = 'portrait';
    window.appAPI.saveJson(newData);
    window.appAPI.openNewWindow(document.getElementById('window_width').value / modifier, document.getElementById('window_height').value / modifier, 2, modifier);
});
//Stop screen emulating----------------------------------------------------------------------------------------------------------------------------------------------------------------
async function closeWindow() {
    document.getElementById('iframe_panel').style.display = 'none';
    manageObj(document.getElementById('closeWindow'), 2);
    manageObj(document.getElementById('openWindow'), 3);
    window.appAPI.closeNewWin1();
    formCheck();
}
//Rendering data-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
async function copyAndAnalyze() {
    const copyOk = await window.appAPI.copyProjectFiles();
    if (copyOk) {
        const analyzeOk = await window.appAPI.analyzeMediaQueries();
        if (analyzeOk) {
            const transformOk = await window.appAPI.transformCSS();
            if (transformOk) {
                const appendOk = await window.appAPI.appendScriptToHTML();
                if (!appendOk) {
                    console.error('The script could not be added to the HTML file.');
                }
            }
        } else {
            console.error('Media queries analysis failed.');
        }
    } else {
        console.error('Failed to copy files.');
    }
}
//Scrolling options--------------------------------------------------------------------------------------------------------------------------------------------------------------------
container.addEventListener('mousedown', e => {
    isDown = true;
    container.classList.add('active');
    startY = e.pageY - container.offsetTop;
    scrollTop = container.scrollTop;
});
container.addEventListener('mouseleave', () => {
    isDown = false;
    container.classList.remove('active');
});
container.addEventListener('mouseup', () => {
    isDown = false;
    container.classList.remove('active');
});
container.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const y = e.pageY - container.offsetTop;
    const walkY = y - startY;
    container.scrollTop = scrollTop - walkY;
});

//Viewports----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
let segments = {};
let existingSegments = new Set();

function hasNeighbor(x, y) {
    return (x === 0 && (y === 0 || existingSegments.has(`0_${y - 1}`))) || (x > 0 && existingSegments.has(`${x - 1}_${y}`));
}

function isBlockedByDependents(id) {
    const [x, y] = id.split('_').map(Number);
    const dependents = [`${x + 1}_${y}`, `${x}_${y + 1}`];
    return dependents.some(dep => existingSegments.has(dep));
}

function getNextCoords() {
    if (existingSegments.size === 0) {
        return '0_0';
    }

    const coords = [...existingSegments].map(e => e.split('_').map(Number));
    const next = new Set();

    for (const [x, y] of coords) {
        const candidates = [
            [x + 1, y],
            [x, y + 1]
        ];
        for (const [nx, ny] of candidates) {
            const key = `${nx}_${ny}`;
            if (!existingSegments.has(key) && hasNeighbor(nx, ny)) {
                next.add(key);
            }
        }
    }

    for (const key of next) {
        return key;
    }

    return null;
}

function generateAvailableCoordOptions(currentId) {
    const max = 10;
    const options = [];
    for (let x = 0; x < max; x++) {
        for (let y = 0; y < max; y++) {
            const id = `${x}_${y}`;
            if (existingSegments.has(id) && id !== currentId) continue;
            if (!hasNeighbor(x, y, currentId)) continue;
            options.push(`<option value="${id}" ${id === currentId ? 'selected' : ''}>${id}</option>`);
        }
    }
    return options.join('');
}

function findFirstFreeCoord() {
    let x = 0,
        y = 0;
    while (existingSegments.has(`${x}_${y}`)) {
        x++;
        if (x > 1000) {
            // zabezpieczenie
            x = 0;
            y++;
        }
    }
    return [x, y];
}

function handleFreeCoordChange(oldId, xInput, yInput) {
    const newX = parseInt(xInput.value, 10);
    const newY = parseInt(yInput.value, 10);

    if (isNaN(newX) || isNaN(newY)) return;

    const newId = `${newX}_${newY}`;

    if (existingSegments.has(newId) && newId !== oldId) {
        alert(`Segment ${newId} już istnieje.`);
        const [oldX, oldY] = oldId.split('_');
        xInput.value = oldX;
        yInput.value = oldY;
        return;
    }

    if (newId === oldId) return;

    // przenosimy dane
    segments[newId] = { ...segments[oldId] };
    delete segments[oldId];
    existingSegments.delete(oldId);
    existingSegments.add(newId);

    const [oldX, oldY] = oldId.split('_');
    const baseOld = `viewport_segments_api_${oldX}_${oldY}`;
    const baseNew = `viewport_segments_api_${newX}_${newY}`;

    // aktualizujemy wszystkie elementy w tym segmencie
    const container = xInput.closest('tbody') || xInput.closest('table');
    container.querySelectorAll(`[id^="${baseOld}"]`).forEach(el => {
        const newElId = el.id.replace(baseOld, baseNew);
        el.id = newElId;

        if (el.tagName === 'INPUT' && el.type === 'number' && !el.id.endsWith('_x') && !el.id.endsWith('_y')) {
            const attr = el.id.split('_').pop();
            el.setAttribute('onchange', `handleValueChange('${newId}', '${attr}', this)`);
        }
        if (el.id.endsWith('_x')) {
            el.setAttribute('onchange', `handleFreeCoordChange('${newId}', this, document.getElementById('${baseNew}_y'))`);
        }
        if (el.id.endsWith('_y')) {
            el.setAttribute('onchange', `handleFreeCoordChange('${newId}', document.getElementById('${baseNew}_x'), this)`);
        }
    });

    // przycisk remove
    const btn = container.querySelector(`button[onclick="removeSegment('${oldId}')"]`);
    if (btn) btn.setAttribute('onclick', `removeSegment('${newId}')`);

    removeViewportCSSVars(oldId);
    updateViewportCSSVars(newId);
}

function createSegmentHTML(x, y) {
    const baseId = `viewport_segments_api_${x}_${y}`;
    const id = `${x}_${y}`;

    if (!checkbox_viewport_segments_api_free_mode.checked) {
        // Tryb kontrolowany
        return `
        <tr>
            <th colspan="2">
                viewport
                <select id="${baseId}_coord" onchange="handleCoordChangeFull('${id}', this)">
                    ${generateAvailableCoordOptions(id)}
                </select>
                :
            </th>
        </tr>
        ${['width', 'height', 'left', 'right', 'top', 'bottom']
            .map(
                attr => `
        <tr>
            <td>${attr}:</td>
            <td><input type="number" id="${baseId}_${attr}" value="0" 
                onchange="handleValueChange('${id}', '${attr}', this)" /> px</td>
        </tr>`
            )
            .join('')}
        <tr>
            <td colspan="2" class="buttons">
                <button onclick="removeSegment('${id}')">Remove segment</button>
            </td>
        </tr>`;
    } else {
        // Tryb free mode — bez walidacji, z ręczną zmianą X/Y
        return `
        <tr>
            <th colspan="2">
                viewport
                X: <input type="number" min="0" id="${baseId}_x" value="${x}" 
                    onchange="handleFreeCoordChange('${id}', this, document.getElementById('${baseId}_y'))" />
                Y: <input type="number" min="0" id="${baseId}_y" value="${y}" 
                    onchange="handleFreeCoordChange('${id}', document.getElementById('${baseId}_x'), this)" />
                :
            </th>
        </tr>
        ${['width', 'height', 'left', 'right', 'top', 'bottom']
            .map(
                attr => `
        <tr>
            <td>${attr}:</td>
            <td><input type="number" id="${baseId}_${attr}" value="0" 
                onchange="handleValueChange('${id}', '${attr}', this)" /> px</td>
        </tr>`
            )
            .join('')}
        <tr>
            <td colspan="2" class="buttons">
                <button onclick="removeSegment('${id}')">Remove segment</button>
            </td>
        </tr>`;
    }
}

function handleValueChange(id, key, el) {
    rebuildSegmentsFromDOM();

    const val = parseInt(el.value, 10);
    if (isNaN(val)) return;

    const seg = segments[id];
    if (!seg) return;

    const prev = seg[key];
    const viewportWidth = parseInt(win_width.value, 10);
    const viewportHeight = parseInt(win_height.value, 10);

    // Wstępnie ustaw nową wartość marginesu
    seg[key] = val;

    if (!checkbox_viewport_segments_api_free_mode.checked) {
        // Tryb automatyczny — pełna walidacja i przeliczenia

        let newWidth = viewportWidth - seg.left - seg.right;
        let newHeight = viewportHeight - seg.top - seg.bottom;

        const minVal = minMargins?.[id]?.[key];
        if (typeof minVal === 'number' && val < minVal) {
            console.warn(`Minimalna wartość dla ${key} to ${minVal}px`);
            seg[key] = minVal;
            el.value = minVal;

            newWidth = viewportWidth - seg.left - seg.right;
            newHeight = viewportHeight - seg.top - seg.bottom;

            seg.width = Math.max(newWidth, 1);
            seg.height = Math.max(newHeight, 1);

            updateInputsAndCSS(id, seg);
            return;
        }

        if (newWidth < 1 || newHeight < 1) {
            console.warn('Szerokość i wysokość muszą mieć co najmniej 1 piksel!');

            if (key === 'left' || key === 'right') {
                const otherMargin = key === 'left' ? seg.right : seg.left;
                const maxMargin = viewportWidth - 1 - otherMargin;

                seg[key] = Math.min(prev, maxMargin);
                el.value = seg[key];
            } else if (key === 'top' || key === 'bottom') {
                const otherMargin = key === 'top' ? seg.bottom : seg.top;
                const maxMargin = viewportHeight - 1 - otherMargin;

                seg[key] = Math.min(prev, maxMargin);
                el.value = seg[key];
            }

            newWidth = viewportWidth - seg.left - seg.right;
            newHeight = viewportHeight - seg.top - seg.bottom;

            seg.width = Math.max(newWidth, 1);
            seg.height = Math.max(newHeight, 1);

            updateInputsAndCSS(id, seg);
            return;
        }

        seg.width = newWidth;
        seg.height = newHeight;

        updateInputsAndCSS(id, seg);
    } else {
        // Tryb free mode — brak walidacji marginesów

        // Jeśli zmieniamy pole, które odpowiada za ID (np. 'id' albo 'coord'),
        // to przenosimy dane tak jak w handleCoordChangeFull, ale bez blokad
        if (key === 'coord') {
            const newId = el.value;

            // Jeśli taki ID już istnieje, to robimy go unikalnym
            let finalId = newId;
            let counter = 1;
            while (segments[finalId]) {
                finalId = `${newId}_${counter++}`;
            }

            // Przenieś dane do nowego ID
            segments[finalId] = { ...segments[id] };
            delete segments[id];

            // Zmieniamy ID w DOM
            const [oldX, oldY] = id.split('_');
            const [newX, newY] = finalId.split('_');
            const baseOld = `viewport_segments_api_${oldX}_${oldY}`;
            const baseNew = `viewport_segments_api_${newX}_${newY}`;

            document.querySelectorAll(`[id^="${baseOld}"]`).forEach(input => {
                input.id = input.id.replace(baseOld, baseNew);

                if (input.tagName === 'INPUT') {
                    const attr = input.id.split('_').pop();
                    input.setAttribute('onchange', `handleValueChange('${finalId}', '${attr}', this)`);
                }
            });

            const btn = document.querySelector(`button[onclick="removeSegment('${id}')"]`);
            if (btn) btn.setAttribute('onclick', `removeSegment('${finalId}')`);
        } else {
            // Zwykła zmiana wartości w free mode
            seg[key] = val;
        }

        updateInputsAndCSS(id, seg);
    }
}

function updateInputsAndCSS(id, seg) {
    const baseId = `viewport_segments_api_${id}`;

    ['width', 'height', 'left', 'right', 'top', 'bottom'].forEach(key => {
        const input = document.getElementById(`${baseId}_${key}`);
        if (input) {
            input.value = seg[key];
        }
    });

    updateViewportCSSVars(id);
}

async function handleCoordChangeFull(oldId, selectEl) {
    const newId = selectEl.value;

    if (existingSegments.has(newId)) {
        alert(`Segment ${newId} już istnieje.`);
        selectEl.value = oldId;
        return;
    }

    if (!hasNeighbor(...newId.split('_').map(Number), oldId)) {
        alert(`Segment ${newId} nie ma sąsiada.`);
        selectEl.value = oldId;
        return;
    }

    if (isBlockedByDependents(oldId)) {
        alert(`Nie można zmienić ID segmentu ${oldId}, ponieważ inne segmenty od niego zależą.`);
        selectEl.value = oldId;
        return;
    }

    // Przenieś dane
    segments[newId] = { ...segments[oldId] };
    delete segments[oldId];
    existingSegments.delete(oldId);
    existingSegments.add(newId);

    // Zamień ID w DOM
    const [oldX, oldY] = oldId.split('_');
    const [newX, newY] = newId.split('_');
    const baseOld = `viewport_segments_api_${oldX}_${oldY}`;
    const baseNew = `viewport_segments_api_${newX}_${newY}`;

    document.querySelectorAll(`[id^="${baseOld}"]`).forEach(el => {
        const newElId = el.id.replace(baseOld, baseNew);
        el.id = newElId;

        if (el.tagName === 'SELECT') {
            el.setAttribute('onchange', `handleCoordChangeFull('${newId}', this)`);
            el.innerHTML = generateAvailableCoordOptions(newId);
        } else if (el.tagName === 'INPUT') {
            const attr = el.id.split('_').pop();
            el.setAttribute('onchange', `handleValueChange('${newId}', '${attr}', this)`);
        }
    });

    const btn = document.querySelector(`button[onclick="removeSegment('${oldId}')"]`);
    if (btn) btn.setAttribute('onclick', `removeSegment('${newId}')`);
    if (!checkbox_viewport_segments_api_free_mode.checked) {
        autoLayoutSegmentSizes();
    }
    await removeViewportCSSVars(oldId);
    updateViewportCSSVars(newId);
    formCheck();
}

function rebuildSegmentsFromDOM() {
    segments = {};
    existingSegments = new Set();

    const allInputs = document.querySelectorAll("[id^='viewport_segments_api_']");

    allInputs.forEach(input => {
        const match = input.id.match(/^viewport_segments_api_(\d+)_(\d+)_(\w+)$/);
        if (!match) return;

        const [_, x, y, key] = match;
        const id = `${x}_${y}`;
        if (!segments[id]) {
            segments[id] = {
                width: 0,
                height: 0,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            };
            existingSegments.add(id);
        }

        const value = input.tagName === 'SELECT' ? parseInt(input.value, 10) : parseInt(input.value || 0, 10);
        if (!isNaN(value)) {
            segments[id][key] = value;
        }
    });
}

function autoLayoutSegmentSizes() {
    const viewportWidth = parseInt(win_width.value, 10);
    const viewportHeight = parseInt(win_height.value, 10);

    if (isNaN(viewportWidth) || isNaN(viewportHeight) || viewportWidth <= 0 || viewportHeight <= 0) {
        alert('Nieprawidłowe wymiary viewportu.');
        return;
    }

    rebuildSegmentsFromDOM();

    const segmentsByRow = {};
    const segmentsByCol = {};

    for (const id in segments) {
        const [x, y] = id.split('_').map(Number);

        if (!segmentsByRow[y]) segmentsByRow[y] = new Set();
        segmentsByRow[y].add(x);

        if (!segmentsByCol[x]) segmentsByCol[x] = new Set();
        segmentsByCol[x].add(y);
    }

    // Oblicz szerokości wierszy
    const rowWidths = {};
    for (const y in segmentsByRow) {
        const xList = [...segmentsByRow[y]].sort((a, b) => a - b);
        const count = xList.length;
        const base = Math.floor(viewportWidth / count);
        let used = 0;
        rowWidths[y] = {};

        xList.forEach((x, idx) => {
            const width = idx === count - 1 ? viewportWidth - used : base;
            rowWidths[y][x] = width;
            used += width;
        });
    }

    // 🔧 Nowy sposób liczenia wysokości — wspólne yList dla wszystkich kolumn
    const allYSet = new Set();
    for (const x in segmentsByCol) {
        for (const y of segmentsByCol[x]) {
            allYSet.add(y);
        }
    }

    const allYList = [...allYSet].sort((a, b) => a - b);
    const totalRows = allYList.length;
    const baseHeight = Math.floor(viewportHeight / totalRows);
    let usedHeight = 0;

    const yHeights = {};
    allYList.forEach((y, idx) => {
        const height = idx === totalRows - 1 ? viewportHeight - usedHeight : baseHeight;
        yHeights[y] = height;
        usedHeight += height;
    });

    // Przypisz tylko te y, które są w danej kolumnie
    const colHeights = {};
    for (const x in segmentsByCol) {
        colHeights[x] = {};
        for (const y of segmentsByCol[x]) {
            colHeights[x][y] = yHeights[y];
        }
    }

    // Teraz marginesy
    for (const id in segments) {
        const [x, y] = id.split('_').map(Number);

        const width = rowWidths[y]?.[x] ?? 0;
        const height = colHeights[x]?.[y] ?? 0;

        let left = 0;
        for (let xi = 0; xi < x; xi++) {
            if (rowWidths[y]?.[xi]) {
                left += rowWidths[y][xi];
            }
        }

        let top = 0;
        for (let yi = 0; yi < y; yi++) {
            if (colHeights[x]?.[yi]) {
                top += colHeights[x][yi];
            }
        }

        segments[id].width = width;
        segments[id].height = height;
        segments[id].left = left;
        segments[id].top = top;
        segments[id].right = viewportWidth - left - width;
        segments[id].bottom = viewportHeight - top - height;
    }

    for (const id in segments) {
        const seg = segments[id];
        const baseId = `viewport_segments_api_${id}`;

        for (const key of ['width', 'height', 'left', 'top', 'right', 'bottom']) {
            const input = document.getElementById(`${baseId}_${key}`);
            if (input) input.value = seg[key];
        }
    }
    for (const id in segments) {
        updateViewportCSSVars(id);
    }

    minMargins = {};
    for (const id in segments) {
        minMargins[id] = {
            left: segments[id].left,
            right: segments[id].right,
            top: segments[id].top,
            bottom: segments[id].bottom
        };
    }
}

async function updateViewportCSSVars(id) {
    if (!segments[id]) return;
    const [x, y] = id.split('_');
    for (const key of ['width', 'height', 'left', 'top', 'right', 'bottom']) {
        const value = segments[id][key] + 'px';
        const cssVar = `--emulator-viewport-segment-${key}-${x}-${y}`;
        await window.appAPI.setVariable(cssVar, value);
        document.documentElement.style.setProperty(cssVar, value);
    }
}

async function removeSegment(id, force = false) {
    if (!force && isBlockedByDependents(id)) {
        alert(`Nie można usunąć segmentu ${id}, ponieważ inne segmenty od niego zależą.`);
        return;
    }

    const base = `viewport_segments_api_${id}`;
    const elements = [...document.querySelectorAll(`[id^="${base}"]`)];
    elements.forEach(el => {
        const tr = el.closest('tr');
        if (tr) tr.remove();
    });

    const btn = document.querySelector(`button[onclick="removeSegment('${id}')"]`);
    if (btn) btn.closest('tr').remove();

    delete segments[id];
    existingSegments.delete(id);
    await removeViewportCSSVars(id);
    if (!checkbox_viewport_segments_api_free_mode.checked) {
        autoLayoutSegmentSizes();
    }
    formCheck();
}

async function removeViewportCSSVars(id) {
    const [x, y] = id.split('_');
    for (const key of ['width', 'height', 'left', 'top', 'right', 'bottom']) {
        const cssVar = `--emulator-viewport-segment-${key}-${x}-${y}`;
        await window.appAPI.setVariable(cssVar, null); // usuwa z JSON
        document.documentElement.style.removeProperty(cssVar); // usuwa z DOM
    }
}

async function removeAllSegments() {
    const segmentsToRemove = Array.from(existingSegments);

    for (const id of segmentsToRemove) {
        await removeSegment(id, true); // wymuszamy usunięcie
    }
}

document.getElementById('button_screen_fold_api_add_segment').addEventListener('click', () => {
    const coords = getNextCoords();
    if (!coords) return alert('Brak dostępnych współrzędnych');

    if (existingSegments.has(coords)) {
        alert(`Segment (${coords.replace('_', ', ')}) już istnieje.`);
        return;
    }

    const [x, y] = coords.split('_').map(Number);
    const html = createSegmentHTML(x, y);
    insertPoint.insertAdjacentHTML('afterend', html);

    segments[coords] = { width: 0, height: 0, left: 0, right: 0, top: 0, bottom: 0 };
    existingSegments.add(coords);
    updateViewportCSSVars(coords);

    if (!checkbox_viewport_segments_api_free_mode.checked) {
        autoLayoutSegmentSizes();
    }
    formCheck();
});

checkbox_viewport_segments_api_free_mode.addEventListener('change', () => {
    removeAllSegments();
});
//Iframe message listener--------------------------------------------------------------------------------------------------------------------------------------------------------------
window.addEventListener('message', event => {
    if (event.data.type === 'resize') {
        document.getElementById('iframe_panel').style.height = event.data.height + 'px';
    }
});
formCheck();
