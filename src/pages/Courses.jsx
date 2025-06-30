import CourseCard from "../components/CourseCard";
import pythonImg from "../assets/images/python.jpg";
import computerCourse from "../assets/images/computerCourse.jpg";
import cLanguage from "../assets/images/cLanguage.jpg";
import cppLanguage from "../assets/images/cpp.webp";
import tally from "../assets/images/tally.png";
import ccc from "../assets/images/ccc.png";
import java from "../assets/images/java.jpg";


export default function Courses() {
  const courses = [
    {
      title: "Basic Computer",
      description: "Learn MS Office, Internet, Email, Typing and more.",
      image: computerCourse,
    },
    {
      title: "Tally + GST",
      description: "Master accounting software with GST billing.",
      image: tally,
    },
    {
      title: "CCC",
      description: "Government certified course for computer fundamentals.",
      image: ccc,
    },
    {
      title: "Python Programming",
      description: "Learn Python from scratch with practical examples.",
      image: pythonImg,
    },
    {
      title: "C Programming",
      description: "Learn Python from scratch with practical examples.",
      image: cLanguage,
    },
    {
      title: "C++ Programming",
      description: "Learn Python from scratch with practical examples.",
      image: cppLanguage,
    },
    {
      title: "Java Programming",
      description: "Learn Python from scratch with practical examples.",
      image: java,
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">Our Courses</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course, index) => (
          <CourseCard
            key={index}
            title={course.title}
            description={course.description}
            image={course.image}
          />
        ))}
      </div>
    </div>
  );
}
