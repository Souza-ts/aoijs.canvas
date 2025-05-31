import { GIFManager } from '../../';
import { AoiFunction, ParamType } from '../../';
const gifencoder = require("gif-encoder-2");

export default new AoiFunction<"djs">({
    name: "$newGIF",
    description: "Creates a new GIF.",
    params: [
        {
            name: "canvas",
            description: "Name of the GIF to create.",
            type: ParamType.String
        },
        {
            name: "functions",
            description: "Functions.",
            type: ParamType.String,
            typename: "Any",
            rest: true,
            optional: true
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        const [ name ] = ctx.params;

        try {
            if (!ctx.data.gif) {
                return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas available to create GIF.");
            }

            if (!ctx.data.gifManager) {
                ctx.data.gifManager = new GIFManager();
            }

            if (ctx.data.gifManager.get(name)) {
                return ctx.aoiError.fnError(ctx, "custom", {}, `A GIF with name '${name}' already exists.`);
            }

            const lastCanvas = ctx.data.gif[ctx.data.gif.length - 1];
            if (!lastCanvas) {
                return ctx.aoiError.fnError(ctx, "custom", {}, "No canvas available to create GIF.");
            }

            ctx.data.gifManager.set(name, lastCanvas);
            ctx.data.gif = ctx.data.gif.slice(0, -1);

            return {
                code: ctx.util.setCode(data),
                data: ctx.data
            };
        } catch (error) {
            return ctx.aoiError.fnError(ctx, "custom", {}, "Failed to create GIF.");
        }
    }
});