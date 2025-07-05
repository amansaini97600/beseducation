import { Link } from "react-router-dom";

export default function AdminSidebar() {
    return (
        <div className="w-64 bg-blue-900 text-white min-h-screen p-4 space-y-4">
            <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
            <nav className="space-y-2">
                <Link to="/admin" className="block hover:bg-blue-700 p-2 rounded">
                    Dashboard
                </Link>
                <Link to="/admin/students" className="block hover:bg-blue-700 p-2 rounded">
                    Students
                </Link>
                <Link to="/admin/courses" className="block hover:bg-blue-700 p-2 rounded">
                    Courses
                </Link>
                <Link to="/admin/add-student" className="block hover:bg-blue-700 p-2 rounded">
                    Add Student
                </Link>

                <Link to="/admin/generate-certificate" className="block hover:bg-blue-700 p-2 rounded">
                    Generate Certificate
                </Link>

                <Link to="/admin/certificates" className="block hover:bg-blue-700 p-2 rounded">All Certificates</Link>

                <Link to="/admin/generate-diploma" className="block hover:bg-blue-700 p-2 rounded">
                    Generate Diploma
                </Link>

                <Link to="/admin/diploma" className="block hover:bg-blue-700 p-2 rounded">All Diplomas</Link>

                <Link to="/admin/upload-notes" className="block hover:bg-blue-700 p-2 rounded">Add Notes</Link>

                <Link to="/admin/notes" className="block hover:bg-blue-700 p-2 rounded">All Notes</Link>

                <button
                    onClick={() => {
                        localStorage.removeItem("adminToken");
                        window.location.href = "/admin-login";
                    }}
                    className="mt-4 block w-full text-left hover:bg-red-600 p-2 rounded bg-red-500"
                >
                    Logout
                </button>

            </nav>
        </div>
    );
}
