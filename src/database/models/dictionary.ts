export interface IKeyCollection<T> {
    addOrUpdate(key: string, value: T):void;
    containsKey(key: string): boolean;
    size(): number;
    getItem(key: string): T;
    removeItem(key: string): T;
    getKeys(): string[];
    values(): T[];
}

export class Dictionary<T> implements IKeyCollection<T> {
    private items: { [index: string]: T } = {};
    private count: number = 0;
    constructor(pItems?: { [index: string]: T }) {
        if (pItems) {
            Object.keys(pItems).forEach((itemKey) => {
                this.addOrUpdate(itemKey, pItems[itemKey]);
            });
        }
    }
    public addOrUpdate(key: string | number, value: T):void {
        if (key !== null && key !== undefined) {
            if (!this.items.hasOwnProperty(key)) {
                this.count++;
            }

            this.items[key] = value;
        } else {
            throw new TypeError(`Key cannot be null or undefined`);
        }
    }

    public containsKey(key: string | number): boolean {
        if (key !== null && key !== undefined) {
            return this.items.hasOwnProperty(key);
        } else {
            return false;
        }
    }

    public size(): number {
        return this.count;
    }

    public getItem(key: string | number): T {
        if (key !== null && key !== undefined) {
            return this.items[key];
        } else {
            return null as any;
        }
    }

    public removeItem(key: string | number): T {
        if (key !== null && key !== undefined) {
            const value = this.items[key];

            delete this.items[key];
            this.count--;

            return value;
        } else {
            return null as any;
        }
    }

    public getKeys(): string[] {
        const keySet: string[] = [];

        for (const property in this.items) {
            if (this.items.hasOwnProperty(property)) {
                keySet.push(property);
            }
        }

        return keySet;
    }

    public values(): T[] {
        const values: T[] = [];

        for (const property in this.items) {
            if (this.items.hasOwnProperty(property)) {
                values.push(this.items[property]);
            }
        }

        return values;
    }
}
