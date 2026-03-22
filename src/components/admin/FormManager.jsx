import { useState, useEffect } from 'react';

const FormManager = () => {
  const [forms, setForms] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    fetchForms();
    fetchTestimonials();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/forms');
      const data = await response.json();
      setForms(data);
    } catch (error) {
      console.error('Failed to fetch forms:', error);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/forms/testimonials');
      const data = await response.json();
      setTestimonials(data);
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
    }
  };

  const handleDeleteForm = async (id) => {
    try {
      await fetch(`http://localhost:3001/api/forms/${id}`, { method: 'DELETE' });
      fetchForms();
    } catch (error) {
      alert('Failed to delete form');
    }
  };

  const handlePromoteToTestimonial = async (id) => {
    try {
      await fetch(`http://localhost:3001/api/forms/${id}/promote`, { method: 'POST' });
      fetchForms();
      fetchTestimonials();
      alert('Form promoted to testimonial!');
    } catch (error) {
      alert('Failed to promote form');
    }
  };

  const handleDeleteTestimonial = async (index) => {
    if (!confirm('Delete this testimonial?')) return;

    try {
      await fetch(`http://localhost:3001/api/forms/testimonials/${index}`, { method: 'DELETE' });
      fetchTestimonials();
    } catch (error) {
      alert('Failed to delete testimonial');
    }
  };

  return (
    <div className="space-y-8">
      {/* Submitted Forms */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">Submitted Forms</h2>
        <div className="space-y-3">
          {forms.map((form) => (
            <div
              key={form.id}
              className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="inline-block px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded mb-2">
                    {form.type}
                  </span>
                  <p className="font-medium text-zinc-200">{form.steamName}</p>
                  <p className="text-xs text-zinc-600">
                    {new Date(form.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePromoteToTestimonial(form.id)}
                    className="px-3 py-1.5 bg-lime-900/20 hover:bg-lime-900/30 border border-lime-800 text-lime-400 rounded-lg transition-colors text-xs"
                  >
                    Promote
                  </button>
                  <button
                    onClick={() => handleDeleteForm(form.id)}
                    className="px-3 py-1.5 bg-red-900/20 hover:bg-red-900/30 border border-red-800 text-red-400 rounded-lg transition-colors text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-sm text-zinc-400">{form.message}</p>
            </div>
          ))}
          {forms.length === 0 && (
            <div className="text-center text-zinc-500 py-12 bg-zinc-900/40 border border-zinc-800/60 rounded-xl">
              No forms submitted yet
            </div>
          )}
        </div>
      </div>

      {/* Current Testimonials */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">Current Testimonials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-4"
            >
              <p className="text-sm text-zinc-400 mb-3">"{testimonial.quote}"</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-medium text-zinc-400">
                    {testimonial.initial}
                  </div>
                  <span className="text-xs text-zinc-300">{testimonial.author}</span>
                </div>
                <button
                  onClick={() => handleDeleteTestimonial(index)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormManager;
