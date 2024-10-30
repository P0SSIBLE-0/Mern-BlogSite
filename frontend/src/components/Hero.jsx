import React from "react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <div className="relative flex items-center justify-center overflow-hidden">
      {/* Mesh Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `linear-gradient(rgb(255 255 255 / 0.2) 2px, transparent 2px),
              linear-gradient(90deg, rgb(255 255 255 / 0.2) 2px, transparent 2px)`,
            backgroundSize: '50px 50px',
            transform: 'perspective(500px) rotateX(60deg)',
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white">
            <span className="block mb-2">Share Your Story</span>
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              With The World
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
            Join our community of writers and thinkers. Create, share, and discover 
            stories that matter.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Link 
              to="/create-post"
              className="group relative px-8 py-4 text-lg font-semibold rounded-xl bg-white text-blue-900 hover:bg-blue-50 transition-all duration-200 overflow-hidden"
            >
              <span className="relative z-10">Start Writing Now</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-10 transition-opacity duration-200"/>
            </Link>
            <Link 
              to="/explore"
              className="px-8 py-4 text-lg font-semibold rounded-xl border-2 border-white text-white hover:bg-white/10 transition-all duration-200"
            >
              Explore Stories
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Floating Elements */}
      <div className="absolute top-1/4 left-4 w-24 h-24 bg-blue-400/20 rounded-full blur-xl"/>
      <div className="absolute bottom-1/4 right-4 w-32 h-32 bg-purple-400/20 rounded-full blur-xl"/>
    </div>
  );
}