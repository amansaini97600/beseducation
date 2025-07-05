import pythonImg from "../assets/images/python.webp";
// import computerCourse from "../assets/images/computerCourse.jpg";
import cLanguage from "../assets/images/c.webp";
import cppLanguage from "../assets/images/cpp.webp";
import tally from "../assets/images/tally.png";
import ccc from "../assets/images/ccc.png";
import java from "../assets/images/java.webp";
import js from "../assets/images/js.webp";
import excel from "../assets/images/excel.webp";
import html from "../assets/images/html.webp";
import msWordImg from "../assets/images/msWord.jpg";
import powerP from "../assets/images/powerP.png";

import React from "react";

export default function Courses() {

  const courses = [
    {
      title: "MS Excel",
      description: "Learn spreadsheet skills for accounting, data entry, and automation using formulas and charts.",
      icon: excel,
    },
    {
      title: "Tally Prime",
      description: "Master accounting basics, GST, and business reports using Tally software.",
      icon: tally,
    },
    {
      title: "MS Word",
      description: "Create professional documents, letters, resumes, and formatted reports.",
      icon: msWordImg,
    },
    {
      title: "HTML & CSS",
      description: "Start your web development journey with the fundamentals of HTML & CSS.",
      icon: html,
    },
    {
      title: "PowerPoint",
      description: "Build attractive presentations with animations and smart design tools.",
      icon: powerP,
    },
    {
      title: "JavaScript (Basic)",
      description: "Understand the logic behind web interactivity and simple browser scripting.",
      icon: js,
    },
  ];

  return (
    <section className="bg-gray-50 py-16 px-4 pt-30">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-blue-700 mb-6">Courses Offered</h2>
        <p className="text-gray-700 text-lg mb-10">
          We offer career-oriented computer courses designed for jobs in offices, coaching centers, and the digital world.
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-left"
            >
              <img
                src={course.icon}
                alt={course.title}
                className="w-16 h-16 object-contain mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{course.title}</h3>
              <p className="text-gray-600">{course.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

}
