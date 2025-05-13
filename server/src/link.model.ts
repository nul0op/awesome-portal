import { Knex } from "knex";
import awesomedb from "./awesomedb";
import { AwesomeLink } from "./models/Awesome";

export const getAll = () => {
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
        }
    );
}