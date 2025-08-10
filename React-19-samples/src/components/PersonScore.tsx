import { useEffect, useState } from "react";
import { getPerson } from "../utils/Person";

export function PersonScore () {

    const [name, SetName] = useState<string>("");

    useEffect(() =>  {
        getPerson().then(person => {
            console.log("My Name is: " + person.name)
            SetName(person.name)
        });

        async function getPersonName() {
            const person = await getPerson();
            console.log("My name 2 is: " + person.name)
        }

        getPersonName()
        
        return () => SetName("")
    }, [])

    if(name == "") {
        return <h1>Loading name...</h1>
    }

    return (<h1>My name is: {name}</h1>);
}