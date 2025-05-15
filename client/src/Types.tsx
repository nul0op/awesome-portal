export class AwesomeSession {
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
    watchersCount: "watchers_count"
}