import awesomedb from "./awesomedb";
import { AwesomeLink } from "./models/Awesome";

const getAllLink = () => {
    console.log("here we are");

    // let q: Knex.QueryBuilder = 
    // awesomedb<AwesomeLink[]>('link').select({
    awesomedb('link').select({
        externalId: "external_id",
        name: "name",
        description: "description",
        href: "href",

    }).then( (rows) => {
        console.log(rows);
        return rows;
    });
}

const saveLink = async (link: AwesomeLink) => {
    await awesomedb('link').insert({
        external_id: link.getExternalId(),
        level: link.getLevel(),
        name: link.getName(),
        description: link.getDescription(),
        href: link.getHref(),
    });
}

export {
    getAllLink, saveLink
}