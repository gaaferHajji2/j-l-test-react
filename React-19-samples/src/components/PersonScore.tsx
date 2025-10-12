import { useEffect, useState } from "react";
import { getPerson } from "../utils/Person";

export function PersonScore () {

    const [name, SetName] = useState<string>("");
    const [score, setScore] = useState<number>(0)

    useEffect(() =>  {
        getPerson().then(person => {
            console.log("My Name is: " + person.name)
            SetName(person.name)
        });

        async function getPersonName() {
            const person = await getPerson();
            console.log("My name 2 is: " + person.name)
        }

        // getPersonName()
        
        return () => SetName("")
    }, [])

    function addToScore() {
        setScore((prev) => prev + 1);
    }

    function subtractFromScore() {
        if(score!=0) {
            setScore((prev) => prev-1);
        }
    }

    function resetScore() {
        setScore(0);
    }

    if(name == "") {
        return <h1>Loading name...</h1>
    }



    return (<div>
        <h1>My name is: {name}, Score: {score}</h1>
        <button onClick={() => addToScore()}>Add</button>
        <button onClick={() => subtractFromScore() }>Subtract</button>
        <button onClick={() => resetScore() }>Reset</button>
    </div>);
}