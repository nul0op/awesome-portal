export class UserSession {
    private _username: string|null = null;
    public get username(): string|null {
        return this._username;
    }
    public set username(value: string) {
        this._username = value;
    }

    private _accessToken: string|null = null;
    public get accessToken(): string|null {
        return this._accessToken;
    }
    public set accessToken(value: string) {
        this._accessToken = value;
    }
}

export interface Link {
    externalId: "external_id",
    name: "name",
    description: "description",
    originUrl: "origin_url",
    subscribersCount: "subscribers_count",
    watchersCount: "watchers_count"
}