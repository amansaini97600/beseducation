import React, { useRef, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import aman from "../assets/teacherImage/aman.jpg";
import gulshan from "../assets/teacherImage/gulshan.jpg";

const facultyMembers = [
  {
    name: "Gulshan Jahan",
    role: "Tally & Accounting Expert",
    image: gulshan,
  },
  {
    name: "Parul Chauhan",
    role: "Software Expert",
    image: "/images/faculty2.jpg",
  },
  {
    name: "Aman Saini",
    role: "Web Development Trainer",
    image: aman,
  },
  {
    name: "Soni Rani",
    role: "Computer Instructor",
    image: "/images/faculty1.jpg",
  },
  {
    name: "Chhotu Rajput",
    role: "O'level Trainer",
    image: "/images/faculty1.jpg",
  },
];

// 👇 Duplicate list for infinite effect
const infiniteFacultyList = [...facultyMembers, ...facultyMembers];

const FacultySection = () => {
  const sliderRef = useRef(null);

  useEffect(() => {
    const scrollSpeed = 1;
    const slider = sliderRef.current;

    let scrollInterval = setInterval(() => {
      if (slider) {
        // scroll by 1px
        slider.scrollLeft += scrollSpeed;

        // when reaches end, reset to start
        if (slider.scrollLeft + slider.offsetWidth >= slider.scrollWidth) {
          slider.scrollLeft = 0;
        }
      }
    }, 30); // speed (lower = faster)

    return () => clearInterval(scrollInterval);
  }, []);

  const scroll = (direction) => {
    const scrollAmount = 300;
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="bg-gray-50 py-16 px-4 relative">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-blue-700 mb-6">Meet Our Faculty</h2>
        <p className="text-gray-700 text-lg mb-10">
          Experienced and dedicated instructors helping students grow every day.
        </p>

        {/* Scroll Buttons */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white shadow p-2 rounded-full z-10 hover:bg-blue-100"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white shadow p-2 rounded-full z-10 hover:bg-blue-100"
        >
          <FaChevronRight />
        </button>

        {/* Infinite Horizontal Scroll */}
        <div
          ref={sliderRef}
          className="flex overflow-x-auto space-x-6 px-2 scrollbar-hide"
          style={{ scrollBehavior: "auto", whiteSpace: "nowrap" }}
        >
          {infiniteFacultyList.map((faculty, i) => (
            <div
              key={i}
              className="min-w-[250px] inline-block bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-center"
            >
              <img
                src={faculty.image}
                alt={faculty.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-lg font-semibold text-gray-800">{faculty.name}</h3>
              <p className="text-sm text-gray-600">{faculty.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FacultySection;
