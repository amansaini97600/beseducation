import React from "react";

const ContactSection = () => {
  return (
    <section className="bg-white py-16 px-4 pt-30" id="contact">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-blue-700 mb-6">Contact Us</h2>
        <p className="text-gray-700 text-lg text-center mb-10">
          Visit or call us for course inquiries, admission details, or any questions!
        </p>

        <div className="flex flex-col md:flex-row gap-10 items-center">
          {/* Contact Info */}
          <div className="flex-1 space-y-4 text-lg text-gray-700">
            <p><strong>📍 Address:</strong> Near City Library, Main Road, Dhampur, UP</p>
            <p><strong>📞 Phone:</strong> +91 9876543210</p>
            <p><strong>📧 Email:</strong> cec.coaching@email.com</p>
            <p><strong>⏰ Timings:</strong> 9:00 AM – 6:00 PM (Mon–Sat)</p>
          </div>

          {/* Google Map */}
          <div className="flex-1 w-full h-72">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.503065827104!2d78.5055!3d29.3133!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390b4d9f5e8b9ab7%3A0xa8d5be7eb727228!2sDhampur%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1234567890"
              className="w-full h-full rounded-xl border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
