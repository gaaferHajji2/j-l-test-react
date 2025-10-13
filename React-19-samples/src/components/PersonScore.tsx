// import { useEffect, useState } from "react";
import { useEffect, useReducer } from "react";
import { getPerson } from "../utils/Person";
import { reducer } from "../utils/ActionAndState";

export function PersonScore () {

    // const [name, SetName] = useState<string>("");
    // const [score, setScore] = useState<number>(0)

    const [{ name, score, loading }, dispatch] = useReducer(reducer, { name: "", score: 0, loading: true})

    useEffect(() =>  {
        getPerson().then(person => {
            dispatch({ type: 'initialize', name: person.name })
        });

        // async function getPersonName() {
        //     const person = await getPerson();
        //     console.log("My name 2 is: " + person.name)
        // }

        // getPersonName()
        
        return () => dispatch({ type: 'load' })
    }, [])

    function addToScore() {
        dispatch({ type: 'increment' })
    }

    function subtractFromScore() {
        if(score!=0) {
            dispatch({ type: 'decrement' })
        }
    }

    function resetScore() {
        dispatch({ type: 'reset' })
    }

    console.log("The loading is: ", loading)

    if(loading) {
        return <h1>Loading name...</h1>
    }



    return (<div>
        <h1>My name is: {name}, Score: {score}</h1>
        <button onClick={() => addToScore()}>Add</button>
        <button onClick={() => subtractFromScore() }>Subtract</button>
        <button onClick={() => resetScore() }>Reset</button>
    </div>);
}