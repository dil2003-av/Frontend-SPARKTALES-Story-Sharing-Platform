import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe, Twitter, Facebook, Instagram, Linkedin, CheckCircle } from "lucide-react";
import Header from "../components/Header";

export default function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setForm({ name: "", email: "", subject: "", message: "" });
      setIsSubmitted(false);
    }, 3000);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      info: "support@sparktales.com",
      subInfo: "We'll respond within 24 hours",
      color: "from-blue-500 to-cyan-500",
      action: "mailto:support@sparktales.com"
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      info: "Available 24/7",
      subInfo: "Average response: 5 minutes",
      color: "from-green-500 to-emerald-500",
      action: "#"
    },
    {
      icon: Phone,
      title: "Call Us",
      info: "+1 (555) 123-4567",
      subInfo: "Mon-Fri, 9AM - 6PM EST",
      color: "from-purple-500 to-pink-500",
      action: "tel:+15551234567"
    }
  ];

  const officeInfo = [
    {
      icon: MapPin,
      title: "Main Office",
      address: "123 Innovation Drive",
      city: "San Francisco, CA 94105"
    },
    {
      icon: Clock,
      title: "Business Hours",
      address: "Monday - Friday: 9AM - 6PM",
      city: "Weekend: 10AM - 4PM EST"
    },
    {
      icon: Globe,
      title: "Global Reach",
      address: "Serving writers worldwide",
      city: "120+ countries supported"
    }
  ];

  const faqs = [
    { q: "How do I start publishing?", a: "Sign up for free and start writing immediately!" },
    { q: "Is SparkTales free to use?", a: "Yes! Basic features are completely free forever." },
    { q: "Can I monetize my stories?", a: "Premium members can enable reader donations and tips." }
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-white via-gray-50 to-white">
      <Header />
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-block mb-6">
            <span className="bg-linear-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
              We're Here to Help
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 text-gray-900">
            Let's Start a <br />
            <span className="relative">
              <span className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Conversation
              </span>
              <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 300 12" fill="none">
                <path d="M2 10C50 2, 100 2, 150 6C200 10, 250 10, 298 6" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round" fill="none"/>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Whether you have a question, feedback, or just want to say hello, we'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {contactMethods.map((method, idx) => (
              <a
                key={idx}
                href={method.action}
                className={`group relative p-8 bg-white rounded-3xl border-2 transition-all duration-300 overflow-hidden ${
                  activeCard === idx 
                    ? 'border-indigo-300 shadow-2xl scale-105' 
                    : 'border-gray-200 shadow-lg hover:border-indigo-200 hover:shadow-xl'
                }`}
              >
                <div className={`absolute inset-0 bg-linear-to-br ${method.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-linear-to-br ${method.color} rounded-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <method.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-lg text-gray-700 font-semibold mb-1">{method.info}</p>
                <p className="text-sm text-gray-500">{method.subInfo}</p>
                <div className="absolute top-4 right-4 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Send className="w-5 h-5" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content: Form + Info */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Form - Takes 3 columns */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-linear-to-r from-indigo-600 to-purple-600 p-8 text-white">
                  <h2 className="text-3xl font-bold mb-2">Send us a Message</h2>
                  <p className="text-indigo-100">Fill out the form below and we'll get back to you shortly</p>
                </div>

                {isSubmitted ? (
                  <div className="p-12 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                      <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-600">Thank you for reaching out. We'll respond within 24 hours.</p>
                  </div>
                ) : (
                  <div className="p-8 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          placeholder="John Doe"
                          value={form.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          placeholder="john@example.com"
                          value={form.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Subject *
                      </label>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                      >
                        <option value="">Select a topic</option>
                        <option value="general">General Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="feedback">Feedback</option>
                        <option value="partnership">Partnership</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        placeholder="Tell us how we can help you..."
                        value={form.message}
                        onChange={handleChange}
                        rows={6}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition resize-none"
                      />
                    </div>

                    <button
                      onClick={handleSubmit}
                      className="w-full px-8 py-4 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      Send Message
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Info - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Office Info Cards */}
              {officeInfo.map((info, idx) => (
                <div key={idx} className="bg-linear-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <info.icon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">{info.title}</h4>
                      <p className="text-gray-600 text-sm">{info.address}</p>
                      <p className="text-gray-500 text-sm">{info.city}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Social Media */}
              <div className="bg-linear-to-br from-indigo-600 to-purple-600 p-6 rounded-2xl text-white shadow-lg">
                <h4 className="font-bold text-lg mb-4">Follow Us</h4>
                <div className="grid grid-cols-4 gap-3">
                  {[Twitter, Facebook, Instagram, Linkedin].map((Icon, idx) => (
                    <button
                      key={idx}
                      className="w-full aspect-square bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110"
                    >
                      <Icon className="w-6 h-6" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick FAQs */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-4">Quick Answers</h4>
                <div className="space-y-3">
                  {faqs.map((faq, idx) => (
                    <details key={idx} className="group">
                      <summary className="cursor-pointer text-sm font-semibold text-gray-700 hover:text-indigo-600 transition list-none flex items-center justify-between">
                        {faq.q}
                        <span className="text-indigo-600 group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <p className="mt-2 text-sm text-gray-600 pl-4 border-l-2 border-indigo-200">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

{/* Map Section */}
<section className="py-12 px-6">
  <div className="max-w-6xl mx-auto">
    <div className="rounded-3xl overflow-hidden shadow-lg h-96">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019066617982!2d-122.08563248468165!3d37.42206577982513!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb24c0b5d5555%3A0xe3b934b6c7cf7bcb!2sGoogleplex!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
        className="w-full h-full border-0"
        allowFullScreen={true}
        loading="lazy"
        title="Our Location"
      ></iframe>
    </div>
  </div>
</section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-white mt-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-indigo-400" />
              <span className="text-xl font-bold">SparkTales</span>
            </div>
            <p className="text-gray-400">
              © {new Date().getFullYear()} SparkTales — We'd love to hear from you
            </p>
            <div className="flex gap-6 text-gray-400">
              <span className="hover:text-white cursor-pointer transition">Privacy</span>
              <span className="hover:text-white cursor-pointer transition">Terms</span>
              <span className="hover:text-white cursor-pointer transition">Help Center</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}