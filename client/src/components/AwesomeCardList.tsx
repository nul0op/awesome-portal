import { useContext, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { LinkContext } from "../ContextProvider";
import { Link } from "@mui/material";
// import { getLinkContext, getUserContext } from "../ContextProvider";

export default function CardList() {
    // let userContext = getUserContext();
    
    const context = useContext(LinkContext);
    let linkList: any[] = [];
    let setLinkList: Dispatch<SetStateAction<any[]>> = () => {};

    if (context === null) {
        linkList = [];
        setLinkList = () => {};

    } else {
        linkList = context.linkList;
        setLinkList = context.setLinkList;
    }

    // const {linkList, setLinkList}  = useContext(LinkContext);
    
    
    let userContext = useContext(UserContext);

    console.log("inside card list: ", userContext);

    // let [linkList, setLinkList] = useState([]);

    const getAllLinks = async () => {
        console.log("loading all links");
        fetch("http://127.0.0.1:3000/links", {
            method: "GET",
            headers: { 
                "Authorization": `Bearer ${userContext.accessToken}`
            }
        })
        .then( (response) => {
            return response.json();
        })
        .then( (payload) => {
            setLinkList(payload);
        });
    }

    useEffect(() => { getAllLinks() }, [user]);
    
    return <></>;
    // return (
    //     linkList.map( (link) => <AwesomeCard link={link}/> )
    // )
}