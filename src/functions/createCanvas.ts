import { CanvasManager } from "../classes";
import { AoiD } from "../index";

export default {
    name: "$createCanvas",
    code: async (d: AoiD) => {
        let data = d.util.aoiFunc(d);
        let [ name = "canvas", width = "512", height = "512" ] = data.inside.splits;

        name = name.trim();
        width = parseFloat(width);
        height = parseFloat(height);

        if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
            return d.util.error(d, "❌ Largura e altura devem ser números válidos maiores que 0.");
        }

        if (!d.data.canvases)
            d.data.canvases = new CanvasManager();

        if (d.data.canvases.has(name)) {
            return d.util.error(d, `❌ O canvas com o nome "${name}" já existe.`);
        }

        d.data.canvases.create(name, width, height);

        return {
            code: d.util.setCode(data),
            data: d.data
        };
    }
};