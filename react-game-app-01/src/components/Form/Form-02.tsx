// import { FormEvent } from "react"
import { FieldValues, useForm } from "react-hook-form";

const Form = () => {

  // const [person, setPerson] = useState({ name: "", age: ''});

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data: FieldValues) => console.log(data);

  // console.log(formState);
  // console.log(formState.errors)
  // console.log(errors)

  // const handleChange = (e: ChangeEvent) => {
  //   setPerson({ ...person, [e.target.name]: e.target.value});
  // }

  // const handleSubmit = (event: FormEvent) => {
  //   event.preventDefault();

  //   console.log("Data Has Been Submitted");

  //   // console.log(person);

  //   // console.log(nameRef.current);
  //   // console.log(nameRef.current?.value);

  //   // console.log(ageRef.current);
  //   // console.log(ageRef.current?.value);
  // }

  // const nameRef= useRef<HTMLInputElement>(null);

  // const ageRef = useRef<HTMLInputElement>(null);

  return (
    <form onSubmit={ handleSubmit(onSubmit) }>
        <div className="mb-3">
            <label htmlFor="name" className="form-label">Name Here: </label>
            <input type="text" className="form-control" id='name' 
            { ...register('name', { required: true, minLength: 3}) }
            />
            { errors.name?.type === 'required' && <p className="text-danger">This Field is Required</p>}
            { errors.name?.type === 'minLength' && <p className="text-danger">This Field At Least 3-chars</p>}
        </div>

        <div className="mb-3">
            <label htmlFor="age" className="form-label">Your Age</label>
            <input type="number" className="form-control" id='age' 
            { ...register('age', { required: true, min: 1 }) }
          />
          { errors.age?.type === 'required' && <p className="text-danger">This Field is Required</p>}
          { errors.age?.type === 'min' && <p className="text-danger">The minimum value is 1</p>}

        </div>

        <button className="btn btn-primary" type="submit">Save The Values</button>
    </form>
  )
}

export default Form