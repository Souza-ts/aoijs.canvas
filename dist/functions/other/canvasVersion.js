"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../..");
const package_json_1 = require("../../../package.json");
exports.default = new __1.AoiFunction({
    name: "$canvasVersion",
    description: "Returns the aoi.canvas version.",
    params: [],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        data.result = package_json_1.version;
        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});
//# sourceMappingURL=canvasVersion.js.map