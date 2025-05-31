import { AoiFunction, GIFManager, ParamType } from '../../';

export default new AoiFunction<"djs">({
    name: "$setThreshold",
    description: "Sets if the color table should be reused if current frame matches previous frame.",
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
            name: "percentage",
            description: "Threshold percentage.",
            type: ParamType.Number,
            check: (v) => v <= 100 && v >= 0,
            checkError: () => "Threshold must be between 0 and 100."
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        let [ name, percentage ] = ctx.params;

        try {
            if (!ctx.data.gifManager || !(ctx.data.gifManager instanceof GIFManager)) {
                return ctx.aoiError.fnError(ctx, "custom", {}, "No GIF manager found.");
            }

            const gif = name 
                ? ctx.data.gifManager.get(name)
                : !name && ctx.data.gif 
                    ? ctx.data.gif[ctx.data.gif.length - 1] : null;
                    
            if (!gif) {
                return ctx.aoiError.fnError(ctx, "custom", {}, "No GIF to set threshold for.");
            }

            if (percentage < 0 || percentage > 100) {
                return ctx.aoiError.fnError(ctx, "custom", {}, "Threshold must be between 0 and 100.");
            }

            await gif.setThreshold(percentage);
        } catch (error) {
            return ctx.aoiError.fnError(ctx, "custom", {}, "Failed to set GIF threshold.");
        }

        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});