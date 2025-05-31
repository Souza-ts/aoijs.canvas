import { createCanvas, loadImage } from "@napi-rs/canvas";
import { AoiFunction, CanvasBuilder, CanvasManager, GIFManager, Param, ParamType } from '../../';
import { existsSync } from "node:fs";

export default new AoiFunction<"djs">({
    name: "$addFrame",
    description: "Adds a frame to the GIF.",
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
            name: "frame",
            description: "The frame to add.",
            type: ParamType.String,
            typename: "Path | URL | Canvas",
            check: async (v, c) => 
                c.checkType(c, { type: ParamType.Url } as Param, v)
                || await existsSync(v) || (v.startsWith("canvas:")
                    && c.data.canvasManager && c.data.canvasManager instanceof CanvasManager && c.data.canvasManager.get(v.split("canvas:").slice(1).join(":")))
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        let [ name, frame ] = ctx.params;

        const gif = name 
            ? ctx.data.gifManager?.get(name)
            : !name && ctx.data.gif 
                ? ctx.data.gif[ctx.data.gif.length - 1] : null;
                
        if (!gif)
            return ctx.aoiError.fnError(ctx, "custom", {}, "No gif to add the frame to.");
        
        if (frame.startsWith("canvas:")) {
            const canvasName = frame.split("canvas:").slice(1).join(":");
            const canvas = ctx.data.canvasManager?.get(canvasName);
            
            if (!canvas || !(canvas instanceof CanvasBuilder)) {
                return ctx.aoiError.fnError(ctx, "custom", {}, "Canvas not found.");
            }
            
            frame = canvas.ctx;
        } else {
            try {
                const img = await loadImage(frame);
                const canvas = createCanvas(img.width, img.height);
                const ctx = canvas.getContext('2d');
                
                ctx.drawImage(img, 0, 0, img.width, img.height);
                frame = ctx;
            } catch (error) {
                return ctx.aoiError.fnError(ctx, "custom", {}, "Invalid image URL or file path.");
            }
        };
        
        try {
            await gif.addFrame(frame);
        } catch (error) {
            return ctx.aoiError.fnError(ctx, "custom", {}, "Failed to add frame to GIF.");
        }

        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});