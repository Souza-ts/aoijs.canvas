import { AoiFunction, GradientManager, ParamType } from '../../';

export default new AoiFunction<"djs">({
    name: "$addColorStop",
    description: "Adds a color stop to the gradient.",
    params: [
        {
            name: "gradient",
            description: "Name of the gradient.",
            type: ParamType.String,
            check: (v, c) => !!(c.data.gradients && c.data.gradients instanceof GradientManager && c.data.gradients.get(v)),
            checkError: () => "No gradient with provided name found.",
            optional: true,
        },
        {
            name: "offset",
            description: "The color stop offset (0-100).",
            type: ParamType.Number,
            check: (v) => v >= 0 && v <= 100,
            checkError: () => "Offset must be between 0 and 100."
        },
        {
            name: "color",
            description: "Color of the stop.",
            type: ParamType.Color,
            checkError: () => "Invalid color format."
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        const [ name, offset, color ] = ctx.params;

        try {
            if (!ctx.data.gradients || !(ctx.data.gradients instanceof GradientManager)) {
                return ctx.aoiError.fnError(ctx, "custom", {}, "No gradient manager found.");
            }

            const gradient = name 
                ? ctx.data.gradients.get(name)
                : null;
            
            if (!gradient) {
                ctx.data.colorStops = ctx.data?.colorStops
                    ? [...ctx.data.colorStops, [offset / 100, color]] 
                    : [[offset / 100, color]];
            } else {
                try {
                    gradient.addColorStop(offset / 100, color);
                } catch (error) {
                    return ctx.aoiError.fnError(ctx, "custom", {}, "Failed to add color stop to gradient.");
                }
            }

            return {
                code: ctx.util.setCode(data),
                data: ctx.data
            };
        } catch (error) {
            return ctx.aoiError.fnError(ctx, "custom", {}, "Failed to add color stop.");
        }
    }
});