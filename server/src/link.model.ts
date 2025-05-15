import awesomedb from "./awesomedb";
import { AwesomeLink } from "./models/Awesome";

const getAllLink = async (filter:string) => {
    let links = await awesomedb('link').select({ 
        externalId: "external_id",
        name: "name",
        description: "description",
        originUrl: "origin_url",
        subscribersCount: "subscribers_count",
        watchersCount: "watchers_count"

    }).modify(function(queryBuilder) {
        if (filter && filter.length > 0) {
            queryBuilder.where("name", "ilike", `%${filter}%`);
            queryBuilder.orWhere("description", "ilike", `%${filter}%`);
        }
    })
        
    return links;
}

// FIXME: there is duplicates in the links ...
const saveLink = async (link: AwesomeLink) => {
    await awesomedb('link').insert({
        external_id: link.externalId,
        level: link.level,
        name: link.name,
        description: link.description,
        origin_url: link.originUrl,
        subscribers_count: link.subscribersCount,
        watchers_count: link.watchersCount
    });
}

export {
    getAllLink, saveLink
}