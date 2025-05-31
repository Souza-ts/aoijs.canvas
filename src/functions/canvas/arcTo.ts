import { AoiFunction, CanvasBuilder, CanvasManager, ParamType } from '../../';

export default new AoiFunction<"djs">({
    name: "$arcTo",
    description: "Adds a circular arc to the current path.",
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
            name: "x1",
            description: "The X coordinate of the first control point.",
            type: ParamType.Number,
            check: (v) => !isNaN(v),
            checkError: () => "X1 coordinate must be a valid number."
        },
        {
            name: "y1",
            description: "The Y coordinate of the first control point.",
            type: ParamType.Number,
            check: (v) => !isNaN(v),
            checkError: () => "Y1 coordinate must be a valid number."
        },
        {
            name: "x2",
            description: "The X coordinate of the second control point.",
            type: ParamType.Number,
            check: (v) => !isNaN(v),
            checkError: () => "X2 coordinate must be a valid number."
        },
        {
            name: "y2",
            description: "The Y coordinate of the second control point.",
            type: ParamType.Number,
            check: (v) => !isNaN(v),
            checkError: () => "Y2 coordinate must be a valid number."
        },
        {
            name: "radius",
            description: "The arc's radius",
            type: ParamType.Number,
            check: (x) => x > 0,
            checkError: () => "The radius must be positive."
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        const [ name, x1, y1, x2, y2, radius ] = ctx.params;

        try {
            if (!ctx.data.canvasManager || !(ctx.data.canvasManager instanceof CanvasManager)) {
                return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas manager found.");
            }

            const canvas = name 
                ? ctx.data.canvasManager.get(name)
                : !name && ctx.data.canvas 
                    ? ctx.data.canvas[ctx.data.canvas.length - 1] : null;
                    
            if (!canvas || !(canvas instanceof CanvasBuilder)) {
                return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas to draw a circular arc in.");
            }

            if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
                return ctx.aoiError.fnError(ctx, "custom", {}, "Control point coordinates must be valid numbers.");
            }

            if (radius <= 0) {
                return ctx.aoiError.fnError(ctx, "custom", {}, "The radius must be positive.");
            }

            canvas.ctx.arcTo(x1, y1, x2, y2, radius);
        } catch (error) {
            return ctx.aoiError.fnError(ctx, "custom", {}, "Failed to draw arc.");
        }

        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});