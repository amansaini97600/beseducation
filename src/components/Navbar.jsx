import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-700 text-white p-4 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
        <h1 className="font-bold text-2xl mb-2 sm:mb-0">CEC Computer Center</h1>

        <div className="flex flex-wrap gap-4 text-sm sm:text-base justify-center sm:justify-end">
          <Link to="/" className="hover:text-yellow-300 transition">Home</Link>
          <Link to="/aboutSection" className="hover:text-yellow-300 transition">About</Link>
          <Link to="/coursesSection" className="hover:text-yellow-300 transition">Courses</Link>
          <Link to="/notes" className="hover:text-yellow-300 transition">Notes</Link>
          <Link to="/contactSection" className="hover:text-yellow-300 transition">Contact</Link>
          <Link to="/admin-login" className="hover:text-yellow-300 transition">Admin</Link>
        </div>
      </div>
    </nav>
  );
}
