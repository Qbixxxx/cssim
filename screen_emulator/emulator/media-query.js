const emulator_currentFile = location.pathname.split('screen_emulator/render/').pop();
let emulator_media_query = {};
let emulator_panel = {};
let emulator_first_loop = 0;
let emulator_dpi_value = '';
let emulator_dual_screen = '';
fetch('http://localhost/screen_emulator/media-query-map.json')
    .then(res => res.json())
    .then(data => {
        const classesMap = data[emulator_currentFile] || {};
        for (const className in classesMap) {
            const safeVarName = className.replace(/-/g, '_');
            emulator_media_query[safeVarName] = classesMap[className];
        }
    });
setInterval(() => {
    fetch('http://localhost/screen_emulator/emulator/panel.json')
        .then(res => res.json())
        .then(data => {
            //Edycja klucza, - na _----------------------------------------------------------------------------------------------------------------------------------------------------
            for (const key in data) {
                const safeVarName = key.replace(/-/g, '_');
                emulator_panel[safeVarName] = data[key];
            }
            emulator_dpi_value = emulator_panel['dpi'];
            emulator_dual_screen = emulator_panel['dual_screen'];
            //Początek IFa-------------------------------------------------------------------------------------------------------------------------------------------------------------
            if (emulator_first_loop == 0) {
                for (const key in emulator_media_query) {
                    //DPI--------------------------------------------------------------------------------------------------------------------------------------------------------------
                    if ((key.startsWith('emulator_resolution_') || key.startsWith('emulator_min_resolution_') || key.startsWith('emulator_max_resolution_')) && emulator_dpi_value != 'none') {
                        emulator_dpi_value = parseFloat(emulator_dpi_value);
                        emulator_dpx_value = Math.round((emulator_dpi_value / 96) * 100) / 100;
                        emulator_dcm_value = Math.round((emulator_dpi_value / 2.54) * 100) / 100;
                        emulator_dpi_class_name = key.replace(/_/g, '-');
                        emulator_dpi_class_type = key.split('emulator_')[1].split('resolution_')[0].slice(0, -1);
                        emulator_dpi_class_unit = key.slice(-3);
                        if (emulator_dpi_class_unit != 'dpx' && emulator_dpi_class_unit.slice(-1) == 'x') {
                            emulator_dpi_class_unit = 'x';
                        }
                        const rawValue = key
                            .split('resolution_')[1]
                            .slice(0, -3)
                            .replace(/__dot__/g, '.');
                        let emulator_dpi_class_value, emulator_dpx_class_value, emulator_dcm_class_value;
                        if (emulator_dpi_class_unit === 'dpi') {
                            emulator_dpi_class_value = parseFloat(rawValue);
                            emulator_dpx_class_value = Math.round((emulator_dpi_class_value / 96) * 100) / 100;
                            emulator_dcm_class_value = Math.round((emulator_dpi_class_value / 2.54) * 100) / 100;
                        } else if (emulator_dpi_class_unit === 'dpx' || emulator_dpi_class_unit === 'x') {
                            emulator_dpx_class_value = parseFloat(rawValue);
                            emulator_dpi_class_value = Math.round(emulator_dpx_class_value * 96 * 100) / 100;
                            emulator_dcm_class_value = Math.round((emulator_dpi_class_value / 2.54) * 100) / 100;
                        } else if (emulator_dpi_class_unit === 'dcm') {
                            emulator_dcm_class_value = parseFloat(rawValue);
                            emulator_dpi_class_value = Math.round(emulator_dcm_class_value * 2.54 * 100) / 100;
                            emulator_dpx_class_value = Math.round((emulator_dpi_class_value / 96) * 100) / 100;
                        }
                        //Przydzielanie DPI--------------------------------------------------------------------------------------------------------------------------------------------
                        if (
                            (emulator_dpi_class_type === '' && (emulator_dpi_class_value === emulator_dpi_value || emulator_dpx_class_value === emulator_dpx_value || emulator_dcm_class_value === emulator_dcm_value)) ||
                            (emulator_dpi_class_type === 'min' && (emulator_dpi_class_value <= emulator_dpi_value || emulator_dpx_class_value <= emulator_dpx_value || emulator_dcm_class_value <= emulator_dcm_value)) ||
                            (emulator_dpi_class_type === 'max' && (emulator_dpi_class_value >= emulator_dpi_value || emulator_dpx_class_value >= emulator_dpx_value || emulator_dcm_class_value >= emulator_dcm_value))
                        ) {
                            document.querySelectorAll(emulator_media_query[key]).forEach(el => {
                                el.classList.add(emulator_dpi_class_name);
                            });
                        }
                    }
                    //Monochrome-------------------------------------------------------------------------------------------------------------------------------------------------------
                    if ((key.startsWith('emulator_min_monochrome') || key.startsWith('emulator_max_monochrome')) && data.monochrome != 0 && data.monochrome_filter == 0) {
                        alert('ok');
                        emulator_monochrome_type = key.split('emulator_')[1].split('_monochrome_')[0];
                        emulator_monochrome_value = parseFloat(key.split('emulator_')[1].split('_monochrome_')[1]);
                        if (((emulator_monochrome_type == 'min' && emulator_monochrome_value <= data.monochrome) || (emulator_monochrome_type == 'max' && emulator_monochrome_value >= data.monochrome)) && emulator_monochrome_value != 0) {
                            document.querySelectorAll(emulator_media_query[key]).forEach(el => {
                                el.classList.add(key.replace(/_/g, '-'));
                            });
                        }
                    }
                    if ((key == 'emulator_monochrome' && data.monochrome != 0) || (key == 'emulator_monochrome_0' && data.monochrome == 0)) {
                        document.querySelectorAll(emulator_media_query[key]).forEach(el => {
                            el.classList.add(key.replace(/_/g, '-'));
                        });
                    }
                    //Color scheme-----------------------------------------------------------------------------------------------------------------------------------------------------
                    if (emulator_panel['color_scheme'] == 'light') {
                        addClass('emulator-prefers-color-scheme-light', emulator_media_query['emulator_prefers_color_scheme_light'], 1);
                    } else if (emulator_panel['color_scheme'] == 'dark') {
                        addClass('emulator-prefers-color-scheme-dark', emulator_media_query['emulator_prefers_color_scheme_dark'], 1);
                    }
                    //Contrast---------------------------------------------------------------------------------------------------------------------------------------------------------
                    if (emulator_panel['contrast'] == 'no-preference') {
                        addClass('emulator-prefers-contrast-no-preference', emulator_media_query['emulator_prefers_contrast_no_preference'], 1);
                    } else if (emulator_panel['contrast'] == 'custom') {
                        addClass('emulator-prefers-contrast-custom', emulator_media_query['emulator_prefers_contrast_custom'], 1);
                    } else if (emulator_panel['contrast'] == 'less') {
                        addClass('emulator-prefers-contrast-less', emulator_media_query['emulator_prefers_contrast_less'], 1);
                    } else if (emulator_panel['contrast'] == 'more') {
                        addClass('emulator-prefers-contrast-more', emulator_media_query['emulator_prefers_contrast_more'], 1);
                    }
                    //Reduced motion---------------------------------------------------------------------------------------------------------------------------------------------------
                    if (emulator_panel['reduced_motion'] == 'no-preference') {
                        addClass('emulator-prefers-reduced-motion-no-preference', emulator_media_query['emulator_prefers_reduced_motion_no_preference'], 1);
                    } else if (emulator_panel['reduced_motion'] == 'reduce') {
                        addClass('emulator-prefers-reduced-motion-reduce', emulator_media_query['emulator_prefers_reduced_motion_reduce'], 1);
                    }
                    //Reduced transparency---------------------------------------------------------------------------------------------------------------------------------------------
                    if (emulator_panel['reduced_transparency'] == 'no-preference') {
                        addClass('emulator-prefers-reduced-transparency-no-preference', emulator_media_query['emulator_prefers_reduced_transparency_no_preference'], 1);
                    } else if (emulator_panel['reduced_transparency'] == 'reduce') {
                        addClass('emulator-prefers-reduced-transparency-reduce', emulator_media_query['emulator_prefers_reduced_transparency_reduce'], 1);
                    }
                    //Color gamut------------------------------------------------------------------------------------------------------------------------------------------------------
                    if (emulator_panel['color_gamut'] == 'srgb') {
                        addClass('emulator-color-gamut-srgb', emulator_media_query['emulator_color_gamut_srgb'], 1);
                    } else if (emulator_panel['color_gamut'] == 'p3') {
                        addClass('emulator-color-gamut-p3', emulator_media_query['emulator_color_gamut_p3'], 1);
                    } else if (emulator_panel['color_gamut'] == 'rec2020') {
                        addClass('emulator-color-gamut-rec2020', emulator_media_query['emulator_color_gamut_rec2020'], 1);
                    }
                    //Forced colors----------------------------------------------------------------------------------------------------------------------------------------------------
                    if (emulator_panel['forced_colors'] == 'none') {
                        addClass('emulator-forced-colors-none', emulator_media_query['emulator_forced_colors_none'], 1);
                    } else if (emulator_panel['forced_colors'] == 'active') {
                        addClass('emulator-forced-colors-active', emulator_media_query['emulator_forced_colors_active'], 1);
                    }
                    //Inverted colors--------------------------------------------------------------------------------------------------------------------------------------------------
                    if (emulator_panel['inverted_colors'] == 'none') {
                        addClass('emulator-inverted-colors-none', emulator_media_query['emulator_inverted_colors_none'], 1);
                    } else if (emulator_panel['inverted_colors'] == 'inverted') {
                        addClass('emulator-inverted-colors-inverted', emulator_media_query['emulator_inverted_colors_inverted'], 1);
                    }
                    //Dynamic range----------------------------------------------------------------------------------------------------------------------------------------------------
                    if (emulator_panel['dynamic_range'] == 'standard') {
                        addClass('emulator-dynamic-range-standard', emulator_media_query['emulator_dynamic_range_standard'], 1);
                    } else if (emulator_panel['dynamic_range'] == 'high') {
                        addClass('emulator-dynamic-range-high', emulator_media_query['emulator_dynamic_range_high'], 1);
                    }
                    //Color------------------------------------------------------------------------------------------------------------------------------------------------------------
                    if ((key.startsWith('emulator_min_color') || key.startsWith('emulator_max_color')) && !(key.startsWith('emulator_min_color_index') || key.startsWith('emulator_max_color_index')) && data.color != 0) {
                        emulator_color_value = parseFloat(key.split('_').at(-1));
                        emulator_color_type = key.split('emulator_')[1].split('color_')[0].slice(0, -1);
                        if (((emulator_color_type == 'min' && emulator_color_value <= data.color) || (emulator_color_type == 'max' && emulator_color_value >= data.color)) && emulator_color_value != 0) {
                            document.querySelectorAll(emulator_media_query[key]).forEach(el => {
                                el.classList.add(key.replace(/_/g, '-'));
                            });
                        }
                    }
                    if ((key == 'emulator_color' && data.color != 0) || (key == 'emulator_color_0' && data.color == 0) || (key.startsWith('emulator_color_') && key.split('_').at(-1) == data.color)) {
                        document.querySelectorAll(emulator_media_query[key]).forEach(el => {
                            el.classList.add(key.replace(/_/g, '-'));
                        });
                    }
                    //Color index------------------------------------------------------------------------------------------------------------------------------------------------------
                    if ((key.startsWith('emulator_min_color_index') || key.startsWith('emulator_max_color_index')) && data.color_index != 0) {
                        emulator_color_index_value = parseFloat(key.split('_').at(-1));
                        emulator_color_index_type = key.split('emulator_')[1].split('color_index_')[0].slice(0, -1);
                        if (((emulator_color_index_type == 'min' && emulator_color_index_value <= data.color_index) || (emulator_color_index_type == 'max' && emulator_color_index_value >= data.color_index)) && emulator_color_index_value != 0) {
                            document.querySelectorAll(emulator_media_query[key]).forEach(el => {
                                el.classList.add(key.replace(/_/g, '-'));
                            });
                        }
                    }
                    if ((key == 'emulator_color_index' && data.color_index != 0) || (key == 'emulator_color_index_0' && data.color_index == 0) || (key.startsWith('emulator_color_index_') && key.split('_').at(-1) == data.color_index)) {
                        document.querySelectorAll(emulator_media_query[key]).forEach(el => {
                            el.classList.add(key.replace(/_/g, '-'));
                        });
                    }
                    //Update-----------------------------------------------------------------------------------------------------------------------------------------------------------
                    if (emulator_panel['update'] == 'fast') {
                        addClass('emulator-update-fast', emulator_media_query['emulator_update_fast'], 1);
                    } else if (emulator_panel['update'] == 'slow') {
                        addClass('emulator-update-slow', emulator_media_query['emulator_update_slow'], 1);
                    } else if (emulator_panel['update'] == 'none') {
                        addClass('emulator-update-none', emulator_media_query['emulator_update_none'], 1);
                    }
                    //Grid-------------------------------------------------------------------------------------------------------------------------------------------------------------
                    if (emulator_panel['grid'] == '0') {
                        addClass('emulator-grid-0', emulator_media_query['emulator_grid_0'], 1);
                    } else if (emulator_panel['grid'] == '1') {
                        addClass('emulator-grid-1', emulator_media_query['emulator_grid_1'], 1);
                    }
                    //Display mode-----------------------------------------------------------------------------------------------------------------------------------------------------
                    if (emulator_panel['display_mode'] == 'browser') {
                        addClass('emulator-display-mode-browser', emulator_media_query['emulator_display_mode_browser'], 1);
                    } else if (emulator_panel['display_mode'] == 'fullscreen') {
                        addClass('emulator-display-mode-fullscreen', emulator_media_query['emulator_display_mode_fullscreen'], 1);
                    } else if (emulator_panel['display_mode'] == 'minimal-ui') {
                        addClass('emulator-display-mode-minimal-ui', emulator_media_query['emulator_display_mode_minimal_ui'], 1);
                    } else if (emulator_panel['display_mode'] == 'picture-in-picture') {
                        addClass('emulator-display-mode-picture-in-picture', emulator_media_query['emulator_display_mode_picture_in_picture'], 1);
                    } else if (emulator_panel['display_mode'] == 'standalone') {
                        addClass('emulator-display-mode-standalone', emulator_media_query['emulator_display_mode_standalone'], 1);
                    } else if (emulator_panel['display_mode'] == 'window-controls-overlay') {
                        addClass('emulator-display-mode-window-controls-overlay', emulator_media_query['emulator_display_mode_window_controls_overlay'], 1);
                    }
                    //Overflow block---------------------------------------------------------------------------------------------------------------------------------------------------
                    if (emulator_panel['overflow_block'] == 'none') {
                        addClass('emulator-overflow-block-none', emulator_media_query['emulator_overflow_block_none'], 1);
                    } else if (emulator_panel['overflow_block'] == 'paged') {
                        addClass('emulator-overflow-block-paged', emulator_media_query['emulator_overflow_block_paged'], 1);
                    } else if (emulator_panel['overflow_block'] == 'optional-paged') {
                        addClass('emulator-overflow-block-optional-paged', emulator_media_query['emulator_overflow_block_optional_paged'], 1);
                    } else if (emulator_panel['overflow_block'] == 'scroll') {
                        addClass('emulator-overflow-block-scroll', emulator_media_query['emulator_overflow_block_scroll'], 1);
                    }
                    //Overflow inline--------------------------------------------------------------------------------------------------------------------------------------------------
                    if (emulator_panel['overflow_inline'] == 'none') {
                        addClass('emulator-overflow-inline-none', emulator_media_query['emulator_overflow_inline_none'], 1);
                    } else if (emulator_panel['overflow_inline'] == 'scroll') {
                        addClass('emulator-overflow-inline-scroll', emulator_media_query['emulator_overflow_inline_scroll'], 1);
                    }
                    //Wekit transform 3d-----------------------------------------------------------------------------------------------------------------------------------------------
                    if (emulator_panel['wekit_transform_3d'] == 'true') {
                        if (emulator_media_query['emulator__webkit_transform_3d_true'] != undefined) {
                            addClass('emulator--webkit-transform-3d-true', emulator_media_query['emulator__webkit_transform_3d_true'], 1);
                        }
                        if (emulator_media_query['emulator__webkit_transform_3d'] != undefined) {
                            addClass('emulator--webkit-transform-3d', emulator_media_query['emulator__webkit_transform_3d'], 1);
                        }
                    } else if (emulator_panel['wekit_transform_3d'] == 'false' && emulator_media_query['emulator__webkit_transform_3d_false'] != undefined) {
                        addClass('emulator--webkit-transform-3d-false', emulator_media_query['emulator__webkit_transform_3d_false'], 1);
                    }
                    //Scripting--------------------------------------------------------------------------------------------------------------------------------------------------------
                    if (emulator_panel['scripting'] == 'enabled') {
                        addClass('emulator-scripting-enabled', emulator_media_query['emulator_scripting_enabled'], 1);
                    } else if (emulator_panel['scripting'] == 'initial-only') {
                        addClass('emulator-scripting-initial-only', emulator_media_query['emulator_scripting_initial_only'], 1);
                    } else if (emulator_panel['scripting'] == 'none') {
                        addClass('emulator-scripting-none', emulator_media_query['emulator_scripting_none'], 1);
                    }
                    //Pointer----------------------------------------------------------------------------------------------------------------------------------------------------------
                    switch (emulator_panel['pointer']) {
                        case 'fine':
                            addClass('emulator-pointer-fine', emulator_media_query['emulator_pointer_fine'], 1);
                            addClass('emulator-any-pointer-fine', emulator_media_query['emulator_any_pointer_fine'], 1);
                            break;

                        case 'coarse':
                            addClass('emulator-pointer-coarse', emulator_media_query['emulator_pointer_coarse'], 1);
                            addClass('emulator-any-pointer-coarse', emulator_media_query['emulator_any_pointer_coarse'], 1);
                            break;

                        case 'none':
                            addClass('emulator-pointer-none', emulator_media_query['emulator_pointer_none'], 1);
                            addClass('emulator-any-pointer-none', emulator_media_query['emulator_any_pointer_none'], 1);
                            break;

                        case 'fine-coarse':
                            addClass('emulator-pointer-fine', emulator_media_query['emulator_pointer_fine'], 1);
                            addClass('emulator-any-pointer-fine', emulator_media_query['emulator_any_pointer_fine'], 1);
                            addClass('emulator-any-pointer-coarse', emulator_media_query['emulator_any_pointer_coarse'], 1);
                            break;

                        case 'fine-none':
                            addClass('emulator-pointer-fine', emulator_media_query['emulator_pointer_fine'], 1);
                            addClass('emulator-any-pointer-fine', emulator_media_query['emulator_any_pointer_fine'], 1);
                            addClass('emulator-any-pointer-none', emulator_media_query['emulator_any_pointer_none'], 1);
                            break;

                        case 'fine-coarse-none':
                            addClass('emulator-pointer-fine', emulator_media_query['emulator_pointer_fine'], 1);
                            addClass('emulator-any-pointer-fine', emulator_media_query['emulator_any_pointer_fine'], 1);
                            addClass('emulator-any-pointer-coarse', emulator_media_query['emulator_any_pointer_coarse'], 1);
                            addClass('emulator-any-pointer-none', emulator_media_query['emulator_any_pointer_none'], 1);
                            break;

                        case 'none-fine':
                            addClass('emulator-pointer-none', emulator_media_query['emulator_pointer_none'], 1);
                            addClass('emulator-any-pointer-fine', emulator_media_query['emulator_any_pointer_fine'], 1);
                            addClass('emulator-any-pointer-none', emulator_media_query['emulator_any_pointer_none'], 1);
                            break;

                        case 'none-coarse':
                            addClass('emulator-pointer-none', emulator_media_query['emulator_pointer_none'], 1);
                            addClass('emulator-any-pointer-coarse', emulator_media_query['emulator_any_pointer_coarse'], 1);
                            addClass('emulator-any-pointer-none', emulator_media_query['emulator_any_pointer_none'], 1);
                            break;

                        case 'none-fine-coarse':
                            addClass('emulator-pointer-none', emulator_media_query['emulator_pointer_none'], 1);
                            addClass('emulator-any-pointer-fine', emulator_media_query['emulator_any_pointer_fine'], 1);
                            addClass('emulator-any-pointer-coarse', emulator_media_query['emulator_any_pointer_coarse'], 1);
                            addClass('emulator-any-pointer-none', emulator_media_query['emulator_any_pointer_none'], 1);
                            break;

                        case 'coarse-fine':
                            addClass('emulator-pointer-coarse', emulator_media_query['emulator_pointer_coarse'], 1);
                            addClass('emulator-any-pointer-fine', emulator_media_query['emulator_any_pointer_fine'], 1);
                            addClass('emulator-any-pointer-coarse', emulator_media_query['emulator_any_pointer_coarse'], 1);
                            break;

                        case 'coarse-fine-none':
                            addClass('emulator-pointer-coarse', emulator_media_query['emulator_pointer_coarse'], 1);
                            addClass('emulator-any-pointer-fine', emulator_media_query['emulator_any_pointer_fine'], 1);
                            addClass('emulator-any-pointer-coarse', emulator_media_query['emulator_any_pointer_coarse'], 1);
                            addClass('emulator-any-pointer-none', emulator_media_query['emulator_any_pointer_none'], 1);
                            break;
                    }
                    //Hover------------------------------------------------------------------------------------------------------------------------------------------------------------
                    switch (emulator_panel['hover']) {
                        case 'none':
                            addClass('emulator-hover-none', emulator_media_query['emulator_hover_none'], 1);
                            addClass('emulator-any-hover-none', emulator_media_query['emulator_any_hover_none'], 1);
                            break;

                        case 'hover':
                            addClass('emulator-hover-hover', emulator_media_query['emulator_hover_hover'], 1);
                            addClass('emulator-any-hover-hover', emulator_media_query['emulator_any_hover_hover'], 1);
                            break;

                        case 'none_hover':
                            addClass('emulator-hover-none', emulator_media_query['emulator_hover_none'], 1);
                            addClass('emulator-any-hover-hover', emulator_media_query['emulator_any_hover_hover'], 1);
                            break;

                        case 'hover_none':
                            addClass('emulator-hover-hover', emulator_media_query['emulator_hover_hover'], 1);
                            addClass('emulator-any-hover-none', emulator_media_query['emulator_any_hover_none'], 1);
                            break;
                    }
                }
            }
            emulator_first_loop = 1;
            //Koniec IFa---------------------------------------------------------------------------------------------------------------------------------------------------------------
            for (const key in data) {
                //Orientation----------------------------------------------------------------------------------------------------------------------------------------------------------
                if (emulator_panel['orientation'] == 'portrait') {
                    addClass('emulator-orientation-portrait', emulator_media_query['emulator_orientation_portrait'], 1);
                    addClass('emulator-orientation-landscape', emulator_media_query['emulator_orientation_landscape'], 0);
                } else if (emulator_panel['orientation'] == 'landscape') {
                    addClass('emulator-orientation-portrait', emulator_media_query['emulator_orientation_portrait'], 0);
                    addClass('emulator-orientation-landscape', emulator_media_query['emulator_orientation_landscape'], 1);
                }
                //Devive posture-------------------------------------------------------------------------------------------------------------------------------------------------------
                if (emulator_panel['device_posture'] == 'folded') {
                    addClass('emulator-device-posture-folded', emulator_media_query['emulator_device_posture_folded'], 1);
                    addClass('emulator-device-posture-continuous', emulator_media_query['emulator_device_posture_continuous'], 0);
                } else if (emulator_panel['device_posture'] == 'continuous') {
                    addClass('emulator-device-posture-folded', emulator_media_query['emulator_device_posture_folded'], 0);
                    addClass('emulator-device-posture-continuous', emulator_media_query['emulator_device_posture_continuous'], 1);
                }
                //Screen fold posture--------------------------------------------------------------------------------------------------------------------------------------------------
                if (emulator_panel['screen_fold_posture'] == 'book') {
                    addClass('emulator-screen-fold-posture-book', emulator_media_query['emulator_screen_fold_posture_book'], 1);
                    addClass('emulator-screen-fold-posture-laptop', emulator_media_query['emulator_screen_fold_posture_laptop'], 0);
                    addClass('emulator-screen-fold-posture-flat', emulator_media_query['emulator_screen_fold_posture_flat'], 0);
                    addClass('emulator-screen-fold-posture-tent', emulator_media_query['emulator_screen_fold_posture_tent'], 0);
                    addClass('emulator-screen-fold-posture-tablet', emulator_media_query['emulator_screen_fold_posture_tablet'], 0);
                } else if (emulator_panel['screen_fold_posture'] == 'laptop') {
                    addClass('emulator-screen-fold-posture-book', emulator_media_query['emulator_screen_fold_posture_book'], 0);
                    addClass('emulator-screen-fold-posture-laptop', emulator_media_query['emulator_screen_fold_posture_laptop'], 1);
                    addClass('emulator-screen-fold-posture-flat', emulator_media_query['emulator_screen_fold_posture_flat'], 0);
                    addClass('emulator-screen-fold-posture-tent', emulator_media_query['emulator_screen_fold_posture_tent'], 0);
                    addClass('emulator-screen-fold-posture-tablet', emulator_media_query['emulator_screen_fold_posture_tablet'], 0);
                } else if (emulator_panel['screen_fold_posture'] == 'flat') {
                    addClass('emulator-screen-fold-posture-book', emulator_media_query['emulator_screen_fold_posture_book'], 0);
                    addClass('emulator-screen-fold-posture-laptop', emulator_media_query['emulator_screen_fold_posture_laptop'], 0);
                    addClass('emulator-screen-fold-posture-flat', emulator_media_query['emulator_screen_fold_posture_flat'], 1);
                    addClass('emulator-screen-fold-posture-tent', emulator_media_query['emulator_screen_fold_posture_tent'], 0);
                    addClass('emulator-screen-fold-posture-tablet', emulator_media_query['emulator_screen_fold_posture_tablet'], 0);
                } else if (emulator_panel['screen_fold_posture'] == 'tent') {
                    addClass('emulator-screen-fold-posture-book', emulator_media_query['emulator_screen_fold_posture_book'], 0);
                    addClass('emulator-screen-fold-posture-laptop', emulator_media_query['emulator_screen_fold_posture_laptop'], 0);
                    addClass('emulator-screen-fold-posture-flat', emulator_media_query['emulator_screen_fold_posture_flat'], 0);
                    addClass('emulator-screen-fold-posture-tent', emulator_media_query['emulator_screen_fold_posture_tent'], 1);
                    addClass('emulator-screen-fold-posture-tablet', emulator_media_query['emulator_screen_fold_posture_tablet'], 0);
                } else if (emulator_panel['screen_fold_posture'] == 'tablet') {
                    addClass('emulator-screen-fold-posture-book', emulator_media_query['emulator_screen_fold_posture_book'], 0);
                    addClass('emulator-screen-fold-posture-laptop', emulator_media_query['emulator_screen_fold_posture_laptop'], 0);
                    addClass('emulator-screen-fold-posture-flat', emulator_media_query['emulator_screen_fold_posture_flat'], 0);
                    addClass('emulator-screen-fold-posture-tent', emulator_media_query['emulator_screen_fold_posture_tent'], 0);
                    addClass('emulator-screen-fold-posture-tablet', emulator_media_query['emulator_screen_fold_posture_tablet'], 1);
                }
                Object.keys(emulator_media_query).forEach(key => {
                    //Aspect ratio-----------------------------------------------------------------------------------------------------------------------------------------------------
                    if (key.startsWith('emulator_aspect_ratio_')) {
                        v_ar = nar(window.innerWidth, window.innerHeight);
                        c_ar = nar(key.split('_').at(-2), key.split('_').at(-1));
                        console.log(window.innerWidth);
                        console.log(window.innerHeight);
                        if (v_ar[0] == c_ar[0] || v_ar[1] == c_ar[1]) {
                            addClass('emulator-aspect-ratio-' + v_ar[0] + '-' + v_ar[1], emulator_media_query['emulator_aspect_ratio_' + v_ar[0] + '_' + v_ar[1]], 1);
                        } else addClass('emulator-aspect-ratio-' + v_ar[0] + '-' + v_ar[1], emulator_media_query['emulator_aspect_ratio_' + v_ar[0] + '_' + v_ar[1]], 0);
                    }
                    //Device aspect ratio----------------------------------------------------------------------------------------------------------------------------------------------
                    if (key.startsWith('emulator_device_aspect_ratio_')) {
                        v_ar = nar(emulator_panel['win_width'], emulator_panel['win_height']);
                        c_ar = nar(key.split('_').at(-2), key.split('_').at(-1));
                        console.log(window.innerWidth);
                        console.log(window.innerHeight);
                        if (v_ar[0] == c_ar[0] || v_ar[1] == c_ar[1]) {
                            addClass('emulator-device-aspect-ratio-' + v_ar[0] + '-' + v_ar[1], emulator_media_query['emulator_device_aspect_ratio_' + v_ar[0] + '_' + v_ar[1]], 1);
                        } else addClass('emulator-device-aspect-ratio-' + v_ar[0] + '-' + v_ar[1], emulator_media_query['emulator_device_aspect_ratio_' + v_ar[0] + '_' + v_ar[1]], 0);
                    }
                    //Viewport size----------------------------------------------------------------------------------------------------------------------------------------------------
                    if (
                        key.startsWith('emulator_width_') ||
                        key.startsWith('emulator_min_width_') ||
                        key.startsWith('emulator_max_width_') ||
                        key.startsWith('emulator_height_') ||
                        key.startsWith('emulator_min_height_') ||
                        key.startsWith('emulator_max_height_')
                    ) {
                        const viewportWidth = emulator_panel['viewport_width'];
                        const viewportHeight = emulator_panel['viewport_height'];
                        let match = key.match(/^emulator_(min_|max_)?(width|height)_(.+)$/);
                        if (!match) return;
                        const type = match[1] || '';
                        const property = match[2];
                        const rawValue = match[3];
                        const valueMatch = rawValue.match(/^([0-9_.]+)([a-zA-Z]+)$/);
                        if (!valueMatch) return;
                        let value = parseFloat(valueMatch[1].replace(/_/g, '.'));
                        const unit = valueMatch[2];
                        let pxValue;
                        try {
                            pxValue = convertToPx(value, unit);
                        } catch (e) {
                            console.warn('Nieobsługiwana jednostka:', unit);
                            return;
                        }
                        const viewportValue = property === 'width' ? viewportWidth : viewportHeight;
                        let conditionMet = false;
                        if (type === 'min_') {
                            conditionMet = viewportValue >= pxValue;
                        } else if (type === 'max_') {
                            conditionMet = viewportValue <= pxValue;
                        } else {
                            conditionMet = viewportValue === pxValue;
                        }
                        if (conditionMet) {
                            document.querySelectorAll(emulator_media_query[key]).forEach(el => {
                                el.classList.add(key.replace(/_/g, '-'));
                            });
                        }
                    }
                    //Device size------------------------------------------------------------------------------------------------------------------------------------------------------
                    if (
                        key.startsWith('emulator_device_width_') ||
                        key.startsWith('emulator_device_min_width_') ||
                        key.startsWith('emulator_device_max_width_') ||
                        key.startsWith('emulator_device_height_') ||
                        key.startsWith('emulator_device_min_height_') ||
                        key.startsWith('emulator_device_max_height_')
                    ) {
                        const deviceWidth = emulator_panel['win_width'];
                        const deviceHeight = emulator_panel['win_height'];
                        let match = key.match(/^emulator_device_(min_|max_)?(width|height)_(.+)$/);
                        if (!match) return;
                        const type = match[1] || '';
                        const property = match[2];
                        const rawValue = match[3];
                        const valueMatch = rawValue.match(/^([0-9_.]+)([a-zA-Z]+)$/);
                        if (!valueMatch) return;
                        let value = parseFloat(valueMatch[1].replace(/_/g, '.'));
                        const unit = valueMatch[2];
                        let pxValue;
                        try {
                            pxValue = convertToPx(value, unit);
                        } catch (e) {
                            console.warn('Nieobsługiwana jednostka:', unit);
                            return;
                        }
                        const deviceValue = property === 'width' ? deviceWidth : deviceHeight;
                        let conditionMet = false;
                        if (type === 'min_') {
                            conditionMet = deviceValue >= pxValue;
                        } else if (type === 'max_') {
                            conditionMet = deviceValue <= pxValue;
                        } else {
                            conditionMet = deviceValue == pxValue;
                        }
                        if (conditionMet) {
                            console.log(emulator_media_query[key]);
                            console.log(key.replace(/_/g, '-'));
                            addClass(key.replace(/_/g, '-'), emulator_media_query[key], 1);
                        }
                    }
                });
            }
        });
}, 100);
//Add/Remove class---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function addClass(css_class, css_objects, action_type) {
    if (!css_class || !css_objects) return;
    document.querySelectorAll(css_objects).forEach(el => {
        if (action_type == 1) {
            el.classList.add(css_class);
        } else {
            el.classList.remove(css_class);
        }
    });
}
//Aspect ratio-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function gcd(a, b) {
    a = Math.abs(parseInt(a));
    b = Math.abs(parseInt(b));
    return b ? gcd(b, a % b) : a;
}
function nar(width, height) {
    const divisor = gcd(width, height);
    return [width / divisor, height / divisor];
}
//Coverter for (device) width/height---------------------------------------------------------------------------------------------------------------------------------------------------
function convertToPx(value, unit, baseFontSize = 16) {
    const dpi = emulator_panel['dpi'];
    const unitToPx = {
        px: 1,
        em: baseFontSize,
        rem: baseFontSize,
        in: dpi,
        cm: dpi / 2.54,
        mm: dpi / 25.4,
        pt: dpi / 72,
        pc: dpi / 6
    };
    unit = unit.toLowerCase();
    if (!unitToPx.hasOwnProperty(unit)) {
        throw new Error(`Nieobsługiwana jednostka: ${unit}`);
    }
    return value * unitToPx[unit];
}
