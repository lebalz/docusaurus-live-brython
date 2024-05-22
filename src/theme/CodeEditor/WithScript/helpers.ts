
const TURTLE_IMPORTS_TESTER = /(^from turtle import)|(^import turtle)/m
const TURTLE3D_IMPORTS_TESTER = /(^from turtle3d import)|(^import turtle3d)/m
const GRID_IMPORTS_TESTER = /(^from grid import)|(^import grid)/m
const GRAPHICS_OUTPUT_TESTER = /^(SETUP_)?GRAPHICS_OUTPUT\s*=\s*(True|1)/m
const CANVAS_OUTPUT_TESTER = /^(SETUP_)?CANVAS_OUTPUT\s*=\s*(True|1)/m

export const checkGraphicsOutput = (raw: string): boolean => {
    return CANVAS_OUTPUT_TESTER.test(raw) || GRAPHICS_OUTPUT_TESTER.test(raw) || TURTLE_IMPORTS_TESTER.test(raw) || GRID_IMPORTS_TESTER.test(raw) || TURTLE3D_IMPORTS_TESTER.test(raw);
}

export const checkTurtleOutput = (raw: string): boolean => {
    return (TURTLE_IMPORTS_TESTER.test(raw) || TURTLE3D_IMPORTS_TESTER.test(raw));
}

export const checkCanvasOutput = (raw: string): boolean => {
    return CANVAS_OUTPUT_TESTER.test(raw) || GRID_IMPORTS_TESTER.test(raw);
}

export const getPreCode = (rawcode: string) => {
    const match = rawcode.match(/\n###\s*PRE.*?\n/);
    if (match) {
        return {
            pre: rawcode.slice(0, match.index || 0),
            code: rawcode.slice((match.index || 0) + match[0].length)
        }
    }
    return {
        pre: '',
        code: rawcode
    };
}