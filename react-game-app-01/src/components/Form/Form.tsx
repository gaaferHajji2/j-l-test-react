import { FormEvent, useRef } from "react"


const Form = () => {

  const person = { name: '', age: 0 };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    console.log("Data Has Been Submitted");

    // console.log(nameRef.current);
    // console.log(nameRef.current?.value);

    if(nameRef.current !== null)
      person.name = nameRef.current.value;

    // console.log(ageRef.current);
    // console.log(ageRef.current?.value);
    if(ageRef.current !== null)
      person.age = parseInt(ageRef.current.value);

    console.log(person)
  }

  const nameRef= useRef<HTMLInputElement>(null);

  const ageRef = useRef<HTMLInputElement>(null);

  return (
    <form onSubmit={handleSubmit}>
        <div className="mb-3">
            <label htmlFor="name" className="form-label">Name Here: </label>
            <input type="text" className="form-control" id='name' ref={nameRef} />
        </div>

        <div className="mb-3">
            <label htmlFor="age" className="form-label">Your Age</label>
            <input type="number" className="form-control" id='age' ref={ageRef} />
        </div>

        <button className="btn btn-primary" type="submit">Save The Values</button>
    </form>
  )
}

export default Form