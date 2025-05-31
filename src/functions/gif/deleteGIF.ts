import { AoiFunction, GIFManager, ParamType } from '../../';

export default new AoiFunction<"djs">({
    name: "$deleteGIF",
    description: "Deletes a GIF.",
    params: [
        {
            name: "gif",
            description: "Name of the GIF.",
            type: ParamType.String,
            check: (v, c) => !!(c.data.gifManager && c.data.gifManager instanceof GIFManager && c.data.gifManager.get(v)),
            checkError: () => "No GIF with provided name found.",
            optional: true
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        const [name] = ctx.params;

        if (!ctx.data.gifManager || !(ctx.data.gifManager instanceof GIFManager)) {
            return ctx.aoiError.fnError(ctx, "custom", {}, "No GIF manager found.");
        }

        if (!name) {
            if (!ctx.data.gif || ctx.data.gif.length === 0) {
                return ctx.aoiError.fnError(ctx, "custom", {}, "No GIF to delete.");
            }
            name = ctx.data.gif[ctx.data.gif.length - 1];
        }

        try {
            const gif = ctx.data.gifManager.get(name);
            if (!gif) {
                return ctx.aoiError.fnError(ctx, "custom", {}, "No GIF with provided name found.");
            }

            ctx.data.gifManager.remove(name);
            if (ctx.data.gif?.includes(name)) {
                ctx.data.gif = ctx.data.gif.filter(g => g !== name);
            }

            return {
                code: ctx.util.setCode(data),
                data: ctx.data
            };
        } catch (error) {
            return ctx.aoiError.fnError(ctx, "custom", {}, "Failed to delete GIF.");
        }
    }
});