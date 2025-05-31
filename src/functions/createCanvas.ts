import { CanvasManager } from "../classes";
import { AoiD } from "../index";

/**
 * Creates a new canvas with specified dimensions
 */
export default {
    name: "$createCanvas",
    code: async (d: AoiD): Promise<{ code: string; data: typeof d.data }> => {
        try {
            // Get and process arguments
            const data = d.util.aoiFunc(d);
            const [name = "default", widthStr = "512", heightStr = "512"] = data.inside.split(" ");
            
            // Validate canvas name
            const canvasName = name.trim();
            if (!canvasName) {
                return d.util.error(d, "❌ Canvas name cannot be empty.");
            }

            // Convert and validate dimensions
            const width = parseFloat(widthStr);
            const height = parseFloat(heightStr);

            // Validate dimensions
            if (isNaN(width) || isNaN(height)) {
                return d.util.error(d, "❌ Width and height must be valid numbers.");
            }
            if (width <= 0 || height <= 0) {
                return d.util.error(d, "❌ Width and height must be greater than 0.");
            }

            // Initialize canvas manager if needed
            if (!d.data.canvases) {
                d.data.canvases = new CanvasManager();
            }

            // Check if canvas already exists
            if (d.data.canvases.has(canvasName)) {
                return d.util.error(d, `❌ A canvas with the name "${canvasName}" already exists.`);
            }

            // Create new canvas
            d.data.canvases.create(canvasName, width, height);

            return {
                code: d.util.setCode(data),
                data: d.data
            };

        } catch (error) {
            console.error("Error creating canvas:", error);
            return d.util.error(d, "❌ An error occurred while creating the canvas.");
        }
    }
};