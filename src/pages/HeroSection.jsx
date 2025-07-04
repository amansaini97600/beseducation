import React from "react";

export default function Home() {
  return (
    <section className="w-full bg-gradient-to-br from-blue-50 to-blue-100 py-16 px-4 pt-50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left Content */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl font-bold text-blue-800 mb-4 leading-tight">
            Welcome to{" "}
            <span className="text-blue-600">CEC Computer Center</span>
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Learn Excel, Tally, MS Office, HTML, CSS, and more with expert
            guidance.
          </p>
          <a
            href="/notes"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full shadow hover:bg-blue-700 transition"
          >
            📚 Explore Notes
          </a>
        </div>

        {/* Right Image */}
        <div className="flex-1 flex justify-center">
          <img
            src="/images/logo.png" // <== Replace this image later
            alt="CEC Computer Center"
            className="w-64 h-64 object-contain drop-shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
