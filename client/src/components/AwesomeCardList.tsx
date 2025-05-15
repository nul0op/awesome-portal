import { useContext, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { LinkContext } from "../ContextProvider";
// import { Link } from "@mui/material";
import AwesomeCard from "./AwesomeCard";
import { AwesomeSession } from "../Types";

export default function CardList() {
    const {linkList, setLinkList, refreshLinkList, searchString, awesomeSession}  = useContext(LinkContext);

    useEffect(() => {
        console.log("loading all links");
        if (!awesomeSession) { console.log("NO SESSION !"); return }

        fetch(`http://127.0.0.1:3000/links?search=${searchString}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${awesomeSession!.backendToken}`
            }
        })
        .then( (response) => {
            console.log("status code is: ", response.status);
            // if (response.status === 200) {
                return response.json();
            // } else {
            //     return [];
            // }
        })
        .then( (payload) => {
            setLinkList(payload);
        })
    }, [refreshLinkList]);

    return (
        linkList.map( (link) => <AwesomeCard link={link}/> )
    )
}