import { AoiFunction, CanvasBuilder, CanvasManager, MeasureTextProperty, ParamType, WidthOrHeight } from '../../';

export default new AoiFunction<"djs">({
    name: "$canvasSize",
    description: "Returns the canvas size.",
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
            name: "property",
            description: "The size property to return.",
            type: ParamType.Enum,
            enum: WidthOrHeight,
            optional: true
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        const [ name, property ] = ctx.params;

        try {
            if (!ctx.data.canvasManager || !(ctx.data.canvasManager instanceof CanvasManager)) {
                return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas manager found.");
            }

            const canvas = name 
                ? ctx.data.canvasManager.get(name)?.ctx.canvas
                : !name && ctx.data.canvas 
                    ? ctx.data.canvas.ctx.canvas : null;
                    
            if (!canvas) {
                return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas found.");
            }

            const result: Record<string, number> = {
                width: canvas.width,
                height: canvas.height
            };

            if (property) {
                const prop = typeof property === "number" ? MeasureTextProperty[property] : property;
                if (!result[prop]) {
                    return ctx.aoiError.fnError(ctx, "custom", {}, "Invalid size property.");
                }
                data.result = result[prop];
            } else {
                data.result = JSON.stringify(result);
            }

            return {
                code: ctx.util.setCode(data),
                data: ctx.data
            };
        } catch (error) {
            return ctx.aoiError.fnError(ctx, "custom", {}, "Failed to get canvas size.");
        }
    }
});