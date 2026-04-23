import React, { useState } from "react";
import { Send } from "lucide-react";
import Swal from "sweetalert2";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("idle");

  const handleChange = (e) => {
    setStatus("idle");
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!import.meta.env.VITE_WEB3FORMS_KEY) {
      Swal.fire({
        title: "Error!",
        text: "Configuration error. Please try again later.",
        icon: "error",
      });
      return;
    }

    setStatus("loading");

    try {
      const payload = {
        access_key: import.meta.env.VITE_WEB3FORMS_KEY,
        name: formData.name,
        email: formData.email,
        message: formData.message,
        subject: "New message from Portfolio Website",
      };

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Message sending failed");
      }

      // ✅ Success Alert
      Swal.fire({
        title: "Success!",
        text: "Message sent successfully!",
        icon: "success",
      });

      setFormData({ name: "", email: "", message: "" });
      setStatus("idle");

    } catch (error) {
      console.error(error);

      // ❌ Error Alert
      Swal.fire({
        title: "Error!",
        text: "Failed to send message. Please try again.",
        icon: "error",
      });

      setStatus("idle");
    }
  };

  return (
    <section
      id="contact"
      className="scroll-mt-32 py-16 sm:py-20 bg-slate-50 dark:bg-slate-950"
    >
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
          Get In Touch
        </h2>

        <p className="text-slate-600 dark:text-slate-400 mb-10">
          Have a project in mind? Let&apos;s connect.
        </p>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg p-6 sm:p-8 text-left">
          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="block text-sm font-medium mb-2 dark:text-white">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 dark:text-white">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 dark:text-white">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {status === "loading" ? "Sending..." : "Send Message"}
              <Send className="w-5 h-5" />
            </button>

          </form>
        </div>
      </div>
    </section>
  );
}