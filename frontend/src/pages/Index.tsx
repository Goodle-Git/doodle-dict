
import React, { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import HowItWorks from '@/components/home/HowItWorks';
import CallToAction from '@/components/home/CallToAction';

const Index = () => {
  useEffect(() => {
    // Smooth scroll to top on initial load
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    
    // Update page title
    document.title = 'DoodleDict - Learn Vocabulary Through Creative Drawing';
  }, []);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-white font-space-grotesk">
      <Navbar />
      
      <main className="pt-16">
        <Hero />
        <Features />
        <HowItWorks />
        <CallToAction />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
