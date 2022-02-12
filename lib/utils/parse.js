"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAsStringArray = void 0;
function parseAsStringArray(text) {
    try {
        const result = JSON.parse(text);
        if (!Array.isArray(result))
            throw new Error("Result is not an array");
        const allItemsStrings = result.some((item) => typeof item === "string");
        if (!allItemsStrings)
            throw new Error("Not all items in array are strings");
        return result;
    }
    catch (err) {
        console.debug(err);
        return null;
    }
}
exports.parseAsStringArray = parseAsStringArray;
