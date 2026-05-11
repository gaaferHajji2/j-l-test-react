
export default function InfoSection() {
  return (
    <section className='mt-8'>
        <h3 className="mb-4 pb-2 text-2xl font-semibold border-b-2 border-b-yellow-500 text-blue-500">
            Categories
        </h3>

        <ul>
            <li className="mb-1">
                <a className="text-blue-900 hover:text-blue-500 hover:cursor-pointer">Layout</a>
            </li>

            <li className="mb-1">
                <a className="text-blue-900 hover:text-blue-500 hover:cursor-pointer">Typography</a>
            </li>

            <li className="mb-1">
                <a className="text-blue-900 hover:text-blue-500 hover:cursor-pointer">Colors</a>
            </li>

            <li className="mb-1">
                <a className="text-blue-900 hover:text-blue-500 hover:cursor-pointer">Imagery</a>
            </li>
        </ul>
    </section>
  )
}
