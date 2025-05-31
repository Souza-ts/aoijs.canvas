import { AoiFunction, ParamType } from '../../';
const gifencoder = require("gif-encoder-2");

export default new AoiFunction<"djs">({
    name: "$setGIFSize",
    description: "Sets the size of the new GIF.",
    params: [
        {
            name: "width",
            description: "Width of the new GIF.",
            type: ParamType.Number,
            check: (v) => v > 0,
            checkError: () => "Width must be a positive number."
        },
        {
            name: "height",
            description: "Height of the new GIF.",
            type: ParamType.Number,
            check: (v) => v > 0,
            checkError: () => "Height must be a positive number."
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        const [ width, height ] = ctx.params;

        try {
            if (width <= 0 || height <= 0) {
                return ctx.aoiError.fnError(ctx, "custom", {}, "Width and height must be positive numbers.");
            }

            const gif = new gifencoder(
                width,
                height
            );
            gif.start();
            
            ctx.data.gif = ctx.data.gif && Array.isArray(ctx.data.gif) ? ctx.data.gif : [];
            ctx.data.gif.push(gif);

            return {
                code: ctx.util.setCode(data),
                data: ctx.data
            };
        } catch (error) {
            return ctx.aoiError.fnError(ctx, "custom", {}, "Failed to create GIF with specified size.");
        }
    }
});