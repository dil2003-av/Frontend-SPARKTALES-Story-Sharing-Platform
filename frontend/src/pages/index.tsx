import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, BookOpen, Heart, Users, PenTool, TrendingUp } from "lucide-react";

const Index = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-white/80 backdrop-blur-lg shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
                 <div className="flex justify-center mb-4">
              <img src="/images/s-logo.png" alt="decor" className="w-14 h-auto opacity-95" />
            </div>
            <Sparkles className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              SparkTales
            </span>

          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="px-5 py-2 text-gray-700 font-medium hover:text-purple-600 transition"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Sign Up Free
            </Link>
            
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
              ✨ Where Creativity Meets Community
            </div>
            <h1 className="text-6xl font-bold leading-tight">
              Share Your{" "}
              <span className="bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Stories
              </span>
              <br />
              Inspire the World
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Join thousands of writers, poets, and creators sharing their passion. 
              Write, read, and connect with a vibrant community of storytellers.
            </p>
            <div className="flex gap-4">
              <button className="px-8 py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2">
                <PenTool className="w-5 h-5" />
                Start Writing
              </button>
              <button className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-full border-2 border-purple-200 hover:border-purple-400 hover:shadow-lg transition-all duration-300 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Explore Stories
              </button>
            </div>
            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-gray-800">50K+</div>
                <div className="text-sm text-gray-600">Active Writers</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div>
                <div className="text-3xl font-bold text-gray-800">1M+</div>
                <div className="text-sm text-gray-600">Stories Shared</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div>
                <div className="text-3xl font-bold text-gray-800">10M+</div>
                <div className="text-sm text-gray-600">Reads Monthly</div>
              </div>
            </div>
          </div>

          {/* Hero Image / Illustration */}
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-r from-purple-400 to-pink-400 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
            <img
              src="/images/hero-illustration.svg"
              alt="Story Illustration"
              className="relative rounded-3xl shadow-2xl w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Create</h2>
            <p className="text-xl text-gray-600">Powerful tools for writers, by writers</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature Cards */}
            <FeatureCard
              icon={<PenTool className="w-8 h-8 text-white" />}
              title="Write Freely"
              description="Beautiful editor with rich formatting, auto-save, and distraction-free writing mode. Focus on your creativity."
              bgGradient="from-purple-500 to-pink-500"
            />
            <FeatureCard
              icon={<BookOpen className="w-8 h-8 text-white" />}
              title="Discover Stories"
              description="Explore curated collections, trending tales, and personalized recommendations based on your interests."
              bgGradient="from-pink-500 to-orange-500"
            />
            <FeatureCard
              icon={<Users className="w-8 h-8 text-white" />}
              title="Build Community"
              description="Connect with readers and writers, receive feedback, and grow your audience with engaged followers."
              bgGradient="from-indigo-500 to-purple-500"
            />
            <FeatureCard
              icon={<Heart className="w-8 h-8 text-white" />}
              title="Engage & Support"
              description="Like, comment, and share your favorite stories. Show appreciation and build meaningful connections."
              bgGradient="from-orange-500 to-red-500"
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8 text-white" />}
              title="Track Progress"
              description="Monitor your views, engagement, and follower growth. See what resonates with your audience."
              bgGradient="from-teal-500 to-cyan-500"
            />
            <FeatureCard
              icon={<Sparkles className="w-8 h-8 text-white" />}
              title="Get Featured"
              description="High-quality content gets featured on our homepage and newsletters, reaching thousands of readers."
              bgGradient="from-violet-500 to-purple-500"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-linear-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white shadow-2xl">
            <h2 className="text-4xl font-bold mb-4">Ready to Share Your Story?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join our community of passionate writers and readers today. It's free forever.
            </p>
            <button className="px-10 py-4 bg-white text-purple-600 font-bold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300">
              Get Started Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6" />
            <span className="text-xl font-bold">SparkTales</span>
          </div>
          <p className="text-gray-400 mb-8">Where creativity meets community</p>
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} SparkTales. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

// FeatureCard Component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgGradient: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, bgGradient }) => (
  <div className={`group p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-linear-to-br ${bgGradient}`}>
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform bg-opacity-80 bg-black/20">
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

export default Index;
