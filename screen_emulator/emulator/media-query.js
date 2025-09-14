const emulator_currentFile = location.pathname.split('screen_emulator/render/').pop();
let emulator_media_query = {};
let emulator_panel = {};
let emulator_first_loop = 0;
let emulator_dpi_value = '';
let emulator_dual_screen = '';
fetch('http://localhost/screen_emulator/media-query-map.json')
    .then(res => res.json())
    .then(data => {
        const emulator_classesMap = data[emulator_currentFile] || {};
        for (const emulator_className in emulator_classesMap) {
            const emulator_safeVarName = emulator_className.replace(/-/g, '_');
            emulator_media_query[emulator_safeVarName] = emulator_classesMap[emulator_className];
        }
    });
setInterval(() => {
    fetch('http://localhost/screen_emulator/emulator/panel.json')
        .then(res => res.json())
        .then(data => {
            for (const emulator_key in data) {
                const emulator_safeVarName = emulator_key.replace(/-/g, '_');
                emulator_panel[emulator_safeVarName] = data[emulator_key];
            }
            emulator_dpi_value = emulator_panel['dpi'];
            emulator_dual_screen = emulator_panel['dual_screen'];
            if (emulator_first_loop == 0) {
                for (const emulator_key in emulator_media_query) {
                    if ((emulator_key.startsWith('emulator_resolution_') || emulator_key.startsWith('emulator_min_resolution_') || emulator_key.startsWith('emulator_max_resolution_')) && emulator_dpi_value != 'none') {
                        emulator_dpi_value = parseFloat(emulator_dpi_value);
                        emulator_dpx_value = Math.round((emulator_dpi_value / 96) * 100) / 100;
                        emulator_dcm_value = Math.round((emulator_dpi_value / 2.54) * 100) / 100;
                        emulator_dpi_class_name = emulator_key.replace(/_/g, '-');
                        emulator_dpi_class_type = emulator_key.split('emulator_')[1].split('resolution_')[0].slice(0, -1);
                        emulator_dpi_class_unit = emulator_key.slice(-3);
                        if (emulator_dpi_class_unit != 'dpx' && emulator_dpi_class_unit.slice(-1) == 'x') {
                            emulator_dpi_class_unit = 'x';
                        }
                        const emulator_rawValue = emulator_key
                            .split('resolution_')[1]
                            .slice(0, -3)
                            .replace(/__dot__/g, '.');
                        let emulator_dpi_class_value, emulator_dpx_class_value, emulator_dcm_class_value;
                        if (emulator_dpi_class_unit === 'dpi') {
                            emulator_dpi_class_value = parseFloat(emulator_rawValue);
                            emulator_dpx_class_value = Math.round((emulator_dpi_class_value / 96) * 100) / 100;
                            emulator_dcm_class_value = Math.round((emulator_dpi_class_value / 2.54) * 100) / 100;
                        } else if (emulator_dpi_class_unit === 'dpx' || emulator_dpi_class_unit === 'x') {
                            emulator_dpx_class_value = parseFloat(emulator_rawValue);
                            emulator_dpi_class_value = Math.round(emulator_dpx_class_value * 96 * 100) / 100;
                            emulator_dcm_class_value = Math.round((emulator_dpi_class_value / 2.54) * 100) / 100;
                        } else if (emulator_dpi_class_unit === 'dcm') {
                            emulator_dcm_class_value = parseFloat(emulator_rawValue);
                            emulator_dpi_class_value = Math.round(emulator_dcm_class_value * 2.54 * 100) / 100;
                            emulator_dpx_class_value = Math.round((emulator_dpi_class_value / 96) * 100) / 100;
                        }
                        if (
                            (emulator_dpi_class_type === '' && (emulator_dpi_class_value === emulator_dpi_value || emulator_dpx_class_value === emulator_dpx_value || emulator_dcm_class_value === emulator_dcm_value)) ||
                            (emulator_dpi_class_type === 'min' && (emulator_dpi_class_value <= emulator_dpi_value || emulator_dpx_class_value <= emulator_dpx_value || emulator_dcm_class_value <= emulator_dcm_value)) ||
                            (emulator_dpi_class_type === 'max' && (emulator_dpi_class_value >= emulator_dpi_value || emulator_dpx_class_value >= emulator_dpx_value || emulator_dcm_class_value >= emulator_dcm_value))
                        ) {
                            emulator_addClass(emulator_dpi_class_name, emulator_media_query[emulator_key], 1);
                        }
                    }
                    //Monochrome
                    if ((emulator_key.startsWith('emulator_min_monochrome') || emulator_key.startsWith('emulator_max_monochrome')) && data.monochrome != 0 && data.monochrome_filter == 0) {
                        emulator_monochrome_type = emulator_key.split('emulator_')[1].split('_monochrome_')[0];
                        emulator_monochrome_value = parseFloat(emulator_key.split('emulator_')[1].split('_monochrome_')[1]);
                        if (((emulator_monochrome_type == 'min' && emulator_monochrome_value <= data.monochrome) || (emulator_monochrome_type == 'max' && emulator_monochrome_value >= data.monochrome)) && emulator_monochrome_value != 0) {
                            emulator_addClass(emulator_key.replace(/_/g, '-'), emulator_media_query[emulator_key], 1);
                        }
                    }
                    if ((emulator_key == 'emulator_monochrome' && data.monochrome != 0) || (emulator_key == 'emulator_monochrome_0' && data.monochrome == 0)) {
                        emulator_addClass(emulator_key.replace(/_/g, '-'), emulator_media_query[emulator_key], 1);
                    }
                    if (emulator_key.startsWith('emulator_spanning')) {
                        console.log(data.spanning);
                        if (data.spanning == 'single-fold-horizontal') {
                            emulator_addClass('emulator-spanning-single-fold-horizontal', emulator_media_query['emulator_spanning_single_fold_horizontal'], 1);
                        } else if (data.spanning == 'single-fold-vertical') {
                            emulator_addClass('emulator-spanning-single-fold-vertical', emulator_media_query['emulator_spanning_single_fold_vertical'], 1);
                        }
                    }
                    //Color scheme
                    if (emulator_panel['color_scheme'] == 'light') {
                        emulator_addClass('emulator-prefers-color-scheme-light', emulator_media_query['emulator_prefers_color_scheme_light'], 1);
                    } else if (emulator_panel['color_scheme'] == 'dark') {
                        emulator_addClass('emulator-prefers-color-scheme-dark', emulator_media_query['emulator_prefers_color_scheme_dark'], 1);
                    }
                    //Contrast
                    if (emulator_panel['contrast'] == 'no-preference') {
                        emulator_addClass('emulator-prefers-contrast-no-preference', emulator_media_query['emulator_prefers_contrast_no_preference'], 1);
                    } else if (emulator_panel['contrast'] == 'custom') {
                        emulator_addClass('emulator-prefers-contrast-custom', emulator_media_query['emulator_prefers_contrast_custom'], 1);
                    } else if (emulator_panel['contrast'] == 'less') {
                        emulator_addClass('emulator-prefers-contrast-less', emulator_media_query['emulator_prefers_contrast_less'], 1);
                    } else if (emulator_panel['contrast'] == 'more') {
                        emulator_addClass('emulator-prefers-contrast-more', emulator_media_query['emulator_prefers_contrast_more'], 1);
                    }
                    //Reduced motion
                    if (emulator_panel['reduced_motion'] == 'no-preference') {
                        emulator_addClass('emulator-prefers-reduced-motion-no-preference', emulator_media_query['emulator_prefers_reduced_motion_no_preference'], 1);
                    } else if (emulator_panel['reduced_motion'] == 'reduce') {
                        emulator_addClass('emulator-prefers-reduced-motion-reduce', emulator_media_query['emulator_prefers_reduced_motion_reduce'], 1);
                    }
                    //Reduced transparency
                    if (emulator_panel['reduced_transparency'] == 'no-preference') {
                        emulator_addClass('emulator-prefers-reduced-transparency-no-preference', emulator_media_query['emulator_prefers_reduced_transparency_no_preference'], 1);
                    } else if (emulator_panel['reduced_transparency'] == 'reduce') {
                        emulator_addClass('emulator-prefers-reduced-transparency-reduce', emulator_media_query['emulator_prefers_reduced_transparency_reduce'], 1);
                    }
                    //Color gamut
                    if (emulator_panel['color_gamut'] == 'srgb') {
                        emulator_addClass('emulator-color-gamut-srgb', emulator_media_query['emulator_color_gamut_srgb'], 1);
                    } else if (emulator_panel['color_gamut'] == 'p3') {
                        emulator_addClass('emulator-color-gamut-p3', emulator_media_query['emulator_color_gamut_p3'], 1);
                    } else if (emulator_panel['color_gamut'] == 'rec2020') {
                        emulator_addClass('emulator-color-gamut-rec2020', emulator_media_query['emulator_color_gamut_rec2020'], 1);
                    }
                    //Forced colors
                    if (emulator_panel['forced_colors'] == 'none') {
                        emulator_addClass('emulator-forced-colors-none', emulator_media_query['emulator_forced_colors_none'], 1);
                    } else if (emulator_panel['forced_colors'] == 'active') {
                        emulator_addClass('emulator-forced-colors-active', emulator_media_query['emulator_forced_colors_active'], 1);
                        emulator_addClass('emulator-forced-colors-active-forced', '*', 1);
                        let emulator_all = document.querySelectorAll('*');
                        document.documentElement.dataset.effectiveFCA = 'auto';

                        emulator_all.forEach(el => {
                            let emulator_parent = el.parentElement;
                            let emulator_inherited = emulator_parent ? emulator_parent.dataset.effectiveFCA || 'auto' : 'auto';
                            let emulator_declared = el.getAttribute('data-forced-color-adjust') || getComputedStyle(el).getPropertyValue('forced-color-adjust') || 'auto';
                            emulator_declared = emulator_declared.trim();
                            if (el.tagName.toLowerCase() === 'body') {
                                emulator_declared = 'auto';
                            }

                            let emulator_effective;
                            if (emulator_declared === 'auto' || emulator_declared === 'none') {
                                emulator_effective = emulator_declared;
                            } else {
                                emulator_effective = emulator_inherited;
                            }
                            el.dataset.effectiveFCA = emulator_effective;
                        });
                        emulator_all.forEach(el => {
                            if (el.dataset.effectiveFCA === 'none') {
                                el.classList.remove('emulator-forced-colors-active-forced');
                            }
                        });
                    }
                    //Inverted colors
                    if (emulator_panel['inverted_colors'] == 'none') {
                        emulator_addClass('emulator-inverted-colors-none', emulator_media_query['emulator_inverted_colors_none'], 1);
                    } else if (emulator_panel['inverted_colors'] == 'inverted') {
                        emulator_addClass('emulator-inverted-colors-inverted', emulator_media_query['emulator_inverted_colors_inverted'], 1);
                    }
                    //Dynamic range
                    if (emulator_panel['dynamic_range'] == 'standard') {
                        emulator_addClass('emulator-dynamic-range-standard', emulator_media_query['emulator_dynamic_range_standard'], 1);
                    } else if (emulator_panel['dynamic_range'] == 'high') {
                        emulator_addClass('emulator-dynamic-range-high', emulator_media_query['emulator_dynamic_range_high'], 1);
                    }
                    //Color
                    if (
                        (emulator_key.startsWith('emulator_min_color') || emulator_key.startsWith('emulator_max_color')) &&
                        !(emulator_key.startsWith('emulator_min_color_index') || emulator_key.startsWith('emulator_max_color_index')) &&
                        data.color != 0
                    ) {
                        emulator_color_value = parseFloat(emulator_key.split('_').at(-1));
                        emulator_color_type = emulator_key.split('emulator_')[1].split('color_')[0].slice(0, -1);
                        if (((emulator_color_type == 'min' && emulator_color_value <= data.color) || (emulator_color_type == 'max' && emulator_color_value >= data.color)) && emulator_color_value != 0) {
                            emulator_addClass(emulator_key.replace(/_/g, '-'), emulator_media_query[emulator_key], 1);
                        }
                    }
                    if ((emulator_key == 'emulator_color' && data.color != 0) || (emulator_key == 'emulator_color_0' && data.color == 0) || (emulator_key.startsWith('emulator_color_') && emulator_key.split('_').at(-1) == data.color)) {
                        emulator_addClass(emulator_key.replace(/_/g, '-'), emulator_media_query[emulator_key], 1);
                    }
                    //Color index
                    if ((emulator_key.startsWith('emulator_min_color_index') || emulator_key.startsWith('emulator_max_color_index')) && data.color_index != 0) {
                        emulator_color_index_value = parseFloat(emulator_key.split('_').at(-1));
                        emulator_color_index_type = emulator_key.split('emulator_')[1].split('color_index_')[0].slice(0, -1);
                        if (((emulator_color_index_type == 'min' && emulator_color_index_value <= data.color_index) || (emulator_color_index_type == 'max' && emulator_color_index_value >= data.color_index)) && emulator_color_index_value != 0) {
                            emulator_addClass(emulator_key.replace(/_/g, '-'), emulator_media_query[emulator_key], 1);
                        }
                    }
                    if (
                        (emulator_key == 'emulator_color_index' && data.color_index != 0) ||
                        (emulator_key == 'emulator_color_index_0' && data.color_index == 0) ||
                        (emulator_key.startsWith('emulator_color_index_') && emulator_key.split('_').at(-1) == data.color_index)
                    ) {
                        emulator_addClass(emulator_key.replace(/_/g, '-'), emulator_media_query[emulator_key], 1);
                    }
                    //Update
                    if (emulator_panel['update'] == 'fast') {
                        emulator_addClass('emulator-update-fast', emulator_media_query['emulator_update_fast'], 1);
                    } else if (emulator_panel['update'] == 'slow') {
                        emulator_addClass('emulator-update-slow', emulator_media_query['emulator_update_slow'], 1);
                    } else if (emulator_panel['update'] == 'none') {
                        emulator_addClass('emulator-update-none', emulator_media_query['emulator_update_none'], 1);
                    }
                    //Grid
                    if (emulator_panel['grid'] == '0') {
                        emulator_addClass('emulator-grid-0', emulator_media_query['emulator_grid_0'], 1);
                    } else if (emulator_panel['grid'] == '1') {
                        emulator_addClass('emulator-grid-1', emulator_media_query['emulator_grid_1'], 1);
                    }
                    //Display mode
                    if (emulator_panel['display_mode'] == 'browser') {
                        emulator_addClass('emulator-display-mode-browser', emulator_media_query['emulator_display_mode_browser'], 1);
                    } else if (emulator_panel['display_mode'] == 'fullscreen') {
                        emulator_addClass('emulator-display-mode-fullscreen', emulator_media_query['emulator_display_mode_fullscreen'], 1);
                    } else if (emulator_panel['display_mode'] == 'minimal-ui') {
                        emulator_addClass('emulator-display-mode-minimal-ui', emulator_media_query['emulator_display_mode_minimal_ui'], 1);
                    } else if (emulator_panel['display_mode'] == 'picture-in-picture') {
                        emulator_addClass('emulator-display-mode-picture-in-picture', emulator_media_query['emulator_display_mode_picture_in_picture'], 1);
                    } else if (emulator_panel['display_mode'] == 'standalone') {
                        emulator_addClass('emulator-display-mode-standalone', emulator_media_query['emulator_display_mode_standalone'], 1);
                    } else if (emulator_panel['display_mode'] == 'window-controls-overlay') {
                        emulator_addClass('emulator-display-mode-window-controls-overlay', emulator_media_query['emulator_display_mode_window_controls_overlay'], 1);
                    }
                    //Overflow block
                    if (emulator_panel['overflow_block'] == 'none') {
                        emulator_addClass('emulator-overflow-block-none', emulator_media_query['emulator_overflow_block_none'], 1);
                    } else if (emulator_panel['overflow_block'] == 'paged') {
                        emulator_addClass('emulator-overflow-block-paged', emulator_media_query['emulator_overflow_block_paged'], 1);
                    } else if (emulator_panel['overflow_block'] == 'optional-paged') {
                        emulator_addClass('emulator-overflow-block-optional-paged', emulator_media_query['emulator_overflow_block_optional_paged'], 1);
                    } else if (emulator_panel['overflow_block'] == 'scroll') {
                        emulator_addClass('emulator-overflow-block-scroll', emulator_media_query['emulator_overflow_block_scroll'], 1);
                    }
                    //Overflow inline
                    if (emulator_panel['overflow_inline'] == 'none') {
                        emulator_addClass('emulator-overflow-inline-none', emulator_media_query['emulator_overflow_inline_none'], 1);
                    } else if (emulator_panel['overflow_inline'] == 'scroll') {
                        emulator_addClass('emulator-overflow-inline-scroll', emulator_media_query['emulator_overflow_inline_scroll'], 1);
                    }
                    //Wekit transform 3D
                    if (emulator_panel['wekit_transform_3d'] == 'true') {
                        if (emulator_media_query['emulator__webkit_transform_3d_true'] != undefined) {
                            emulator_addClass('emulator--webkit-transform-3d-true', emulator_media_query['emulator__webkit_transform_3d_true'], 1);
                        }
                        if (emulator_media_query['emulator__webkit_transform_3d'] != undefined) {
                            emulator_addClass('emulator--webkit-transform-3d', emulator_media_query['emulator__webkit_transform_3d'], 1);
                        }
                    } else if (emulator_panel['wekit_transform_3d'] == 'false' && emulator_media_query['emulator__webkit_transform_3d_false'] != undefined) {
                        emulator_addClass('emulator--webkit-transform-3d-false', emulator_media_query['emulator__webkit_transform_3d_false'], 1);
                    }
                    //Scripting
                    if (emulator_panel['scripting'] == 'enabled') {
                        emulator_addClass('emulator-scripting-enabled', emulator_media_query['emulator_scripting_enabled'], 1);
                    } else if (emulator_panel['scripting'] == 'initial-only') {
                        emulator_addClass('emulator-scripting-initial-only', emulator_media_query['emulator_scripting_initial_only'], 1);
                    } else if (emulator_panel['scripting'] == 'none') {
                        emulator_addClass('emulator-scripting-none', emulator_media_query['emulator_scripting_none'], 1);
                    }
                    //Pointer
                    switch (emulator_panel['pointer']) {
                        case 'fine':
                            emulator_addClass('emulator-pointer-fine', emulator_media_query['emulator_pointer_fine'], 1);
                            emulator_addClass('emulator-any-pointer-fine', emulator_media_query['emulator_any_pointer_fine'], 1);
                            break;

                        case 'coarse':
                            emulator_addClass('emulator-pointer-coarse', emulator_media_query['emulator_pointer_coarse'], 1);
                            emulator_addClass('emulator-any-pointer-coarse', emulator_media_query['emulator_any_pointer_coarse'], 1);
                            break;

                        case 'none':
                            emulator_addClass('emulator-pointer-none', emulator_media_query['emulator_pointer_none'], 1);
                            emulator_addClass('emulator-any-pointer-none', emulator_media_query['emulator_any_pointer_none'], 1);
                            break;

                        case 'fine-coarse':
                            emulator_addClass('emulator-pointer-fine', emulator_media_query['emulator_pointer_fine'], 1);
                            emulator_addClass('emulator-any-pointer-fine', emulator_media_query['emulator_any_pointer_fine'], 1);
                            emulator_addClass('emulator-any-pointer-coarse', emulator_media_query['emulator_any_pointer_coarse'], 1);
                            break;

                        case 'fine-none':
                            emulator_addClass('emulator-pointer-fine', emulator_media_query['emulator_pointer_fine'], 1);
                            emulator_addClass('emulator-any-pointer-fine', emulator_media_query['emulator_any_pointer_fine'], 1);
                            emulator_addClass('emulator-any-pointer-none', emulator_media_query['emulator_any_pointer_none'], 1);
                            break;

                        case 'fine-coarse-none':
                            emulator_addClass('emulator-pointer-fine', emulator_media_query['emulator_pointer_fine'], 1);
                            emulator_addClass('emulator-any-pointer-fine', emulator_media_query['emulator_any_pointer_fine'], 1);
                            emulator_addClass('emulator-any-pointer-coarse', emulator_media_query['emulator_any_pointer_coarse'], 1);
                            emulator_addClass('emulator-any-pointer-none', emulator_media_query['emulator_any_pointer_none'], 1);
                            break;

                        case 'none-fine':
                            emulator_addClass('emulator-pointer-none', emulator_media_query['emulator_pointer_none'], 1);
                            emulator_addClass('emulator-any-pointer-fine', emulator_media_query['emulator_any_pointer_fine'], 1);
                            emulator_addClass('emulator-any-pointer-none', emulator_media_query['emulator_any_pointer_none'], 1);
                            break;

                        case 'none-coarse':
                            emulator_addClass('emulator-pointer-none', emulator_media_query['emulator_pointer_none'], 1);
                            emulator_addClass('emulator-any-pointer-coarse', emulator_media_query['emulator_any_pointer_coarse'], 1);
                            emulator_addClass('emulator-any-pointer-none', emulator_media_query['emulator_any_pointer_none'], 1);
                            break;

                        case 'none-fine-coarse':
                            emulator_addClass('emulator-pointer-none', emulator_media_query['emulator_pointer_none'], 1);
                            emulator_addClass('emulator-any-pointer-fine', emulator_media_query['emulator_any_pointer_fine'], 1);
                            emulator_addClass('emulator-any-pointer-coarse', emulator_media_query['emulator_any_pointer_coarse'], 1);
                            emulator_addClass('emulator-any-pointer-none', emulator_media_query['emulator_any_pointer_none'], 1);
                            break;

                        case 'coarse-fine':
                            emulator_addClass('emulator-pointer-coarse', emulator_media_query['emulator_pointer_coarse'], 1);
                            emulator_addClass('emulator-any-pointer-fine', emulator_media_query['emulator_any_pointer_fine'], 1);
                            emulator_addClass('emulator-any-pointer-coarse', emulator_media_query['emulator_any_pointer_coarse'], 1);
                            break;

                        case 'coarse-fine-none':
                            emulator_addClass('emulator-pointer-coarse', emulator_media_query['emulator_pointer_coarse'], 1);
                            emulator_addClass('emulator-any-pointer-fine', emulator_media_query['emulator_any_pointer_fine'], 1);
                            emulator_addClass('emulator-any-pointer-coarse', emulator_media_query['emulator_any_pointer_coarse'], 1);
                            emulator_addClass('emulator-any-pointer-none', emulator_media_query['emulator_any_pointer_none'], 1);
                            break;
                    }
                    //Hover
                    switch (emulator_panel['hover']) {
                        case 'none':
                            emulator_addClass('emulator-hover-none', emulator_media_query['emulator_hover_none'], 1);
                            emulator_addClass('emulator-any-hover-none', emulator_media_query['emulator_any_hover_none'], 1);
                            break;

                        case 'hover':
                            emulator_addClass('emulator-hover-hover', emulator_media_query['emulator_hover_hover'], 1);
                            emulator_addClass('emulator-any-hover-hover', emulator_media_query['emulator_any_hover_hover'], 1);
                            break;

                        case 'none_hover':
                            emulator_addClass('emulator-hover-none', emulator_media_query['emulator_hover_none'], 1);
                            emulator_addClass('emulator-any-hover-hover', emulator_media_query['emulator_any_hover_hover'], 1);
                            break;

                        case 'hover_none':
                            emulator_addClass('emulator-hover-hover', emulator_media_query['emulator_hover_hover'], 1);
                            emulator_addClass('emulator-any-hover-none', emulator_media_query['emulator_any_hover_none'], 1);
                            break;
                    }
                }
            }
            emulator_first_loop = 1;
            //End of IF
            for (const emulator_key in data) {
                //Orientation
                if (emulator_panel['orientation'] == 'portrait') {
                    emulator_addClass('emulator-orientation-portrait', emulator_media_query['emulator_orientation_portrait'], 1);
                    emulator_addClass('emulator-orientation-landscape', emulator_media_query['emulator_orientation_landscape'], 0);
                } else if (emulator_panel['orientation'] == 'landscape') {
                    emulator_addClass('emulator-orientation-portrait', emulator_media_query['emulator_orientation_portrait'], 0);
                    emulator_addClass('emulator-orientation-landscape', emulator_media_query['emulator_orientation_landscape'], 1);
                }
                //Devive posture
                if (emulator_panel['device_posture'] == 'folded') {
                    emulator_addClass('emulator-device-posture-folded', emulator_media_query['emulator_device_posture_folded'], 1);
                    emulator_addClass('emulator-device-posture-continuous', emulator_media_query['emulator_device_posture_continuous'], 0);
                } else if (emulator_panel['device_posture'] == 'continuous') {
                    emulator_addClass('emulator-device-posture-folded', emulator_media_query['emulator_device_posture_folded'], 0);
                    emulator_addClass('emulator-device-posture-continuous', emulator_media_query['emulator_device_posture_continuous'], 1);
                }
                //Screen fold posture
                document.documentElement.style.setProperty('--emulator-screen-fold-angle', emulator_panel['screen_fold_angle']);

                if (emulator_panel['screen_fold_posture'] == 'book') {
                    emulator_addClass('emulator-screen-fold-posture-book', emulator_media_query['emulator_screen_fold_posture_book'], 1);
                    emulator_addClass('emulator-screen-fold-posture-laptop', emulator_media_query['emulator_screen_fold_posture_laptop'], 0);
                    emulator_addClass('emulator-screen-fold-posture-flat', emulator_media_query['emulator_screen_fold_posture_flat'], 0);
                    emulator_addClass('emulator-screen-fold-posture-tent', emulator_media_query['emulator_screen_fold_posture_tent'], 0);
                    emulator_addClass('emulator-screen-fold-posture-tablet', emulator_media_query['emulator_screen_fold_posture_tablet'], 0);
                } else if (emulator_panel['screen_fold_posture'] == 'laptop') {
                    emulator_addClass('emulator-screen-fold-posture-book', emulator_media_query['emulator_screen_fold_posture_book'], 0);
                    emulator_addClass('emulator-screen-fold-posture-laptop', emulator_media_query['emulator_screen_fold_posture_laptop'], 1);
                    emulator_addClass('emulator-screen-fold-posture-flat', emulator_media_query['emulator_screen_fold_posture_flat'], 0);
                    emulator_addClass('emulator-screen-fold-posture-tent', emulator_media_query['emulator_screen_fold_posture_tent'], 0);
                    emulator_addClass('emulator-screen-fold-posture-tablet', emulator_media_query['emulator_screen_fold_posture_tablet'], 0);
                } else if (emulator_panel['screen_fold_posture'] == 'flat') {
                    emulator_addClass('emulator-screen-fold-posture-book', emulator_media_query['emulator_screen_fold_posture_book'], 0);
                    emulator_addClass('emulator-screen-fold-posture-laptop', emulator_media_query['emulator_screen_fold_posture_laptop'], 0);
                    emulator_addClass('emulator-screen-fold-posture-flat', emulator_media_query['emulator_screen_fold_posture_flat'], 1);
                    emulator_addClass('emulator-screen-fold-posture-tent', emulator_media_query['emulator_screen_fold_posture_tent'], 0);
                    emulator_addClass('emulator-screen-fold-posture-tablet', emulator_media_query['emulator_screen_fold_posture_tablet'], 0);
                } else if (emulator_panel['screen_fold_posture'] == 'tent') {
                    emulator_addClass('emulator-screen-fold-posture-book', emulator_media_query['emulator_screen_fold_posture_book'], 0);
                    emulator_addClass('emulator-screen-fold-posture-laptop', emulator_media_query['emulator_screen_fold_posture_laptop'], 0);
                    emulator_addClass('emulator-screen-fold-posture-flat', emulator_media_query['emulator_screen_fold_posture_flat'], 0);
                    emulator_addClass('emulator-screen-fold-posture-tent', emulator_media_query['emulator_screen_fold_posture_tent'], 1);
                    emulator_addClass('emulator-screen-fold-posture-tablet', emulator_media_query['emulator_screen_fold_posture_tablet'], 0);
                } else if (emulator_panel['screen_fold_posture'] == 'tablet') {
                    emulator_addClass('emulator-screen-fold-posture-book', emulator_media_query['emulator_screen_fold_posture_book'], 0);
                    emulator_addClass('emulator-screen-fold-posture-laptop', emulator_media_query['emulator_screen_fold_posture_laptop'], 0);
                    emulator_addClass('emulator-screen-fold-posture-flat', emulator_media_query['emulator_screen_fold_posture_flat'], 0);
                    emulator_addClass('emulator-screen-fold-posture-tent', emulator_media_query['emulator_screen_fold_posture_tent'], 0);
                    emulator_addClass('emulator-screen-fold-posture-tablet', emulator_media_query['emulator_screen_fold_posture_tablet'], 1);
                }
                Object.keys(emulator_media_query).forEach(emulator_key => {
                    //Aspect ratio
                    if (emulator_key.startsWith('emulator_aspect_ratio_')) {
                        v_ar = emulator_nar(window.innerWidth, window.innerHeight);
                        c_ar = emulator_nar(emulator_key.split('_').at(-2), emulator_key.split('_').at(-1));
                        console.log(window.innerWidth);
                        console.log(window.innerHeight);
                        if (v_ar[0] == c_ar[0] || v_ar[1] == c_ar[1]) {
                            emulator_addClass('emulator-aspect-ratio-' + v_ar[0] + '-' + v_ar[1], emulator_media_query['emulator_aspect_ratio_' + v_ar[0] + '_' + v_ar[1]], 1);
                        } else emulator_addClass('emulator-aspect-ratio-' + v_ar[0] + '-' + v_ar[1], emulator_media_query['emulator_aspect_ratio_' + v_ar[0] + '_' + v_ar[1]], 0);
                    }
                    //Device aspect ratio
                    if (emulator_key.startsWith('emulator_device_aspect_ratio_')) {
                        v_ar = emulator_nar(emulator_panel['win_width'], emulator_panel['win_height']);
                        c_ar = emulator_nar(emulator_key.split('_').at(-2), emulator_key.split('_').at(-1));
                        console.log(window.innerWidth);
                        console.log(window.innerHeight);
                        if (v_ar[0] == c_ar[0] || v_ar[1] == c_ar[1]) {
                            emulator_addClass('emulator-device-aspect-ratio-' + v_ar[0] + '-' + v_ar[1], emulator_media_query['emulator_device_aspect_ratio_' + v_ar[0] + '_' + v_ar[1]], 1);
                        } else emulator_addClass('emulator-device-aspect-ratio-' + v_ar[0] + '-' + v_ar[1], emulator_media_query['emulator_device_aspect_ratio_' + v_ar[0] + '_' + v_ar[1]], 0);
                    }
                    //Viewport size
                    if (
                        emulator_key.startsWith('emulator_width_') ||
                        emulator_key.startsWith('emulator_min_width_') ||
                        emulator_key.startsWith('emulator_max_width_') ||
                        emulator_key.startsWith('emulator_height_') ||
                        emulator_key.startsWith('emulator_min_height_') ||
                        emulator_key.startsWith('emulator_max_height_')
                    ) {
                        const emulator_viewportWidth = emulator_panel['viewport_width'];
                        const emulator_viewportHeight = emulator_panel['viewport_height'];
                        let emulator_match = emulator_key.match(/^emulator_(min_|max_)?(width|height)_(.+)$/);
                        if (!emulator_match) return;
                        const emulator_type = emulator_match[1] || '';
                        const emulator_property = emulator_match[2];
                        const emulator_rawValue = emulator_match[3];
                        const emulator_valueMatch = emulator_rawValue.match(/^([0-9_.]+)([a-zA-Z]+)$/);
                        if (!emulator_valueMatch) return;
                        let emulator_value = parseFloat(emulator_valueMatch[1].replace(/_/g, '.'));
                        const emulator_unit = emulator_valueMatch[2];
                        let emulator_pxValue;
                        try {
                            emulator_pxValue = emulator_convertToPx(emulator_value, emulator_unit);
                        } catch (e) {
                            console.warn('Nieobsługiwana jednostka:', emulator_unit);
                            return;
                        }
                        const emulator_viewportValue = emulator_property === 'width' ? emulator_viewportWidth : emulator_viewportHeight;
                        let emulator_conditionMet = false;
                        if (emulator_type === 'min_') {
                            emulator_conditionMet = emulator_viewportValue >= emulator_pxValue;
                        } else if (emulator_type === 'max_') {
                            emulator_conditionMet = emulator_viewportValue <= emulator_pxValue;
                        } else {
                            emulator_conditionMet = emulator_viewportValue === emulator_pxValue;
                        }
                        if (emulator_conditionMet) {
                            emulator_addClass(emulator_key.replace(/_/g, '-'), emulator_media_query[emulator_key], 1);
                        }
                    }
                    //Device size
                    if (
                        emulator_key.startsWith('emulator_device_width_') ||
                        emulator_key.startsWith('emulator_device_min_width_') ||
                        emulator_key.startsWith('emulator_device_max_width_') ||
                        emulator_key.startsWith('emulator_device_height_') ||
                        emulator_key.startsWith('emulator_device_min_height_') ||
                        emulator_key.startsWith('emulator_device_max_height_')
                    ) {
                        const emulator_deviceWidth = emulator_panel['win_width'];
                        const emulator_deviceHeight = emulator_panel['win_height'];
                        let emulator_match = emulator_key.match(/^emulator_device_(min_|max_)?(width|height)_(.+)$/);
                        if (!emulator_match) return;
                        const emulator_type = emulator_match[1] || '';
                        const emulator_property = emulator_match[2];
                        const emulator_rawValue = emulator_match[3];
                        const emulator_valueMatch = emulator_rawValue.match(/^([0-9_.]+)([a-zA-Z]+)$/);
                        if (!emulator_valueMatch) return;
                        let emulator_value = parseFloat(emulator_valueMatch[1].replace(/_/g, '.'));
                        const emulator_unit = emulator_valueMatch[2];
                        let emulator_pxValue;
                        try {
                            emulator_pxValue = emulator_convertToPx(emulator_value, emulator_unit);
                        } catch (e) {
                            console.warn('Nieobsługiwana jednostka:', emulator_unit);
                            return;
                        }
                        const emulator_deviceValue = emulator_property === 'width' ? emulator_deviceWidth : emulator_deviceHeight;
                        let emulator_conditionMet = false;
                        if (emulator_type === 'min_') {
                            emulator_conditionMet = emulator_deviceValue >= emulator_pxValue;
                        } else if (emulator_type === 'max_') {
                            emulator_conditionMet = emulator_deviceValue <= emulator_pxValue;
                        } else {
                            emulator_conditionMet = emulator_deviceValue == emulator_pxValue;
                        }
                        if (emulator_conditionMet) {
                            console.log(emulator_media_query[emulator_key]);
                            console.log(emulator_key.replace(/_/g, '-'));
                            emulator_addClass(emulator_key.replace(/_/g, '-'), emulator_media_query[emulator_key], 1);
                        }
                    }
                });
            }
        });
}, 100);
//Add/Remove class
function emulator_addClass(css_class, css_objects, emulator_action_type) {
    if (!css_class || !css_objects) return;
    document.querySelectorAll(css_objects).forEach(el => {
        if (emulator_action_type == 1) {
            el.classList.add(css_class);
        } else {
            el.classList.remove(css_class);
        }
    });
}
//Aspect ratio
function emulator_gcd(a, b) {
    a = Math.abs(parseInt(a));
    b = Math.abs(parseInt(b));
    return b ? emulator_gcd(b, a % b) : a;
}
function emulator_nar(width, height) {
    const emulator_divisor = emulator_gcd(width, height);
    return [width / emulator_divisor, height / emulator_divisor];
}
//Coverter for (device) width/height
function emulator_convertToPx(emulator_value, emulator_unit, baseFontSize = 16) {
    const emulator_dpi = emulator_panel['dpi'];
    const emulator_unitToPx = {
        px: 1,
        em: baseFontSize,
        rem: baseFontSize,
        in: emulator_dpi,
        cm: emulator_dpi / 2.54,
        mm: emulator_dpi / 25.4,
        pt: emulator_dpi / 72,
        pc: emulator_dpi / 6
    };
    emulator_unit = emulator_unit.toLowerCase();
    if (!emulator_unitToPx.hasOwnProperty(emulator_unit)) {
        throw new Error(`Nieobsługiwana jednostka: ${emulator_unit}`);
    }
    return emulator_value * emulator_unitToPx[emulator_unit];
}
