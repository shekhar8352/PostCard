"use client";

import { SignIn } from "@clerk/nextjs";
import { MessageSquare, Users, TrendingUp, Search, Bell, UserCircle, Sparkles, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Page() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: MessageSquare,
      title: "Interactive Threads",
      description: "Create rich text posts, reply to others, and engage in deeply nested conversations.",
    },
    {
      icon: Users,
      title: "Communities",
      description: "Create and manage communities centered around specific interests or topics.",
    },
    {
      icon: TrendingUp,
      title: "Trending Tags",
      description: "Discover what's popular with real-time trending hashtags and filter posts by tags.",
    },
    {
      icon: Search,
      title: "Smart Search",
      description: "Easily find other users and communities with powerful search functionality.",
    },
    {
      icon: Bell,
      title: "Activity Feed",
      description: "Stay updated with real-time notifications for likes, replies, and mentions.",
    },
    {
      icon: UserCircle,
      title: "User Profiles",
      description: "Customize your profile, view your post history, and manage your account settings.",
    },
  ];

  const scrollToSignIn = () => {
    document.getElementById("sign-in-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-dark-1 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
        {/* Gradient Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }}></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: "2s" }}></div>
        </div>

        {/* Hero Content */}
        <div className={`relative z-10 max-w-5xl mx-auto text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          {/* Logo */}
          <div className="flex justify-center mb-8 animate-bounce" style={{ animationDuration: "3s" }}>
            <div className="relative w-24 h-24 md:w-32 md:h-32">
              <Image
                src="/assets/logo_new.svg"
                alt="Postcard Logo"
                width={128}
                height={128}
                className="w-full h-full"
              />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-light-1 mb-6 font-outfit">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">Postcard</span>
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl text-light-2 mb-4 max-w-3xl mx-auto">
            A modern, vibrant social media platform built for communities and conversations.
          </p>

          <p className="text-base md:text-lg text-light-3 mb-12 max-w-2xl mx-auto">
            Share your thoughts, join communities, and engage in meaningful conversations with people who share your interests.
          </p>

          <button
            onClick={scrollToSignIn}
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-light-1 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg hover:shadow-primary-500/50 transition-all duration-300 hover:scale-105"
          >
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-primary-500" />
              <span className="text-primary-500 font-semibold text-sm uppercase tracking-wider">Features</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-light-1 mb-4 font-outfit">
              Everything you need to connect
            </h2>
            <p className="text-light-3 text-lg max-w-2xl mx-auto">
              Powerful features designed to enhance your social experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-dark-2 border border-dark-4 rounded-2xl p-8 hover:border-primary-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary-500/10"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                  }}
                >
                  {/* Glassmorphic overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-7 h-7 text-light-1" />
                    </div>

                    <h3 className="text-xl font-bold text-light-1 mb-3 font-outfit">
                      {feature.title}
                    </h3>

                    <p className="text-light-3 text-base leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Community Highlights Section */}
      <section className="relative py-20 px-6 bg-dark-2/50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-light-1 mb-6 font-outfit">
            Join a thriving community
          </h2>
          <p className="text-light-3 text-lg mb-12 max-w-2xl mx-auto">
            Connect with thousands of users sharing ideas, creating communities, and building meaningful relationships.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-dark-3 border border-dark-4 rounded-2xl p-8 hover:border-primary-500/50 transition-all duration-300">
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500 mb-2 font-outfit">
                10K+
              </div>
              <div className="text-light-2 font-semibold mb-1">Active Users</div>
              <div className="text-light-4 text-sm">Sharing daily</div>
            </div>

            <div className="bg-dark-3 border border-dark-4 rounded-2xl p-8 hover:border-primary-500/50 transition-all duration-300">
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500 mb-2 font-outfit">
                500+
              </div>
              <div className="text-light-2 font-semibold mb-1">Communities</div>
              <div className="text-light-4 text-sm">And growing</div>
            </div>

            <div className="bg-dark-3 border border-dark-4 rounded-2xl p-8 hover:border-primary-500/50 transition-all duration-300">
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500 mb-2 font-outfit">
                100K+
              </div>
              <div className="text-light-2 font-semibold mb-1">Posts Created</div>
              <div className="text-light-4 text-sm">Every month</div>
            </div>
          </div>
        </div>
      </section>

      {/* Sign In Section */}
      <section id="sign-in-section" className="relative py-20 px-6 min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        </div>

        <div className="relative z-10 w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-light-1 mb-4 font-outfit">
              Ready to get started?
            </h2>
            <p className="text-light-3 text-lg">
              Sign in to join the conversation
            </p>
          </div>

          <div className="bg-dark-2/80 backdrop-blur-xl border border-dark-4 rounded-3xl p-8 shadow-2xl">
            <SignIn />
          </div>
        </div>
      </section>

      {/* Add keyframes for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
