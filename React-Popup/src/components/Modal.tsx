import { useEffect } from 'react';

interface Props {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const Modal = ({ visible, setVisible }: Props) => {
  if (!visible) return null;

  useEffect(() => {
    gsap.fromTo(
      '#modal-form',
      { opacity: 0, y: 100, rotation: '180deg' },
      { opacity: 1, y: 0, duration: 1, rotation: '0deg' }
    );
  });

  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-30 
            backdrop-blur-sm flex justify-center items-center min-w-md'
      id='modal-container'
      onClick={(e) => {
        if (e.target.id == 'modal-container') {
          setVisible(false);
        }
      }}
    >
      <div className='bg-white p-2 rounded min-w-96' id='modal-form'>
        <p className='text-gray-800 text-center'> Welcome To Our Site</p>
        <p className='text-center'>Sign In Form</p>
        <form className='min-w-md mx-auto flex justify-center items-center flex-col'>
          <div className='relative z-0 w-full mb-5 group'>
            <input
              type='email'
              name='floating_email'
              id='floating_email'
              className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
              placeholder=' '
              required
            />
            <label
              htmlFor='floating_email'
              className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform-translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
            >
              Email address
            </label>
          </div>
          <div className='relative z-0 w-full mb-5 group'>
            <input
              type='password'
              name='floating_password'
              id='floating_password'
              className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
              placeholder=' '
              required
            />
            <label
              htmlFor='floating_password'
              className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
            >
              Password
            </label>
          </div>

          <button
            type='submit'
            className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
