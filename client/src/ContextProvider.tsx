import { createContext, useState } from "react";
import { type AwesomeSession, type Link } from "./Types.tsx";

interface linkObject {
    linkList: Link[],
    setLinkList: React.Dispatch<React.SetStateAction<Link[]>>,

    refreshLinkList: boolean,
    setRefreshLinkList: React.Dispatch<React.SetStateAction<boolean>>,

    searchString: string,
    setSearchString: React.Dispatch<React.SetStateAction<string>>

    awesomeSession: AwesomeSession | null;
    setAwesomeSession: (session: AwesomeSession) => void;
    loading: boolean;
}

export const LinkContext = createContext<linkObject>({
        linkList: [], setLinkList: () => {}, refreshLinkList: false, setRefreshLinkList: () => {},
        searchString: "", setSearchString: () => {},
        awesomeSession: null, setAwesomeSession: () => {}, loading: true
    }
);

export function ContextProvider({children}: any) {
    const [linkList, setLinkList] = useState<any[]>([]);
    const [refreshLinkList, setRefreshLinkList] = useState<boolean>(false);
    const [searchString, setSearchString] = useState<string>("");
    const [awesomeSession, setAwesomeSession] = useState<AwesomeSession | null>(null);

    return (
        <LinkContext.Provider value={{            
            linkList, setLinkList, 
            refreshLinkList, setRefreshLinkList,
            searchString, setSearchString,
            awesomeSession, setAwesomeSession, loading: false
            }}>
                {children}
        </LinkContext.Provider>
)
}