
export default function EmailSection() {
    return (
        <section className='mt-8 text-white'>
            <div className='p-4 rounded-lg text-center  bg-linear-to-b from-red-400 to-red-200'>
                <h3 className='font-semibold text-lg'>
                    Get the latest news & tutorials right to your inbox
                </h3>

                <form>
                    <input 
                        type="email" 
                        placeholder='jloka@jloka.com' 
                        className='w-full mt-3 p-3 rounded shadow border border-gray-400 
                        focus:outline-none text-gray-800' 
                    />

                    <button 
                        type='submit' 
                        className='w-full mt-4 p-4 rounded shadow font-semibold uppercase 
                        tracking-wider bg-green-600 hover:bg-green-500 transition-colors'>
                        Subscripe
                    </button>
                </form>
            </div>
        </section>
    )
}
