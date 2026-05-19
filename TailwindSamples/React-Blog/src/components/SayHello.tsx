
export default function SayHello() {
  return (
    <div className="w-1/3 p-5">
        <form>
            <input className="w-full h-10 mb-4 p-2 border-b-2 border-blue-600 bg-blue-900" 
                type="email" placeholder="Your Email"
            />
            <textarea className="w-full h-24 mb-4 p-2 border-b-2 border-blue-600 bg-blue-900 outline-none" 
                placeholder="Your Message"
            />
            <button className="w-full px-4 py-2 rounded font-semibold tracking-wider bg-yellow-600 hover:bg-yellow-500">SEND</button>
        </form>
    </div>
  )
}
