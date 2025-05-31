import { AoiFunction, GIFManager, ParamType } from '../../';

export default new AoiFunction<"djs">({
    name: "$setFPS",
    description: "Sets the FPS (Frames Per Second) of a GIF.",
    params: [
        {
            name: "gif",
            description: "Name of the GIF.",
            type: ParamType.String,
            check: (v, c) => !!(c.data.gifManager && c.data.gifManager instanceof GIFManager && c.data.gifManager.get(v)),
            checkError: () => "No GIF with provided name found.",
            optional: true
        },
        {
            name: "frames",
            description: "Number of frames per second to display.",
            type: ParamType.Number,
            check: (v) => v > 0,
            optional: true
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        const [ name, fps ] = ctx.params;

        try {
            if (!ctx.data.gifManager || !(ctx.data.gifManager instanceof GIFManager)) {
                return ctx.aoiError.fnError(ctx, "custom", {}, "No GIF manager found.");
            }

            const gif = name 
                ? ctx.data.gifManager.get(name)
                : !name && ctx.data.gif 
                    ? ctx.data.gif[ctx.data.gif.length - 1] : null;
                    
            if (!gif) {
                return ctx.aoiError.fnError(ctx, "custom", {}, "No GIF to set the FPS of.");
            }

            if (fps <= 0) {
                return ctx.aoiError.fnError(ctx, "custom", {}, "FPS must be a positive number.");
            }

            await gif.setFramesPerSecond(fps);
        } catch (error) {
            return ctx.aoiError.fnError(ctx, "custom", {}, "Failed to set GIF FPS.");
        }

        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});