"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dictionary = void 0;
class Dictionary {
    constructor(pItems) {
        this.items = {};
        this.count = 0;
        if (pItems) {
            Object.keys(pItems).forEach((itemKey) => {
                this.addOrUpdate(itemKey, pItems[itemKey]);
            });
        }
    }
    addOrUpdate(key, value) {
        if (key !== null && key !== undefined) {
            if (!this.items.hasOwnProperty(key)) {
                this.count++;
            }
            this.items[key] = value;
        }
        else {
            throw new TypeError(`Key cannot be null or undefined`);
        }
    }
    containsKey(key) {
        if (key !== null && key !== undefined) {
            return this.items.hasOwnProperty(key);
        }
        else {
            return false;
        }
    }
    size() {
        return this.count;
    }
    getItem(key) {
        if (key !== null && key !== undefined) {
            return this.items[key];
        }
        else {
            return null;
        }
    }
    removeItem(key) {
        if (key !== null && key !== undefined) {
            const value = this.items[key];
            delete this.items[key];
            this.count--;
            return value;
        }
        else {
            return null;
        }
    }
    getKeys() {
        const keySet = [];
        for (const property in this.items) {
            if (this.items.hasOwnProperty(property)) {
                keySet.push(property);
            }
        }
        return keySet;
    }
    values() {
        const values = [];
        for (const property in this.items) {
            if (this.items.hasOwnProperty(property)) {
                values.push(this.items[property]);
            }
        }
        return values;
    }
}
exports.Dictionary = Dictionary;
