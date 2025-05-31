import { AoiFunction, CanvasBuilder, CanvasManager, ParamType } from '../../';

export default new AoiFunction<"djs">({
    name: "$bezierCurveTo",
    description: "Adds a cubic bezier curve to the current path.",
    params: [
        {
            name: "canvas",
            description: "Name of the canvas.",
            type: ParamType.String,
            check: (v, c) => !!(c.data.canvasManager && c.data.canvasManager instanceof CanvasManager && c.data.canvasManager.get(v)),
            checkError: () => "No canvas with provided name found.",
            optional: true
        },
        {
            name: "startX",
            description: "The X coordinate of the start point.",
            type: ParamType.Number,
            check: (v) => !isNaN(v),
            checkError: () => "Start X coordinate must be a valid number."
        },
        {
            name: "startY",
            description: "The Y coordinate of the start point.",
            type: ParamType.Number,
            check: (v) => !isNaN(v),
            checkError: () => "Start Y coordinate must be a valid number."
        },
        {
            name: "middleX",
            description: "The X coordinate of the mid point.",
            type: ParamType.Number,
            check: (v) => !isNaN(v),
            checkError: () => "Middle X coordinate must be a valid number."
        },
        {
            name: "middleY",
            description: "The Y coordinate of the mid point.",
            type: ParamType.Number,
            check: (v) => !isNaN(v),
            checkError: () => "Middle Y coordinate must be a valid number."
        },
        {
            name: "endX",
            description: "The X coordinate of the end point.",
            type: ParamType.Number,
            check: (v) => !isNaN(v),
            checkError: () => "End X coordinate must be a valid number."
        },
        {
            name: "endY",
            description: "The Y coordinate of the end point.",
            type: ParamType.Number,
            check: (v) => !isNaN(v),
            checkError: () => "End Y coordinate must be a valid number."
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        const [ name, startX, startY, middleX, middleY, endX, endY ] = ctx.params;

        try {
            if (!ctx.data.canvasManager || !(ctx.data.canvasManager instanceof CanvasManager)) {
                return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas manager found.");
            }

            const canvas = name 
                ? ctx.data.canvasManager.get(name)
                : !name && ctx.data.canvas 
                    ? ctx.data.canvas[ctx.data.canvas.length - 1] : null;
                    
            if (!canvas || !(canvas instanceof CanvasBuilder)) {
                return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas to draw the curve on.");
            }

            if (isNaN(startX) || isNaN(startY) || isNaN(middleX) || isNaN(middleY) || isNaN(endX) || isNaN(endY)) {
                return ctx.aoiError.fnError(ctx, "custom", {}, "All coordinates must be valid numbers.");
            }

            await canvas.ctx.bezierCurveTo(startX, startY, middleX, middleY, endX, endY);
        } catch (error) {
            return ctx.aoiError.fnError(ctx, "custom", {}, "Failed to draw bezier curve.");
        }

        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});