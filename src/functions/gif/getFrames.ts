import { AoiFunction, CanvasUtil, GIFManager, Param, ParamType } from '../../';
import { existsSync } from "node:fs";
const gifframes = require("gif-frames");

export default new AoiFunction<"djs">({
    name: "$getFrames",
    description: "Extracts frames from a gif.",
    params: [
        {
            name: "src",
            description: "The gif.",
            type: ParamType.String,
            check: async (v, c) => 
                c.checkType(c, { type: ParamType.Url } as Param, v)
                || await existsSync(v) || (v.startsWith("gif:")
                    && c.data.gifManager && c.data.gifManager instanceof GIFManager && c.data.gifManager.get(v.split("gif:").slice(1).join(":"))),
            optional: true
        },
        {
            name: "amount",
            description: "The amount of frames to extract.",
            type: ParamType.Number,
            check: (v) => v > 0,
            optional: true
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        let [ src, amount ] = ctx.params;

        try {
            if (src.startsWith("gif:")) {
                const gifName = src.split("gif:").slice(1).join(":");
                const gif = ctx.data.gifManager?.get(gifName);
                
                if (!gif) {
                    return ctx.aoiError.fnError(ctx, "custom", {}, "No GIF with provided name found.");
                }
                
                src = gif.out.getData();
            }

            const frames = await gifframes({
                url: src,
                frames: amount ? amount - 1 : "all",
                outputType: "png"
            });

            const frameColors = frames.map((frame: any) => {
                const imageData = frame.getImage().data;
                const colors: string[] = [];

                for (let i = 0; i < imageData.length; i += 4) {
                    colors.push(CanvasUtil.rgbaToHex(
                        imageData[i] ?? 0,
                        imageData[i + 1] ?? 0,
                        imageData[i + 2] ?? 0,
                        (imageData[i + 3] ?? 0) / 255
                    ));
                }

                return colors;
            });

            data.result = JSON.stringify(frameColors);

            return {
                code: ctx.util.setCode(data),
                data: ctx.data
            };
        } catch (error) {
            return ctx.aoiError.fnError(ctx, "custom", {}, "Failed to extract frames from GIF.");
        }
    }
});