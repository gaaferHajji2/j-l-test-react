import AboutUsSection from "./AboutUsSection";
import ContactUsSection from "./ContactUsSection";
import SayHello from "./sayHello";

export default function FooterContent() {
  return (
    <footer className="bg-blue-900">
        <div className="flex flex-wrap text-white p-3">
            <AboutUsSection />
            <ContactUsSection />
            <SayHello />
        </div>
    </footer>
  )
}
