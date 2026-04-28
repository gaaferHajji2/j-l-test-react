import AboutUsSection from "./about-us-section";
import ContactUsSection from "./contact-us-section";

export default function FooterContent() {
  return (
    <footer className="bg-blue-900">
        <div className="flex flex-wrap text-white p-3">
            <AboutUsSection />
            <ContactUsSection />
        </div>
    </footer>
  )
}
