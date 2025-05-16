import awesomedb from "./awesomedb";
import { AwesomeUser } from "./models/global";

const getUser = async (uid: string) => {
    let rows = await awesomedb('user').select({ 
        externalId: "external_id",
        name: "name",
        email: "email",
    }).where("external_id", "=", uid);
    
    return rows.length === 0 ? null : rows[0];
}

const saveUser = async (req: any) => {
    if (!await getUser(req.user.uid)) {
        await awesomedb('user').insert({
            external_id: req.user.uid,
            name: req.user.name,
            email: req.user.email,
        });
    }
}

export {
    getUser, saveUser
}