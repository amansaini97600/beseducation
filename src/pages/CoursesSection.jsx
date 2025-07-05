import cIcon from "../assets/images/c.webp";
import basicIcon from "../assets/images/basicComputer.jpeg";
import cppIcon from "../assets/images/cpp.webp";
import tally from "../assets/images/tally.png";
import cccIcon from "../assets/images/ccc.jpg";
import javaIcon from "../assets/images/java.webp";
import phpIcon from "../assets/images/php.webp";
import cssIcon from "../assets/images/css.webp";
import js from "../assets/images/js.webp";
import excel from "../assets/images/excel.jpeg";
import html from "../assets/images/html.webp";
import msWordImg from "../assets/images/word.png";
import powerP from "../assets/images/powerPoint.png";
import corelDrawIcon from "../assets/images/corel.jpeg";
import typingIcon from "../assets/images/typing.png";
import libreOfficeIcon from "../assets/images/libreOffice.jpeg";
import adcaIcon from "../assets/images/adca.png";
import dcaIcon from "../assets/images/dca.jpeg";
import oLevelIcon from "../assets/images/oLevel.jpeg";
import pythonIcon from "../assets/images/python.webp";
import webDesignIcon from "../assets/images/webD.jpeg";
import softwareDevIcon from "../assets/images/software.jpeg";

import React from "react";

export default function Courses() {

  const courses = [
    {
      title: "Basic Computer Course",
      description: "Ideal for beginners – covers Windows, MS Office, Internet, typing, printing, and file management.",
      icon: basicIcon,
    },
    {
      title: "Tally Prime",
      description: "Master accounting basics, GST, and business reports using Tally software.",
      icon: tally,
    },
    {
      title: "ADCA (Advanced Diploma in Computer Applications)",
      description: "A complete 1-year computer course covering office, accounting, web design, and basic programming.",
      icon: adcaIcon,
    },
    {
      title: "DCA (Diploma in Computer Applications)",
      description: "A 6-month course to learn MS Office, internet basics, and entry-level programming.",
      icon: dcaIcon,
    },
    {
      title: "MS Advance Excel",
      description: "Learn spreadsheet skills for accounting, data entry, and automation using formulas and charts.",
      icon: excel,
    },
    {
      title: "MS Word",
      description: "Create professional documents, letters, resumes, and formatted reports.",
      icon: msWordImg,
    },
    {
      title: "PowerPoint",
      description: "Build attractive presentations with animations and smart design tools.",
      icon: powerP,
    },
    {
      title: "CCC Course",
      description: "Essential computer course for government exams and jobs, covering MS Office, email, internet, and more.",
      icon: cccIcon,
    },
    {
      title: "O Level",
      description: "NIELIT-certified course covering computer fundamentals, IT tools, internet, Python, and more – important for central/state govt jobs.",
      icon: oLevelIcon,
    },
    {
      title: "Typing (Hindi & English)",
      description: "Learn touch typing in both Hindi and English for speed and accuracy—useful for clerical and data entry jobs.",
      icon: typingIcon,
    },
    {
      title: "CorelDRAW",
      description: "Professional graphic design tool to create logos, banners, posters, and visual documents.",
      icon: corelDrawIcon,
    },
    {
      title: "LibreOffice",
      description: "Free and open-source MS Office alternative used in government and school systems.",
      icon: libreOfficeIcon,
    },
    {
      title: "HTML & CSS",
      description: "Start your web development journey with the fundamentals of HTML & CSS.",
      icon: html,
    },
    {
      title: "CSS",
      description: "Master styling and layout techniques to make your web pages visually appealing and responsive.",
      icon: cssIcon,
    },
    {
      title: "JavaScript (Basic)",
      description: "Understand the logic behind web interactivity and simple browser scripting.",
      icon: js,
    },
    {
      title: "PHP",
      description: "Understand how to build dynamic and database-driven websites using PHP with MySQL.",
      icon: phpIcon,
    },
    {
      title: "Web Designing",
      description: "Learn how to design beautiful, user-friendly websites using HTML, CSS, Bootstrap, and design tools.",
      icon: webDesignIcon,
    },
    {
      title: "C Programming",
      description: "Learn the foundational language of programming – ideal for building logic and understanding how computers work.",
      icon: cIcon,
    },
    {
      title: "C++ Programming",
      description: "Master object-oriented programming and develop applications with better structure and scalability.",
      icon: cppIcon,
    },
    {
      title: "Java",
      description: "Learn to build cross-platform applications and backend systems using Java, one of the most in-demand languages.",
      icon: javaIcon,
    },
    {
      title: "Python",
      description: "Beginner-friendly, powerful language used in data science, automation, AI, and web development.",
      icon: pythonIcon,
    },
    {
      title: "Software Developer",
      description: "Learn to develop complete software solutions using frontend, backend, database, and deployment tools.",
      icon: softwareDevIcon,
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
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-center"
            >
              <img
                src={course.icon}
                alt={course.title}
                className="w-35 h-35 mx-auto object-contain mb-4 rounded-full"
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
