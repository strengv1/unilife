"use client"

import React, { useState } from 'react';
import { Lightbulb, Crosshair, BarChart3, Zap, Users, Music, Trophy, Trees } from "lucide-react";
import { NewsletterSection } from '@/components/newsletterSection';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface RevealCardProps extends CardProps {
  revealContent: React.ReactNode;
}

const RevealCard: React.FC<RevealCardProps> = ({ children, revealContent, className = "" }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div 
      className={`relative overflow-hidden bg-gray-50 rounded-lg cursor-pointer transition-all duration-500 hover:shadow-lg ${className}`}
      onMouseEnter={() => setIsRevealed(true)}
      onMouseLeave={() => setIsRevealed(false)}
    >
      <div className={`transition-transform duration-500 ${isRevealed ? 'transform -translate-y-full' : ''}`}>
        {children}
      </div>
      <div className={`absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 text-white transition-transform duration-500 ${isRevealed ? 'transform translate-y-0' : 'transform translate-y-full'}`}>
        {revealContent}
      </div>
    </div>
  );
};

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-amber-50">
      <Navbar />
      <main className="flex-1">
        <section className="py-16 lg:py-32">
          <div className="max-w-4xl mx-auto px-4">
            
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
                About UNI LIFE
              </h1>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                UNI LIFE creates unforgettable student events in Finland.
              </p>
            </div>

            {/* The Beginning */}
            <div className="mb-16">
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <div className="flex items-center mb-6">
                  <Lightbulb className="w-12 h-12 text-amber-500 mr-4" />
                  <h2 className="text-2xl font-bold text-gray-900">The Beginning</h2>
                </div>
                <p className="text-lg text-gray-700">
                  An idea born in 2021 from one student&apos;s frustration with boring parties, we&apos;re here to make university life vibrant, social, and full of adventure.
                </p>
              </div>
            </div>

            {/* Why We Exist */}
            <div className="mb-16">
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <div className="flex items-center mb-6">
                  <Crosshair className="w-12 h-12 text-red-500 mr-4" />
                  <h2 className="text-2xl font-bold text-gray-900">Why We Exist</h2>
                </div>
                <p className="text-lg text-gray-700 mb-4">
                  University can be the best time of your life. But too often, students feel <strong>isolated, invisible, and bored</strong>. We are here to change that.
                </p>
                <p className="text-lg text-gray-700">
                  We fight against the idea that your field of study defines your social life. Our events are engineered to break the cliques and forge real connections — across faculties, backgrounds, and even campuses.
                </p>
              </div>
            </div>

            {/* What We Do */}
            <div className="mb-16">
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <div className="flex items-center mb-6">
                  <BarChart3 className="w-12 h-12 text-green-500 mr-4" />
                  <h2 className="text-2xl font-bold text-gray-900">What We Do</h2>
                </div>
                <p className="text-lg text-gray-700 mb-6">
                  From parties and tournaments to hangouts and outdoor adventures — we organize events that <em>guarantee a good time</em>.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <RevealCard 
                    className="text-center p-4"
                    revealContent={
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <Music className="w-8 h-8 mx-auto mb-2" />
                          <span className="text-sm font-medium">Epic Parties</span>
                        </div>
                      </div>
                    }
                  >
                    <div className="text-center">
                      <Music className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                      <span className="text-sm font-medium text-gray-700">Parties</span>
                    </div>
                  </RevealCard>

                  <RevealCard 
                    className="text-center p-4"
                    revealContent={
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <Trophy className="w-8 h-8 mx-auto mb-2" />
                          <span className="text-sm font-medium">Win Big</span>
                        </div>
                      </div>
                    }
                  >
                    <div className="text-center">
                      <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-700">Tournaments</span>
                    </div>
                  </RevealCard>

                  <RevealCard 
                    className="text-center p-4"
                    revealContent={
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <Trees className="w-8 h-8 mx-auto mb-2" />
                          <span className="text-sm font-medium">Wild Fun</span>
                        </div>
                      </div>
                    }
                  >
                    <div className="text-center">
                      <Trees className="w-8 h-8 mx-auto mb-2 text-green-500" />
                      <span className="text-sm font-medium text-gray-700">Adventures</span>
                    </div>
                  </RevealCard>

                  <RevealCard 
                    className="text-center p-4"
                    revealContent={
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <Users className="w-8 h-8 mx-auto mb-2" />
                          <span className="text-sm font-medium">Chill Vibes</span>
                        </div>
                      </div>
                    }
                  >
                    <div className="text-center">
                      <Users className="w-8 h-8 mx-auto mb-2 text-red-500" />
                      <span className="text-sm font-medium text-gray-700">Hangouts</span>
                    </div>
                  </RevealCard>
                </div>

                <p className="text-lg text-gray-700">
                  Currently active in the <span className="bg-amber-100 px-2 py-1 rounded font-semibold text-amber-800">Helsinki area</span> — next up: <span className="bg-amber-100 px-2 py-1 rounded font-semibold text-amber-800">Tampere and beyond</span>.
                </p>
              </div>
            </div>

            {/* Why We're Different */}
            <div className="mb-16">
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <div className="flex items-center mb-6">
                  <Zap className="w-12 h-12 text-orange-500 mr-4" />
                  <h2 className="text-2xl font-bold text-gray-900">Why We&apos;re Wildly Different</h2>
                </div>
                
                <p className="text-lg text-gray-700 mb-6">
                  No cliques. We say <strong>no more</strong> to boring nights out!
                  <br/>
                  Expect <strong>brand new experiences you didn&apos;t know you needed.</strong>
                </p>
                
                <p className="text-lg text-gray-700 text-center">
                  Thoughtfully <strong>engineered to get you out of your comfort zone</strong> — in the best way.
                </p>
              </div>
            </div>

            {/* Team Section */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-center mb-6">
                <Users className="w-12 h-12 text-indigo-500 mr-4" />
                <h2 className="text-2xl font-bold text-gray-900">Who We Are</h2>
              </div>
              <p className="text-lg text-gray-700">
                A group of students and alumni who never really left the student life behind.
              </p>
            </div>

          </div>
        </section>
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;