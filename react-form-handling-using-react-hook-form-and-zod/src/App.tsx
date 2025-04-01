import './App.css'

import { useForm } from 'react-hook-form';

import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

const registerSchema = z.object({
  email: z.string()
    .min(5, 'Email Must Be At Least 5-Characters')
    .email('Enter Valid Email Address Please'),

  password: z.string().min(5, 'Password Must Be At Least 5-characters'),

  confirm: z.string().min(5, 'Confirm Password Must Be At Least 5-Characters'),
}).refine(data => data.password === data.confirm, {
  message: 'Confirm Password Must Match Password',
  path: ['confirm']
});

type RegisterType = z.infer<typeof registerSchema>;

function App() {

  const { 
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterType>({ resolver: zodResolver(registerSchema)});

  const onSubmit = async (data: RegisterType) => {

    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Data is: ', data);

    console.log('The Error is: ', errors);

    console.log('The isSubmitting is: ', isSubmitting);

    registerSchema.safeParse(data);


    reset();
  }

  return (
    <main className='bg-gray-300 w-screen h-screen flex justify-center items-center'>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-y-2 w-[450px]'>
        <input { ...register('email') } 
          type='email' placeholder='Entre Your Email' 
          className='px-4 py-2 rounded outline-none' />
        {errors.email && <p className='text-red-700'>{`${errors.email.message}`}</p>}
        
        <input 
          { ...register('password') } 
          type='password' placeholder='Entre Your Password' 
          className='px-4 py-2 rounded outline-none' />
        {errors.password && <p className='text-red-700'>{`${errors.password.message}`}</p>}
        
        <input 
          { ...register('confirm') } 
        type='password' placeholder='Confirm Your Password' 
          className='px-4 py-2 rounded outline-none' />
        {errors.confirm && <p className='text-red-700'>{`${errors.confirm.message}`}</p>}
        
        <button 
          type='submit' 
          disabled= {isSubmitting}
          className='bg-green-700 disabled:bg-gray-400 py-2 rounded'>
          Submit The Form
        </button>
      </form>
    </main>
  )
}

export default App
