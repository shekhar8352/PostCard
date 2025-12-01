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
      title: "Interactive Cards",
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

  return (
    <div className="min-h-screen bg-dark-1 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between min-h-screen px-6 pb-12 pt-24 lg:px-12 lg:pt-40 gap-12">
        {/* Left Side - Hero and Features */}
        <div className="flex-1 max-w-3xl w-full order-1">
          {/* Hero Section */}
          <div className={`transition-all duration-1000 mb-16 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
              {/* Logo */}
              <div className="flex-shrink-0 animate-bounce" style={{ animationDuration: "3s" }}>
                <div className="relative w-20 h-20 md:w-24 md:h-24">
                  <Image
                    src="/assets/logo_new.svg"
                    alt="Postcard Logo"
                    width={96}
                    height={96}
                    className="w-full h-full"
                  />
                </div>
              </div>

              {/* Text Content */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-light-1 mb-6 font-outfit text-center lg:text-left">
                  Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">Postcard</span>
                </h1>

                <p className="text-lg md:text-xl text-light-2 mb-4 text-center lg:text-left">
                  A modern, vibrant social media platform built for communities and conversations.
                </p>

                <p className="text-base md:text-lg text-light-3 text-center lg:text-left">
                  Share your thoughts, join communities, and engage in meaningful conversations with people who share your interests.
                </p>
              </div>
            </div>
          </div>

          {/* Features Section - Order 3 on mobile */}
          <div className="order-3 lg:order-none">
            <div className="text-center lg:text-left mb-8">
              <div className="inline-flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-primary-500" />
                <span className="text-primary-500 font-semibold text-sm uppercase tracking-wider">Features</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-light-1 mb-3 font-outfit">
                Everything you need to connect
              </h2>
              <p className="text-light-3 text-base">
                Powerful features designed to enhance your social experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="group relative bg-dark-2 border border-dark-4 rounded-xl p-5 hover:border-primary-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary-500/10"
                    style={{
                      animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                    }}
                  >
                    {/* Glassmorphic overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="relative z-10">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-5 h-5 text-light-1" />
                      </div>

                      <h3 className="text-base font-bold text-light-1 mb-2 font-outfit">
                        {feature.title}
                      </h3>

                      <p className="text-light-3 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side - Sign In Modal - Order 2 on mobile */}
        <div className="w-full lg:w-auto lg:flex-shrink-0 order-2">
          <div className="w-full lg:w-[420px]">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-light-1 mb-3 font-outfit">
                Ready to get started?
              </h2>
              <p className="text-light-3 text-base">
                Sign in to join the conversation
              </p>
            </div>

            <div className="bg-dark-2/80 backdrop-blur-xl border border-dark-4 rounded-3xl p-6 shadow-2xl">
              <SignIn />
            </div>
          </div>
        </div>
      </div>

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
