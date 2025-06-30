import { useState, useEffect } from "react";

export default function EditStudentModal({ isOpen, onClose, student, onSave }) {
  const [formData, setFormData] = useState({ ...student });

  useEffect(() => {
    if (student) {
      setFormData({ ...student });
    }
  }, [student]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-lg shadow">
        <h2 className="text-xl font-bold mb-4">Edit Student</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" value={formData.name || ""} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Name" />
          <input name="father_name" value={formData.father_name || ""} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Father's Name" />
          <input name="phone" value={formData.phone || ""} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Phone" />
          <input name="course" value={formData.course || ""} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Course" />
          <input type="date" name="joined_date" value={formData.joined_date || ""} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Joined Date" />
          <input name="address" value={formData.address || ""} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Address" />
          <input name="aadhar" value={formData.aadhar || ""} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Aadhar No" />

          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
