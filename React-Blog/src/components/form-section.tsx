
export default function FormSection() {
  return (
    <section className="flex flex-col bg-red-400 items-center p-4 rounded-lg">
        <div className="text-white text-center">
            <h2 className="font-bold text-3xl">Want to stay up-to-date?</h2>
            <h3 className="text-xl">Join our mail list for hot news & new tutorials</h3>
        </div>
        
        <div>
            <form className="flex my-4">
                <input type="email" className="p-4 rounded-l-lg focus:outline-none text-gray-800 border bg-white" placeholder="jloka@jloka.com" />
                <button className="rounded-r-lg p-4 font-bold uppercase tracking-wider text-white bg-green-500 hover:bg-green-200 transition-colors duration-500">Subscribe</button>
            </form>
        </div>
        
    </section>
  )
}
