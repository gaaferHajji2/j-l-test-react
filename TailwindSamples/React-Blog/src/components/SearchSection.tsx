import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function SearchSection() {
  return (
    <section>
        <form className='flex'>
            <input 
                type='text' 
                className='w-full px-3 py-2 rounded-l-lg focus:outline-none text-gray-800 shadow-2xl'
                placeholder='Search...'
            />
            <button 
            className='px-2 rounded-r-lg focus:outline-none text-center text-xl
             text-gray-400 hover:text-gray-900 bg-white'>
                <FontAwesomeIcon icon={faSearch} />
            </button>

        </form>
    </section>
  )
}
