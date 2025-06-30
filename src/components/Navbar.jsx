import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-700 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <h1 className="font-bold text-xl">My Coaching</h1>
        <div className="space-x-4">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/about" className="hover:underline">About</Link>
          <Link to="/courses" className="hover:underline">Courses</Link>
          {/* <Link to="/admission" className="hover:underline">Admission</Link> */}
          <Link to="/contact" className="hover:underline">Contact</Link>
          <Link to="/admin" className="hover:underline">Admin</Link>

        </div>
      </div>
    </nav>
  );
}
