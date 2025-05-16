import { useContext, useEffect } from "react";
import { LinkContext } from "../ContextProvider";
import AwesomeCard from "./AwesomeCard";

export default function CardList() {
    const {linkList, setLinkList, refreshLinkList, searchString, awesomeSession}  = useContext(LinkContext);

    useEffect(() => {
        if (!awesomeSession) { console.log("NO SESSION !"); return }

        fetch(`${import.meta.env.VITE_BACKEND_URL}/links?search=${searchString}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${awesomeSession!.backendToken}`
            }
        })
        .then( (response) => {
             if (response.status === 200) {
                return response.json();
            } else {
                return [];
            }
        })
        .then( (payload) => {
            setLinkList(payload);
        })
    }, [refreshLinkList, awesomeSession]);

    return (
        linkList.map( (link) => <AwesomeCard link={link}/> )
    )
}