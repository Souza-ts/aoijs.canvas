import { CanvasBuilder, CanvasManager } from "../classes";
import { AttachmentBuilder } from "discord.js";
import { AoiD } from "../index";

/**
 * Command to attach a rendered canvas to the message
 */
export default {
    name: "$attachCanvas",
    code: async (d: AoiD): Promise<{ code: string; data: typeof d.data }> => {
        try {
            // Get command data
            const data = d.util.aoiFunc(d);
            
            // Validate arguments
            const [canvasName = "default", fileName = "{canvas}.png"] = data.inside.split(" ");

            // Check if canvas manager exists
            const canvasManager = d.data.canvases;
            if (!canvasManager || !(canvasManager instanceof CanvasManager)) {
                return d.aoiError.fnError(
                    d,
                    "custom",
                    {},
                    "No canvas manager found."
                );
            }

            // Get specific canvas
            const canvas = canvasManager.get(canvasName);
            if (!canvas || !(canvas instanceof CanvasBuilder)) {
                return d.aoiError.fnError(
                    d,
                    "custom",
                    {},
                    `Canvas '${canvasName}' not found.`
                );
            }

            // Render and create attachment
            const attachment = new AttachmentBuilder(canvas.render(), {
                name: fileName?.replace(/{canvas}/g, canvasName) ?? `${canvasName}.png`
            });

            // Add file to message
            d.files.push(attachment);
            return {
                code: d.util.setCode(data),
                data: d.data
            };
        } catch (error) {
            console.error("Error processing $attachCanvas command:", error);
            return d.aoiError.fnError(d, "custom", {}, "Error processing canvas.");
        }
    }
};