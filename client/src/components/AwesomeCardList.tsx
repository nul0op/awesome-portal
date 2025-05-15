import { useContext, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { LinkContext } from "../ContextProvider";
// import { Link } from "@mui/material";
import AwesomeCard from "./AwesomeCard";
// import { getLinkContext, getUserContext } from "../ContextProvider";

export default function CardList() {
    
    const context = useContext(LinkContext);
    const {linkList, setLinkList, refreshLinkList, setRefreshLinkList}  = useContext(LinkContext);
    
    // let userContext = getUserContext();
    // let userContext = useContext(UserContext);

    useEffect(() => {
        console.log("loading all links");

        fetch("http://127.0.0.1:3000/links", {
            method: "GET",
            headers: {
                // "Authorization": `Bearer ${userContext.accessToken}`
            }
        })
        .then( (response) => {
            return response.json();
        })
        .then( (payload) => {
            setLinkList(payload);
        });
    }, [refreshLinkList]);

    return (
        linkList.map( (link) => <AwesomeCard link={link}/> )
    )
}