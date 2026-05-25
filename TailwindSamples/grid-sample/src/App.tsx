import './App.css'

function App() {
  return (
    <>
      <div className="mx-auto p-8 w-full lg:w-1/2">
        <h1 className="text-3xl font-bold">Grid Layout Examples</h1>
        <h2 className="my-6 text-2xl underline underline-offset-2">Example #1</h2>
        <div className="grid grid-cols-3 grid-rows-2 gap-x-4 gap-y-2">
          <div className="box row-span-2 col-span-2">1</div>
          <div className="box">2</div>
          <div className="box">3</div>
        </div>
      </div>
    </>
  )
}

export default App
