import { createContext, useContext, useState } from "react";
import { UserSession, type Link } from "./Types.tsx";

let myUser = new UserSession();

interface linkObject {
    linkList: Link[],
    setLinkList: React.Dispatch<React.SetStateAction<Link[]>>
}

export const UserContext = createContext(myUser);
export const LinkContext = createContext<linkObject>({linkList: [], setLinkList: () => {}});


export function ContextProvider({children}: any) {
    let [linkList, setLinkList] = useState<any[]>([]);
    
    return (
        <UserContext.Provider value={myUser}>
            <LinkContext.Provider value={{linkList, setLinkList}}>
                {children}
            </LinkContext.Provider>
        </UserContext.Provider>
    )
}