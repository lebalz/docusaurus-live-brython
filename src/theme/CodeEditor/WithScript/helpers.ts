const TURTLE_IMPORTS_TESTER = /(^from turtle import)|(^import turtle)/m;
const GRID_IMPORTS_TESTER = /(^from grid import)|(^import grid)/m;
const GRAPHICS_OUTPUT_TESTER = /^(SETUP_)?GRAPHICS_OUTPUT\s*=\s*(True|1)/m;
const CANVAS_OUTPUT_TESTER = /^(SETUP_)?CANVAS_OUTPUT\s*=\s*(True|1)/m;

export const checkGraphicsOutput = (raw: string): boolean => {
    return (
        CANVAS_OUTPUT_TESTER.test(raw) ||
        GRAPHICS_OUTPUT_TESTER.test(raw) ||
        TURTLE_IMPORTS_TESTER.test(raw) ||
        GRID_IMPORTS_TESTER.test(raw)
    );
};

export const checkTurtleOutput = (raw: string): boolean => {
    return TURTLE_IMPORTS_TESTER.test(raw);
};

export const checkCanvasOutput = (raw: string): boolean => {
    return CANVAS_OUTPUT_TESTER.test(raw) || GRID_IMPORTS_TESTER.test(raw);
};

/**
 * The python script is transformed to a string by embedding it with """ characters.
 * So we must prevent the script itself to contain this sequence of characters.
 * @param {String} script
 */
export const sanitizePyScript = (script: string) => {
    return script.replace(/"{3}/g, "'''").replace(/\\n/g, '\\\\n').replace(/\\r/g, '\\\\r');
};
