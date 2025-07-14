import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import About from "./pages/AboutSection";
import Courses from "./pages/CoursesSection";
import ContactSection from "./pages/ContactSection";
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
import DiplomaPage from "./admin/DiplomaPage";
import DiplomaList from "./admin/DiplomaList";
import EditDiploma from "./admin/EditDiploma";
import NotesUpload from "./admin/NotesUpload";
import NotesList from "./admin/NotesList";
import StudentNotes from "./pages/StudentNotes";
import StudentCertificateSearch from "./pages/StudentCertificateSearch";
import StudentDiplomaSearch from "./pages/StudentDiplomaSearch";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin/");
  const isSearchPage = location.pathname === "/search-certificate";

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminRoute && <Navbar />}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aboutSection" element={<About />} />
          <Route path="/coursesSection" element={<Courses />} />
          <Route path="/contactSection" element={<ContactSection />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/notes" element={<StudentNotes />} />
          <Route path="/certificate/search" element={<StudentCertificateSearch />} />
          <Route path="/student/diploma" element={<StudentDiplomaSearch />} />


          <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/add-student" element={<ProtectedRoute><AdminAddStudent /></ProtectedRoute>} />
          <Route path="/admin/students" element={<ProtectedRoute><StudentList /></ProtectedRoute>} />
          <Route path="/admin/generate-certificate" element={<ProtectedRoute><CertificateForm /></ProtectedRoute>} />
          <Route path="/admin/certificate/:id" element={<ProtectedRoute><CertificatePage /></ProtectedRoute>} />
          <Route path="/admin/certificates" element={<ProtectedRoute><CertificateList /></ProtectedRoute>} />
          <Route path="/admin/edit-certificate/:id" element={<ProtectedRoute><EditCertificate /></ProtectedRoute>} />
          <Route path="/admin/generate-diploma" element={<ProtectedRoute><DiplomaForm /></ProtectedRoute>} />
          <Route path="/admin/diploma/:id" element={<ProtectedRoute><DiplomaPage /></ProtectedRoute>} />
          <Route path="/admin/diplomas" element={<ProtectedRoute><DiplomaList /></ProtectedRoute>} />
          <Route path="/admin/edit-diploma/:id" element={<ProtectedRoute><EditDiploma /></ProtectedRoute>} />
          <Route path="/admin/upload-notes" element={<ProtectedRoute><NotesUpload /></ProtectedRoute>} />
          <Route path="/admin/notes" element={<ProtectedRoute><NotesList /></ProtectedRoute>} />
        </Routes>
      </div>
      {!isAdminRoute && isSearchPage && <Footer />} {/* ✅ Footer sirf non-admin pages par */}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
