
import React, { useEffect, useRef } from 'react';
import { BookOpen, PencilLine, Sparkles, ArrowRight } from 'lucide-react';

interface StepProps {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
}

const Step: React.FC<StepProps> = ({ number, title, description, icon, delay }) => {
  const stepRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-up');
        }
      },
      { threshold: 0.1 }
    );
    
    if (stepRef.current) {
      observer.observe(stepRef.current);
    }
    
    return () => {
      if (stepRef.current) {
        observer.unobserve(stepRef.current);
      }
    };
  }, []);
  
  return (
    <div 
      className="flex items-start gap-6 opacity-0" 
      ref={stepRef}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-doodle-yellow flex items-center justify-center text-xl font-bold">
          {number}
        </div>
      </div>
      
      <div>
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <h3 className="text-xl font-bold font-display font-space-grotesk">{title}</h3>
        </div>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

const HowItWorks = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      },
      { threshold: 0.1 }
    );
    
    if (titleRef.current) {
      observer.observe(titleRef.current);
    }
    
    if (imageRef.current) {
      observer.observe(imageRef.current);
    }
    
    return () => {
      if (titleRef.current) {
        observer.unobserve(titleRef.current);
      }
      
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, []);
  
  const steps = [
    {
      number: 1,
      icon: <BookOpen className="w-5 h-5 text-doodle-blue" />,
      title: "Learn New Words",
      description: "Your child discovers new vocabulary words appropriate for their age and learning level."
    },
    {
      number: 2,
      icon: <PencilLine className="w-5 h-5 text-doodle-coral" />,
      title: "Create Doodles",
      description: "Kids draw their own representation of each word, creating a personal visual memory aid."
    },
    {
      number: 3,
      icon: <Sparkles className="w-5 h-5 text-doodle-green" />,
      title: "Practice & Remember",
      description: "Fun review games help reinforce learning and vocabulary retention through their own artwork."
    }
  ];
  
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Image Section */}
          <div 
            className="flex-1 relative opacity-0" 
            ref={imageRef}
            style={{ animationFillMode: 'forwards' }}
          >
            <div className="relative z-10">
              <div className="aspect-square max-w-md mx-auto bg-doodle-yellow-light rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-doodle-yellow rounded-full opacity-70"></div>
                <div className="absolute left-6 top-10 w-16 h-16 bg-doodle-blue rounded-full opacity-50"></div>
                
                {/* Sample Screen */}
                <div className="relative z-10 bg-white rounded-xl shadow-lg h-full flex flex-col overflow-hidden border-4 border-white">
                  {/* App UI Header */}
                  <div className="bg-doodle-yellow p-4 flex justify-between items-center">
                    <div className="w-8 h-8 bg-white rounded-full"></div>
                    <div className="h-4 w-20 bg-white/50 rounded-full"></div>
                    <div className="w-8 h-8 bg-white rounded-full"></div>
                  </div>
                  
                  {/* App Content Area */}
                  <div className="flex-1 p-6 flex flex-col items-center justify-center gap-4">
                    <div className="h-6 w-32 bg-gray-200 rounded-full"></div>
                    <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                      <PencilLine className="w-12 h-12 text-gray-300" />
                    </div>
                    <div className="flex justify-center gap-4 mt-4">
                      <div className="w-10 h-10 rounded-full bg-doodle-yellow"></div>
                      <div className="w-10 h-10 rounded-full bg-doodle-coral"></div>
                      <div className="w-10 h-10 rounded-full bg-doodle-blue"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decoration */}
            <div className="absolute -top-6 -left-6 w-20 h-20 bg-doodle-coral-light rounded-xl rotate-12 -z-10"></div>
            <div className="absolute -bottom-8 -right-6 w-28 h-28 bg-doodle-blue-light rounded-xl -rotate-12 -z-10"></div>
          </div>
          
          {/* Content Section */}
          <div className="flex-1">
            <div className="inline-block mb-4 px-4 py-1.5 bg-doodle-green/20 rounded-full font-medium text-sm">
              Simple to use
            </div>
            
            <h2 
              className="text-3xl md:text-4xl font-bold font-display mb-8 opacity-0 font-space-grotesk"
              ref={titleRef}
              style={{ animationFillMode: 'forwards' }}
            >
              How DoodleDict Works
            </h2>
            
            <div className="space-y-10">
              {steps.map((step, index) => (
                <Step
                  key={index}
                  number={step.number}
                  icon={step.icon}
                  title={step.title}
                  description={step.description}
                  delay={index * 200}
                />
              ))}
            </div>
            
            <div className="mt-10 pl-16">
              <a href="#" className="text-doodle-blue font-medium flex items-center gap-2 group">
                Learn more about our educational approach
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
