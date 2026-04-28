import { faFacebook, faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ContactUsSection() {
  return (
    <div className="w-1/3 border-r border-r-blue-800 p-3 text-center">
        <div className="my-6 text-xl font-semibold">CONTACT US</div>
        <p className="text-gray-400">
            Center Street <br />
            Syria, Damascus <br />
            Russia <br/>
            <strong>Phone:</strong> +963 999 9999 <br/>
            <strong>Email:</strong> jloka@jloka.com
        </p>

        <div className="flex justify-center space-x-4 mt-6">
            <button className="w-10 h-10 rounded bg-blue-500"><FontAwesomeIcon icon={faFacebook} size="2xl" /></button>
            <button className="w-10 h-10 rounded bg-blue-400"><FontAwesomeIcon icon={faTwitter} size="2xl" /></button>
            <button className="w-10 h-10 rounded bg-gray-300"><FontAwesomeIcon icon={faGithub} size="2xl" /></button>

        </div>
    </div>
  )
}
