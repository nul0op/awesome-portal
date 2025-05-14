import { useEffect, useState } from "react";
import AwesomeCard from "./AwesomeCard";

export default  function CardList() {

    let [linkList, setLinkList] = useState([]);

    const getAllLinks = async () => {
        fetch("http://127.0.0.1:3000/links", {
            method: "GET",
            headers: { "X-test": "brol brol" }
        })
        .then( (response) => {
            return response.json();
        })
        .then( (payload) => {
            setLinkList(payload);
        });
    }

    useEffect(() => { getAllLinks() }, []);
    
    return (
        linkList.map( (link) => <AwesomeCard link={link}/> )
    )
}