import { useState, useEffect } from "react";
import {
  Sparkles,
  BookOpen,
  Users,
  TrendingUp,
  Heart,
  MessageCircle,
  Eye,
  Plus
} from "lucide-react";

import { Link } from "react-router-dom";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: BookOpen,
      title: "Write Your Story",
      desc: "Create and share your unique tales with the world"
    },
    {
      icon: Users,
      title: "Connect with Readers",
      desc: "Build a community around your creative works"
    },
    {
      icon: TrendingUp,
      title: "Grow Your Audience",
      desc: "Track engagement and reach more people"
    }
  ];

  const stats = [
    { label: "Active Writers", value: "10K+", icon: Users },
    { label: "Stories Published", value: "50K+", icon: BookOpen },
    { label: "Monthly Readers", value: "100K+", icon: Eye }
  ];

  const storyImages = [
    "images/s-home1.png",
    "images/s-home2.png",
    "images/s-home3.png",
    "images/s-home4.png",
    "images/s-home5.png",
    "images/s-home6.png"
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-purple-50 to-pink-100">

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
            backgroundImage: "radial-gradient(circle, #d946ef 1px, transparent 1px)",
            backgroundSize: "45px 45px"
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-6">
              Every Story{" "}
              <span className="bg-linear-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Deserves to Shine ✨
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
              Join thousands of storytellers shaping the future of creative writing.
            </p>

            <div className="flex gap-4 justify-center">
              
              <Link to="/create" className="inline-flex">
                <button className="px-8 py-4 bg-linear-to-r from-pink-600 to-purple-600 text-white rounded-full hover:shadow-2xl transform hover:scale-105 transition font-semibold flex items-center gap-2">
                  <Plus className="w-5 h-5" /> Start Writing
                </button>
              </Link>

              <Link to="/read" className="inline-flex">
                <button className="px-8 py-4 bg-white text-pink-600 rounded-full hover:shadow-lg border-2 border-pink-600 transform hover:scale-105 transition font-semibold">
                  Explore Stories
                </button>
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            {features.map((f, idx) => (
              <div
                key={idx}
                className={`p-6 bg-white rounded-2xl shadow-lg transition-all duration-500 ${
                  activeFeature === idx ? "scale-105 shadow-2xl" : "scale-100"
                }`}
              >
                <f.icon
                  className={`w-12 h-12 mb-4 transition-colors ${
                    activeFeature === idx ? "text-pink-600" : "text-gray-400"
                  }`}
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      

      {/* Stats Section */}
      <section className="py-16 bg-linear-to-r from-pink-500 to-purple-600">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            {stats.map((stat, idx) => (
              <div key={idx} className="transform hover:scale-110 transition">
                <stat.icon className="w-12 h-12 mx-auto mb-4 opacity-80" />
                <div className="text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

       {/* About Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Your Stories, <span className="text-indigo-600">Your Community</span>
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                SparkTales is more than just a platform—it's a thriving community of writers, readers, and dreamers. 
                Whether you're crafting your first tale or you're a seasoned author, this is your space to shine.
              </p>
              <p className="text-gray-600 text-lg mb-8">
                Share your creativity, connect with like-minded individuals, and let your imagination run wild. 
                Every story has the power to inspire, and yours could be the next big spark.
              </p>
              <button className="px-8 py-4 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transform hover:scale-105 transition-all duration-300 font-semibold">
                Learn More About Us
              </button>
            </div>
            
            <div className="relative h-96">
              <div className="absolute inset-0 bg-linear-to-br from-indigo-200 via-purple-200 to-pink-200 rounded-3xl transform rotate-6" />
              <div className="absolute inset-0 bg-linear-to-br from-indigo-400 via-purple-400 to-pink-400 rounded-3xl flex items-center justify-center">
                <Sparkles className="w-32 h-32 text-white animate-pulse" />
              </div>
            </div>
          </div>
        </div>
        
      </section>


      {/* Trending Stories */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trending Stories
            </h2>
            <p className="text-gray-600 text-lg">
              Fresh reads picked by our community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {storyImages.map((img, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition"
              >
                <div
                  className="h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url(${img})` }}
                >
                  <div className="h-full w-full bg-black/30 group-hover:bg-black/10 transition"></div>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    This deeply immersive story takes you on an emotional journey
                    through imagination, love, loss, and rediscovery — crafted to
                    resonate with readers of every age.
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />234
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />45
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />1.2K
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-linear-to-r from-pink-600 to-purple-600 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Share Your Story?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of writers already inspiring readers every day.
            </p>

            <Link to="/create" className="inline-flex justify-center">
              <button className="px-8 py-4 bg-linear-to-r from-pink-600 to-purple-600 text-white rounded-full hover:shadow-2xl transform hover:scale-105 transition font-semibold flex items-center gap-2">
                <Plus className="w-5 h-5" /> Start Writing
              </button>
            </Link>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6" />
                <span className="text-xl font-bold">SparkTales</span>
              </div>
              <p className="text-gray-400">Share your story with the world</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <div className="space-y-2 text-gray-400">
                <div className="hover:text-white cursor-pointer">Write</div>
                <div className="hover:text-white cursor-pointer">Explore</div>
                <div className="hover:text-white cursor-pointer">Community</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-gray-400">
                <div className="hover:text-white cursor-pointer">About</div>
                <div className="hover:text-white cursor-pointer">Blog</div>
                <div className="hover:text-white cursor-pointer">Careers</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2 text-gray-400">
                <div className="hover:text-white cursor-pointer">Privacy</div>
                <div className="hover:text-white cursor-pointer">Terms</div>
                <div className="hover:text-white cursor-pointer">Guidelines</div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            © {new Date().getFullYear()} SparkTales — Share your story with the world ✨
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
