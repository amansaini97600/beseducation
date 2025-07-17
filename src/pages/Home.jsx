import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import CoursesSection from "./CoursesSection";
import GallerySection from "./GallerySection";
import FacultySection from "./FacultySection";
import ContactSection from "./ContactSection";
import { Helmet } from "react-helmet";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Home | CEC Computer Centre Dhampur</title>
        <meta name="description" content="Enroll in computer courses at CEC Computer Centre Dhampur — the best place for C, C++, DCA, Python, Java, and more." />
        <meta name="keywords" content="Coaching, Computer Courses, Dhampur, ADCA, DCA, CCC" />
        <link rel="canonical" href="https://yourdomain.com/" />
      </Helmet>
      <HeroSection />
      <AboutSection />
      <CoursesSection />
      <GallerySection />
      <FacultySection />
      <ContactSection />
    </>
  );
};

export default Home;
