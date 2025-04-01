import { FormEvent, useState } from "react"

// interface Person {
//   name: string,
//   age: number
// }

const Form = () => {

  const [person, setPerson] = useState({ name: "", age: ''});

  // const handleChange = (e: ChangeEvent) => {
  //   setPerson({ ...person, [e.target.name]: e.target.value});
  // }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    console.log("Data Has Been Submitted");

    console.log(person);

    // console.log(nameRef.current);
    // console.log(nameRef.current?.value);

    // console.log(ageRef.current);
    // console.log(ageRef.current?.value);
  }

  // const nameRef= useRef<HTMLInputElement>(null);

  // const ageRef = useRef<HTMLInputElement>(null);

  return (
    <form onSubmit={handleSubmit}>
        <div className="mb-3">
            <label htmlFor="name" className="form-label">Name Here: </label>
            <input type="text" className="form-control" id='name' 
            onChange={(event) => setPerson( { ...person, name: event.target.value})}
            value={person.name}
            />
        </div>

        <div className="mb-3">
            <label htmlFor="age" className="form-label">Your Age</label>
            <input type="number" className="form-control" id='age' 
            onChange={(event) => setPerson( { ...person, age: event.target.value})} 
            value={person.age}  
          />
        </div>

        <button className="btn btn-primary" type="submit">Save The Values</button>
    </form>
  )
}

export default Form