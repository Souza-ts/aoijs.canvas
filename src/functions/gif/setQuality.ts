import { AoiFunction, GIFManager, ParamType } from '../../';

export default new AoiFunction<"djs">({
    name: "$setQuality",
    description: "Sets the GIF color quality.",
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
            name: "quality",
            description: "The quality. (0-30)",
            type: ParamType.Number,
            check: (v) => v <= 30 && v >= 0,
            checkError: () => "Quality must be between 0 and 30."
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        let [ name, quality ] = ctx.params;

        try {
            if (!ctx.data.gifManager || !(ctx.data.gifManager instanceof GIFManager)) {
                return ctx.aoiError.fnError(ctx, "custom", {}, "No GIF manager found.");
            }

            const gif = name 
                ? ctx.data.gifManager.get(name)
                : !name && ctx.data.gif 
                    ? ctx.data.gif[ctx.data.gif.length - 1] : null;
                    
            if (!gif) {
                return ctx.aoiError.fnError(ctx, "custom", {}, "No GIF to set quality for.");
            }

            if (quality < 0 || quality > 30) {
                return ctx.aoiError.fnError(ctx, "custom", {}, "Quality must be between 0 and 30.");
            }

            await gif.setQuality(quality);
        } catch (error) {
            return ctx.aoiError.fnError(ctx, "custom", {}, "Failed to set GIF quality.");
        }

        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});