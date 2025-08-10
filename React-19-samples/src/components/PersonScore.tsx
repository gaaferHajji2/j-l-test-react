import { useEffect, useState } from "react";
import { getPerson } from "../utils/Person";

export function MyName () {

    const [name, SetName] = useState<string>("");

    useEffect(() =>  {
        getPerson().then(person => SetName(person.name));
        
        return () => SetName("")
    }, [])

    if(name == "") {
        return <h1>Loading name...</h1>
    }

    return (<h1>My name is: {name}</h1>);
}