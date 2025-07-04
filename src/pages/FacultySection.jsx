import React from "react";

const facultyMembers = [
  {
    name: "Aman Saini",
    role: "Computer Instructor",
    image: "/images/faculty1.jpg",
  },
  {
    name: "Rohit Verma",
    role: "Tally & Accounting Expert",
    image: "/images/faculty2.jpg",
  },
  {
    name: "Neha Sharma",
    role: "Web Development Trainer",
    image: "/images/faculty3.jpg",
  },
];

const FacultySection = () => {
  return (
    <section className="bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-blue-700 mb-6">Meet Our Faculty</h2>
        <p className="text-gray-700 text-lg mb-10">
          Experienced and dedicated instructors helping students grow every day.
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {facultyMembers.map((faculty, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-center"
            >
              <img
                src={faculty.image}
                alt={faculty.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-800">{faculty.name}</h3>
              <p className="text-gray-600">{faculty.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FacultySection;
