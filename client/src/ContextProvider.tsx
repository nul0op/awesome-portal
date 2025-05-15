import { createContext, useContext, useState } from "react";
import { UserSession, type Link } from "./Types.tsx";

let myUser = new UserSession();

interface linkObject {
    linkList: Link[],
    setLinkList: React.Dispatch<React.SetStateAction<Link[]>>,

    refreshLinkList: boolean,
    setRefreshLinkList: React.Dispatch<React.SetStateAction<boolean>>
}

export const UserContext = createContext(myUser);
export const LinkContext = createContext<linkObject>(
    {
        linkList: [], setLinkList: () => {},
        refreshLinkList: false, setRefreshLinkList: () => {}
    }
);

export function ContextProvider({children}: any) {
    let [linkList, setLinkList] = useState<any[]>([]);
    let [refreshLinkList, setRefreshLinkList] = useState<boolean>(false);

    return (
        <UserContext.Provider value={myUser}>
            <LinkContext.Provider value={{linkList, setLinkList, refreshLinkList, setRefreshLinkList}}>
                    {children}
            </LinkContext.Provider>
        </UserContext.Provider>
    )
}