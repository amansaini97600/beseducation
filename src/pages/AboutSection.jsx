import React from "react";
export default function About() {
  return (
    <section className="w-full bg-white py-16 px-4 pt-30">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-blue-700 mb-6">About CEC Computer Center</h2>
        <p className="text-gray-700 text-lg leading-relaxed mb-10">
          At <span className="font-semibold">CEC Computer Center</span>, we are committed to providing
          practical computer education to help students build real-world skills. Our mission is to empower youth with
          essential computer knowledge and software training including <strong>MS Office, Excel, Tally, HTML, CSS, JavaScript</strong>, and more.
        </p>

        <div className="grid md:grid-cols-2 gap-8 text-left">
          <div className="flex gap-4">
            <div className="text-blue-600 text-3xl">🖥️</div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-1">Practical Learning</h3>
              <p className="text-gray-600">
                We focus on hands-on training so every student can confidently use the software in real-world jobs.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="text-blue-600 text-3xl">🎯</div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-1">Career-Oriented Courses</h3>
              <p className="text-gray-600">
                Our courses are designed to prepare students for job roles in offices, coaching centers, and digital platforms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


