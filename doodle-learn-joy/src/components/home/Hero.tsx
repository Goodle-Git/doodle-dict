
import React, { useEffect, useRef } from 'react';
import { CustomButton } from '../ui/custom-button';
import { useIsMobile } from '@/hooks/use-mobile';
import { PencilLine, BookOpen, ArrowRight } from 'lucide-react';

const Hero = () => {
  const isMobile = useIsMobile();
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      },
      { threshold: 0.1 }
    );
    
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    
    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);
  
  return (
    <section className="relative pt-32 pb-16 overflow-hidden bg-white">
      {/* Background Decoration - Using neubrutalism shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[5%] right-[10%] w-[20%] h-[20%] bg-doodle-yellow border-2 border-black rotate-6"></div>
        <div className="absolute top-[60%] left-[5%] w-[15%] h-[15%] bg-doodle-blue border-2 border-black -rotate-12"></div>
        <div className="absolute top-[20%] left-[60%] w-[10%] h-[10%] bg-doodle-coral border-2 border-black rotate-12"></div>
      </div>
      
      <div 
        className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl opacity-0" 
        ref={heroRef}
        style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 ">
          {/* Hero Content */}
          <div className="flex-1 text-center lg:text-left">
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-xl mx-auto lg:mx-0">
              Learn with creativity
            </p>
            
            <h1 className="text-5xl md:text-5xl lg:text-6xl font-bold font-display mb-6 leading-tight font-space-grotesk">
              Draw, Learn, and Remember <span className="text-doodle-coral">Vocabulary</span> with Fun!
            </h1>
            
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-xl mx-auto lg:mx-0">
              Help your kids master new words through the power of visual memory and creative doodling.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <CustomButton size="lg" className="gap-2">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </CustomButton>
              
              <CustomButton variant="outline" size="lg">
                See How It Works
              </CustomButton>
            </div>
            
          </div>
          
          {/* Hero Image/Illustration */}
          <div className="flex-1 relative">
            <div className="relative z-10 bg-white border-2 border-black rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <div className="aspect-[4/3] bg-doodle-yellow-light relative overflow-hidden">
                {/* Doodle elements */}
                <div className="absolute top-[10%] left-[15%] w-16 h-16 bg-doodle-yellow border-2 border-black rounded-md rotate-12 animate-bounce-slight"></div>
                <div className="absolute top-[25%] right-[25%] w-24 h-24 bg-doodle-blue border-2 border-black rounded-md -rotate-6 animate-bounce-slight" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute bottom-[20%] left-[30%] w-20 h-20 bg-doodle-coral border-2 border-black rounded-md rotate-12 animate-bounce-slight" style={{ animationDelay: '1s' }}></div>
                
                {/* Main image placeholder - Replace with actual app screenshot */}
                <div className="absolute inset-[10%] rounded-lg bg-white border-2 border-black flex items-center justify-center">
                  <div className="flex gap-6 items-center">
                    <PencilLine className="w-12 h-12 text-black animate-bounce-slight" />
                    <span className="text-4xl font-bold font-display">+</span>
                    <BookOpen className="w-12 h-12 text-black animate-bounce-slight" style={{ animationDelay: '0.3s' }} />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decoration elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-doodle-green-light border-2 border-black rounded-md -z-10 rotate-12"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-doodle-coral-light border-2 border-black rounded-md -z-10 -rotate-6"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
