import type { Session } from "@toolpad/core";

export class AwesomeSession implements Session {
    user?: {
        id?: string | null;
        name?: string | null;
        image?: string | null;
        email?: string | null;
        token?: string | null;
    };

    name!: string;
    email!: string;
    image!: string;
    googleToken!: string;
    backendToken!: string;
}

export interface Link {
    externalId: "external_id",
    name: "name",
    description: "description",
    originUrl: "origin_url",
    subscribersCount: "subscribers_count",
    watchersCount: "watchers_count",
    updated: "updated",
    topics: "topics"
}