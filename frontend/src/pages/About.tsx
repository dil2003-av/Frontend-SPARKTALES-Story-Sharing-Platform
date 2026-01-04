import { useState, useEffect } from "react";
import { 
  Sparkles, Users, PenLine, Globe, Target, Heart, Award, BookOpen, Zap, Shield 
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

export default function About() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeValue, setActiveValue] = useState(0);

  useEffect(() => {
    setIsVisible(true);

    const interval = setInterval(() => {
      setActiveValue((prev) => (prev + 1) % 3);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const team = [
    { role: "Writers", count: "10,000+", icon: PenLine },
    { role: "Stories", count: "50,000+", icon: BookOpen },
    { role: "Countries", count: "120+", icon: Globe },
    { role: "Daily Readers", count: "100,000+", icon: Users },
  ];

  const values = [
    {
      icon: Heart,
      title: "Creativity First",
      desc: "We empower writers to express their imagination freely without boundaries or limitations.",
    },
    {
      icon: Users,
      title: "Community Driven",
      desc: "We foster a supportive and encouraging environment where storytellers uplift each other.",
    },
    {
      icon: Shield,
      title: "Inclusivity Always",
      desc: "Every story and every voice matters to us, regardless of background or experience.",
    },
  ];

  const features = [
    {
      icon: PenLine,
      title: "Create Freely",
      desc: "Write without limits — fiction, poetry, blogs, anything you imagine.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Users,
      title: "Supportive Community",
      desc: "Connect with thousands of creators who love storytelling.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Globe,
      title: "Global Reach",
      desc: "Share your stories with readers from all over the world.",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Zap,
      title: "Easy Publishing",
      desc: "Simple, fast tools for writing and publishing.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Award,
      title: "Recognition",
      desc: "Get discovered through trending and spotlight features.",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: Target,
      title: "Growth Tools",
      desc: "Track your progress and understand your readers.",
      color: "from-pink-500 to-rose-500",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 pt-32 pb-24 px-6">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
        </div>

        <div
          className={`max-w-6xl mx-auto text-center relative z-10 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            About SparkTales
          </div>

          <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
            Where Stories Come <br />
            <span className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Alive
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A storytelling platform built for writers, dreamers, and creators. Our mission is simple — give every story a place to shine.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          {team.map((t, i) => (
            <div key={i} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-indigo-100 to-purple-100 rounded-2xl mb-4 group-hover:scale-110 transition">
                <t.icon className="w-8 h-8 text-indigo-600" />
              </div>
              <div className="text-4xl font-bold">{t.count}</div>
              <p className="text-gray-600">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

{/* Mission Section */}
      <section className="py-24 px-6 bg-linear-to-br from-gray-50 to-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                Our Mission
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
                Empowering Every Storyteller
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                SparkTales is built for storytellers. Whether you're publishing your first piece or your hundredth, our platform gives you the tools, visibility, and community you need to grow.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                We believe every voice matters. Every story deserves a home. That's why we've created a space where creativity flourishes and connections thrive.
              </p>
              
              <div className="flex flex-wrap gap-3 mb-8">
                <Link to="/create" className="inline-flex">
                  <button className="px-6 py-3 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow hover:shadow-lg transition-transform hover:scale-105">
                    Start Creating
                  </button>
                </Link>
                <Link to="/read" className="inline-flex">
                  <button className="px-6 py-3 rounded-xl border border-indigo-200 text-indigo-700 font-semibold hover:bg-indigo-50 transition">
                    Read Stories
                  </button>
                </Link>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl shadow-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-gray-700">Active Community</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl shadow-sm">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-medium text-gray-700">Award Winning</span>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2 relative h-96">
              <div className="absolute inset-0 bg-linear-to-br from-indigo-400 via-purple-400 to-pink-400 rounded-3xl transform rotate-3 opacity-20" />
              <div className="absolute inset-0 bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-black/10" />
                <Sparkles className="w-32 h-32 text-white relative z-10 animate-pulse" />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Writers Choose Us</h2>
            <p className="text-xl text-gray-600">Powerful features for every storyteller</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {features.map((f, i) => (
              <div
                key={i}
                className="group bg-white p-8 rounded-2xl border hover:shadow-2xl transition"
              >
                <div className={`w-14 h-14 rounded-xl mb-4 flex items-center justify-center bg-linear-to-br ${f.color}`}>
                  <f.icon className="text-white w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold">{f.title}</h3>
                <p className="text-gray-600 mt-2">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 bg-linear-to-b from-slate-900 to-gray-900 text-white">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
          <p className="text-gray-300 text-lg">Built with heart — guided by passion.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((v, i) => (
            <div
              key={i}
              className={`p-8 rounded-2xl bg-white/5 border transition ${
                activeValue === i ? "scale-105 bg-white/10 border-white/20" : ""
              }`}
            >
              <v.icon className={`w-12 h-12 mb-4 ${activeValue === i ? "text-indigo-400" : "text-gray-400"}`} />
              <h3 className="text-2xl font-bold mb-2">{v.title}</h3>
              <p className="text-gray-300">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-white text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Begin Your Journey?</h2>
        <p className="text-gray-600 text-lg mb-10">Join thousands of storytellers worldwide.</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/create" className="inline-flex">
            <button className="px-8 py-4 rounded-xl text-white font-semibold bg-linear-to-r from-indigo-600 to-purple-600 hover:scale-105 transition flex items-center gap-2">
              <PenLine className="w-5 h-5" /> Start Writing
            </button>
          </Link>

          <Link to="/read" className="inline-flex">
            <button className="px-8 py-4 bg-white text-pink-600 rounded-full hover:shadow-lg border-2 border-pink-600 transform hover:scale-105 transition font-semibold">
              Explore Stories
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-400" />
              <span className="text-xl font-bold">SparkTales</span>
            </div>
            <p className="text-gray-400">
              © {new Date().getFullYear()} SparkTales — Built for storytellers with ❤️
            </p>
            <div className="flex gap-6 text-gray-400">
              <span className="hover:text-white cursor-pointer transition">Privacy</span>
              <span className="hover:text-white cursor-pointer transition">Terms</span>
              <span className="hover:text-white cursor-pointer transition">Contact</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}
