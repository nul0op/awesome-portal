import crypto from 'crypto';

class AwesomeLink {
    private _name: string = null;
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    private _subscribersCount: number = 0;
    public get subscribersCount(): number {
        return this._subscribersCount;
    }
    public set subscribersCount(value: number) {
        this._subscribersCount = value;
    }

    private _watchersCount: number = 0;
    public get watchersCount(): number {
        return this._watchersCount;
    }
    public set watchersCount(value: number) {
        this._watchersCount = value;
    }

    private _description: string = null;
    public get description(): string {
        return this._description;
    }
    public set description(value: string) {
        this._description = value;
    }

    private _cloneUrl: string = null;
    public get cloneUrl(): string {
        return this._cloneUrl;
    }
    public set cloneUrl(value: string) {
        this._cloneUrl = value;
    }

    private _readmeUrl: string = null;
    public get readmeUrl(): string {
        return this._readmeUrl;
    }
    public set readmeUrl(value: string) {
        this._readmeUrl = value;
    }

    private _originUrl: string = null;
    public get originUrl(): string {
        return this._originUrl;
    }
    public set originUrl(value: string) {
        this._originUrl = value;
    }

    private _externalId: string = null;
    public get externalId(): string {
        return crypto.createHmac("sha256", "imasecret")
            .update(this._cloneUrl)
            .digest('hex');
    }
    
    private _level: number = 0;
    public get level(): number {
        return this._level;
    }

    public set level(value: number) {
        this._level = value;
    }
}

// export type {
//   "xxx",
// };

// Class objects
export {
    AwesomeLink,
};