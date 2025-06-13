import { loadImage } from '@napi-rs/canvas';
export declare const fontRegex: RegExp;
export declare function isURL(url: string): boolean;
export declare class CanvasUtil {
    static fetchImage: typeof loadImage;
    static isValidFont: (font: string) => boolean;
    static parseFilters: (filters: string) => {
        filter: string;
        value: string;
        raw: string;
    }[];
    static rgbaToHex: (r: number, g: number, b: number, a?: number) => string;
    static hexToRgba: (hex: string) => {
        red: number;
        green: number;
        blue: number;
        alpha: number | undefined;
    };
}
//# sourceMappingURL=util.d.ts.map