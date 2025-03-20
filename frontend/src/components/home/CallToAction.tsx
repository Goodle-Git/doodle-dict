
import React, { useEffect, useRef } from 'react';
import { CustomButton } from '../ui/custom-button';
import { CheckCircle2 } from 'lucide-react';

const CallToAction = () => {
  const ctaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-scale-in');
        }
      },
      { threshold: 0.1 }
    );
    
    if (ctaRef.current) {
      observer.observe(ctaRef.current);
    }
    
    return () => {
      if (ctaRef.current) {
        observer.unobserve(ctaRef.current);
      }
    };
  }, []);
  
  const benefits = [
    "Free to start - no credit card required",
    "Access to 1000+ vocabulary words",
    "Drawing tools designed for kids",
    "Parent progress tracking dashboard",
    "Vocabulary games and challenges"
  ];
  
  return (
    <section className="py-20 relative overflow-hidden bg-doodle-yellow-light">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-10 right-10 w-20 h-20 bg-doodle-yellow border-2 border-black rounded-md rotate-12"></div>
        <div className="absolute bottom-10 left-10 w-16 h-16 bg-doodle-coral border-2 border-black rounded-md -rotate-12"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div 
          className="neubrutalism-card opacity-0 bg-white max-w-4xl mx-auto p-10 md:p-16"
          ref={ctaRef}
          style={{ animationFillMode: 'forwards' }}
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">
              Start Your Child's Vocabulary Journey Today
            </h2>
            
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Give your kids the gift of words through creative learning with DoodleDict.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center mb-10">
            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-black" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            
            <div className="h-32 w-0 border-l-2 border-black hidden md:block"></div>
            
            <div className="flex flex-col items-center justify-center text-center space-y-6">
              <div className="bg-doodle-yellow border-2 border-black rounded-md px-6 py-2">
                <div className="text-4xl font-bold font-display">Free</div>
                <div className="text-black">to get started</div>
              </div>
              
              <CustomButton size="lg" withShadow>
                Start Free Trial
              </CustomButton>
              
              <p className="text-sm text-gray-700">
                No credit card required. Cancel anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
