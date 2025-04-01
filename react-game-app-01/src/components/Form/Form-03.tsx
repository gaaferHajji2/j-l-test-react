// import { FormEvent } from "react"
import { FieldValues, useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  // name: z.string().min(3).optional(),
  name: z.string().min(3, "This Field must be at least 3-characters"),
  age: z.number( { invalid_type_error: "You must enter Your Age" }).min(18, "You must be 18 or older"),
});


type FormDataValue = z.infer<typeof schema>;

const Form = () => {

  // const [person, setPerson] = useState({ name: "", age: ''});

  const { register, handleSubmit, formState: { errors, isValid } } = useForm<FormDataValue>({ resolver: zodResolver(schema)});

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
            { ...register('name') }
            />
            {/* { errors.name?.type === 'required' && <p className="text-danger">This Field is Required</p>} */}
            { errors.name && <p className="text-danger">{errors.name.message}</p>}
            {/* { errors.name?.type === 'minLength' && <p className="text-danger">This Field At Least 3-chars</p>} */}
        </div>

        <div className="mb-3">
            <label htmlFor="age" className="form-label">Your Age</label>
            <input type="number" className="form-control" id='age' 
            { ...register('age', { valueAsNumber: true }) }
          />
          { errors.age && <p className="text-danger">{errors.age.message}</p>}
          {/* { errors.age?.type === 'min' && <p className="text-danger">The minimum value is 1</p>} */}

        </div>

        <button disabled={!isValid} className="btn btn-primary" type="submit">Save The Values</button>
    </form>
  )
}

export default Form