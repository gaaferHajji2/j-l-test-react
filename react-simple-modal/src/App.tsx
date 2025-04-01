import { Trash } from 'react-feather'
import './App.css'
import { useState } from 'react'
import Modal from './components/Modal';

function App() {

  const [open, setOpen] = useState<boolean>(false);

  return (
    <main>
      <button className='bg-red-500 hover:bg-red-400 text-white 
        font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 
        rounded'
        onClick={() => setOpen(true)}>
        <Trash size={40} /> Delete
      </button>

      <Modal open={open} onClose={() => setOpen(false)}>
        
        <div className={`text-center w-56`}>
          <Trash size={56} className='mx-auto text-red-500 ' />

          <div className={`mx-auto my-4 w-48`}>
            <h3 className={`text-lg font-black text-gray-800`}>
              Confirm Delete
            </h3>

            <p className={`text-sm text-gray-500`}>
              Are You Sure You Want To Delete This Item?
            </p>
          </div>

          <div className='flex gap-4'>
            <button className={`w-full bg-red-500 hover:bg-red-400 text-white 
            font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 
            rounded`} onClick={() => setOpen(false)}>
              Delete
            </button>

            <button className={`w-full bg-white/20 hover:bg-gray-400 text-gray-800 
            font-bold py-2 px-4 border-b-4 border-gray-700 hover:border-gray-500 
            rounded`} onClick={() => setOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      </Modal>

    </main>
  )
}

export default App
