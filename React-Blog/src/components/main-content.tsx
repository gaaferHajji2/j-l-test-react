import Article02 from "./article-02"
import Article01 from "./article-1"

function MainContent() {
  return (
    <div className="flex bg-blue-100 pb-4">
        <main className="flex flex-col w-2/3 pl-6 pr-4 pt-4">
            <Article01 />
            <Article02 />
        </main>
    </div>
  )
}

export default MainContent