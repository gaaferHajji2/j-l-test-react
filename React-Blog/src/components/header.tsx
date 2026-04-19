
import { faWind } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function Header() {
  return (
    <div className='mx-auto container'>
        <header className='flex justify-between items-center sticky top-0 z-10 py-4 bg-blue-900'>
            <div className='shrink-0 ml-6 cursor-pointer'>
                <FontAwesomeIcon icon={faWind} size="2x" className="text-yellow-200"/>
                <span className="text-3xl font-semibold text-blue-200">Tailwind School</span>
            </div>

            <ul className="flex mr-10 font-semibold">
                <li className="mr-6 p-1 border-b-2 border-yellow-200">
                    <a href="#" className="cursor-default text-blue-200">Home</a>
                </li>

                <li className="mr-6 p-1 border-b-2">
                    <a href="#" className="cursor-default hover:text-blue-300">News</a>
                </li>

                <li className="mr-6 p-1 border-b-2">
                    <a href="#" className="cursor-default hover:text-blue-300">Tutorials</a>
                </li>

                <li className="mr-6 p-1 border-b-2">
                    <a href="#" className="cursor-default hover:text-blue-300">Videos</a>
                </li>
            </ul>
        </header>
    </div>
  )
}
