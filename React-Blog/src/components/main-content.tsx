import Article02 from "./article-2"
import Article01 from "./article-1"
import Article03 from "./article-3"
import SearchSection from "./search-section"
import EmailSection from "./email-section"
import InfoSection from "./info-section"
import SimpleAlert from "./simpleAlert"

function MainContent() {
  return (
    <div className="flex bg-blue-100 pb-4">
        <main className="flex flex-col w-2/3 pl-6 pr-4 pt-4">
            <Article01 />
            <Article02 />
            <Article03 />
        </main>

        <aside className="w-1/3 pl-4 pr-4 pt-8">
          <SearchSection />
          <EmailSection />
          <InfoSection />

          <SimpleAlert />
        </aside>

        
    </div>
  )
}

export default MainContent