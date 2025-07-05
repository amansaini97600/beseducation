import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white pt-10 pb-6 px-4">
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-8">

        {/* Coaching Info */}
        <div>
          <h2 className="text-2xl font-bold mb-2">CEC Computer Center</h2>
          <p className="text-sm text-gray-300">
            Providing quality computer education to empower students for the digital age.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/coursesSection" className="hover:text-white">Courses</Link></li>
            <li><Link to="/notes" className="hover:text-white">Notes</Link></li>
            <li><Link to="/contactSection" className="hover:text-white">Contact</Link></li>
            <li><Link to="/admin-login" className="hover:text-white">Admin Login</Link></li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Contact Info</h3>
          <p className="text-sm text-gray-300">📍 Near City Library, Dhampur, UP</p>
          <p className="text-sm text-gray-300">📞 +91 9876543210</p>
          <p className="text-sm text-gray-300 mb-4">📧 cec.coaching@email.com</p>

          <div className="flex space-x-4 text-lg">
            <a href="#" className="hover:text-blue-400"><FaFacebook /></a>
            <a href="#" className="hover:text-pink-400"><FaInstagram /></a>
            <a href="#" className="hover:text-red-500"><FaYoutube /></a>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-400 mt-10 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} CEC Computer Center. All rights reserved.
      </div>
    </footer>
  );
}
