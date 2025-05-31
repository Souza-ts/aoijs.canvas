import { AoiFunction, CanvasBuilder, CanvasManager, ParamType } from '../../';

export default new AoiFunction<"djs">({
    name: "$beginPath",
    description: "Starts a new path by emptying the list of paths.",
    params: [
        {
            name: "canvas",
            description: "Name of the canvas.",
            type: ParamType.String,
            check: (v, c) => !!(c.data.canvasManager && c.data.canvasManager instanceof CanvasManager && c.data.canvasManager.get(v)),
            checkError: () => "No canvas with provided name found.",
            optional: true
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        const [ name ] = ctx.params;

        try {
            if (!ctx.data.canvasManager || !(ctx.data.canvasManager instanceof CanvasManager)) {
                return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas manager found.");
            }

            const canvas = name 
                ? ctx.data.canvasManager.get(name)
                : !name && ctx.data.canvas 
                    ? ctx.data.canvas[ctx.data.canvas.length - 1] : null;
                    
            if (!canvas || !(canvas instanceof CanvasBuilder)) {
                return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas to start a new path in.");
            }

            canvas.ctx.beginPath();

            return {
                code: ctx.util.setCode(data),
                data: ctx.data
            };
        } catch (error) {
            return ctx.aoiError.fnError(ctx, "custom", {}, "Failed to start new path.");
        }
    }
});