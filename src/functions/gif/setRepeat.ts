import { AoiFunction, GIFManager, ParamType } from '../../';

export default new AoiFunction<"djs">({
    name: "$setRepeat",
    description: "Sets the number of loops GIF does.",
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
            name: "loops",
            description: "The number of loops.",
            type: ParamType.Number,
            check: (v) => v >= 0,
            checkError: () => "Number of loops must be positive."
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        let [ name, loops ] = ctx.params;

        try {
            if (!ctx.data.gifManager || !(ctx.data.gifManager instanceof GIFManager)) {
                return ctx.aoiError.fnError(ctx, "custom", {}, "No GIF manager found.");
            }

            const gif = name 
                ? ctx.data.gifManager.get(name)
                : !name && ctx.data.gif 
                    ? ctx.data.gif[ctx.data.gif.length - 1] : null;
                    
            if (!gif) {
                return ctx.aoiError.fnError(ctx, "custom", {}, "No GIF to set repeat for.");
            }

            if (loops < 0) {
                return ctx.aoiError.fnError(ctx, "custom", {}, "Number of loops must be positive.");
            }

            await gif.setRepeat(loops);
        } catch (error) {
            return ctx.aoiError.fnError(ctx, "custom", {}, "Failed to set GIF repeat.");
        }

        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});