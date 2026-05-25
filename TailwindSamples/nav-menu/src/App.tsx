import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './App.css'
import { faBars, faDraftingCompass } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'

function App() {

  // 1. Track toggle state
  const [isNavOpen, setIsNavOpen] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(true)

  // 2. Toggle function
  const handleToggle = () => {
    setIsNavOpen(prev => !prev);
  };

  const handleDarkMode = () => {
    setIsDarkMode(prev => !prev)
  }

  return (
    <>
      <header className='flex items-center justify-between flex-wrap bg-gray-800 py-4 w-full'>
        <div className='shrink-0 ml-6'>
          <a href="#">
            <FontAwesomeIcon icon={faDraftingCompass} size='2xl' className='text-yellow-200' />
            <span className='ml-1 text-3xl text-blue-200 font-semibold'>WebCraft</span>
          </a>
        </div>

        <button id='nav-toggle' className='md:hidden p-2 mr-4 ml-6 my-2 border rounded 
                                        border-gray-200 text-blue-500 hover:border-blue-200'
          onClick={handleToggle} aria-expanded={isNavOpen}>
          <FontAwesomeIcon icon={faBars} size='2xl' />
        </button>

        <div className={`pl-6 w-full md:w-auto ${!isNavOpen ? 'hidden' : ''} md:block`}>
          <ul className='md:flex'>
            <li className='mr-6 p-1 md:border-b-2 border-yellow-200'>
              <a className="text-blue-500 cursor-default" href='#'>Home</a>
            </li>
            <li className="mr-6 p-1 hover:border-b-2 hover:border-yellow-400">
              <a className="text-white hover:text-blue-300" href="#">Services</a>
            </li>
            <li className="mr-6 p-1 hover:border-b-2 hover:border-yellow-400">
              <a className="text-white hover:text-blue-300" href="#">Projects</a>
            </li>
            <li className="mr-6 p-1 hover:border-b-2 hover:border-yellow-400">
              <a className="text-white hover:text-blue-300" href="#">Team</a>
            </li>
            <li className="mr-6 p-1 hover:border-b-2 hover:border-yellow-400">
              <a className="text-white hover:text-blue-300" href="#">About</a>
            </li>
            <li className="mr-6 p-1 hover:border-b-2 hover:border-yellow-400">
              <a className="text-white hover:text-blue-300" href="#">Contacts</a>
            </li>
          </ul>
        </div>
      </header>

      <div id='switch' className={`${isDarkMode ? 'dark': ''} m-6 w-1/3`}>
        <div 
          className='p-2 bg-white dark:bg-gray-800 dark:shadow-blue-950 shadow-2xl'
          onClick={handleDarkMode}
        >
          <h1>
            Click to toggle between dark and light mode...
          </h1>

          <p className='text-gray-600 dark:text-gray-300'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias provident dolor, 
            culpa suscipit autem laboriosam enim neque labore doloremque quia.
          </p>
        </div>
      </div>
    </>

  )
}

export default App
