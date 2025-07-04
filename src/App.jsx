import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Courses from "./pages/Courses";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./admin/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminAddStudent from "./admin/AdminAddStudent";
import StudentList from "./admin/studentList";
import CertificateForm from "./admin/CertificateForm";
import CertificatePage from "./admin/CertificatePage";
import CertificateList from "./admin/CertificateList";
import EditCertificate from "./admin/EditCertificate";
import DiplomaForm from "./admin/DiplomaForm";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/admin-login" element={<AdminLogin />} />

            <Route
              path="/admin/add-student"
              element={
                <ProtectedRoute>
                  <AdminAddStudent />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/students"
              element={
                <ProtectedRoute>
                  <StudentList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/generate-certificate"
              element={
                <ProtectedRoute>
                  <CertificateForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/certificate/:id"
              element={
                <ProtectedRoute>
                  <CertificatePage />
                </ProtectedRoute>
              }
            />


            <Route
              path="/admin/certificates"
              element={
                <ProtectedRoute>
                  <CertificateList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/edit-certificate/:id"
              element={
                <ProtectedRoute>
                  <EditCertificate />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/generate-diploma"
              element={
                <ProtectedRoute>
                  <DiplomaForm />
                </ProtectedRoute>
              }
            />

          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

