"use strict";
/*
Copyright © 2023 小兽兽/zhiyan114 (github.com/zhiyan114)
File is licensed respectively under the terms of the Apache License 2.0
or whichever license the project is using at the time https://github.com/Sayrix/Ticket-Bot/blob/main/LICENSE
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationError = exports.Translation = void 0;
const node_path_1 = __importDefault(require("node:path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
class Translation {
    primaryData;
    backupData;
    /**
     * locale handler module
     * @param optName The locale file name (w/o extension)
     * @param dir The directory of the locale files
     */
    constructor(optName, dir) {
        dir = dir ?? "./locale";
        const fullDir = node_path_1.default.join(dir, `${optName}.json`);
        if (!fs_extra_1.default.existsSync(fullDir))
            throw new TranslationError("Translation file not found, check your config to verify if the name is correct or not");
        this.primaryData = JSON.parse(fs_extra_1.default.readFileSync(fullDir, "utf8"));
        if (optName !== "main")
            this.backupData = JSON.parse(fs_extra_1.default.readFileSync(node_path_1.default.join(dir, "main.json"), "utf8"));
    }
    /**
     * Get the translation value or backup value if it doesn't exist
     * @param key The object key the translation should pull
     * @returns the translation data or throw error if the translation data cannot be found at all
     */
    getValue(key) {
        // Try return the data from the main translation file
        const main = this.primaryData[key];
        if (main)
            return main;
        // Pull backup and throw error if it doesn't exist
        const backup = this.backupData && this.backupData[key];
        if (!backup)
            throw new TranslationError(`TRANSLATION: Key '${key}' failed to pull backup translation. This indicates this key data does not exist at all.`);
        // Return the backup translation
        console.warn(`TRANSLATION: Key '${key}' is missing translation. If you can, please help fill in the translation and make PR for it.`);
        return backup;
    }
    getSubValue(...keys) {
        // Convert the dot to array
        if (keys.length === 1)
            keys = keys[0].split(".");
        // Check the primary value first
        let main = this.primaryData;
        let bkup = this.backupData;
        for (const key of keys) {
            if (typeof (main) === "object")
                main = main[key];
            if (this.backupData && typeof (bkup) === "object")
                bkup = bkup[key];
        }
        if (typeof (main) === "string" || typeof (main) === "number")
            return main;
        if (typeof (bkup) !== "string" && typeof (bkup) !== "number")
            throw new TranslationError(`TRANSLATION: Key '${keys.join(".")}' failed to pull backup translation. This indicates this key data does not exist at all.`);
        console.warn(`TRANSLATION: Key '${keys.join(".")}' is missing translation. If you can, please help fill in the translation and make PR for it.`);
        return bkup;
    }
    /**
     * Used for translation keys that can be empty
     * @param keys All the keys leading to the value
     * @returns the translation data or undefined if the translation data cannot be found
     */
    getNoErrorSubValue(...keys) {
        try {
            return this.getSubValue(...keys);
        }
        catch (ex) {
            return;
        }
    }
    getSubRawValue(...keys) {
        // Convert the dot to array
        if (keys.length === 1)
            keys = keys[0].split(".");
        // Check the primary value first
        let main = this.primaryData;
        let bkup = this.backupData;
        for (const key of keys) {
            if (typeof (main) === "object")
                main = main[key];
            if (this.backupData && typeof (bkup) === "object")
                bkup = bkup[key];
        }
        if (main !== undefined)
            return main;
        if (bkup === undefined)
            throw new TranslationError(`TRANSLATION: Key '${keys.join(".")}' failed to pull backup translation. This indicates this key data does not exist at all.`);
        console.warn(`TRANSLATION: Key '${keys.join(".")}' is missing translation. This is a raw value operation so please contact the dev before translating it.`);
        return bkup;
    }
}
exports.Translation = Translation;
class TranslationError {
    name = "TranslationError";
    message;
    constructor(msg) {
        this.message = msg;
    }
}
exports.TranslationError = TranslationError;
//# sourceMappingURL=translation.js.map