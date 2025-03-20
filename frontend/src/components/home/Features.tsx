
import React, { useEffect, useRef } from 'react';
import { PencilLine, BookOpen, Star, Brain, Award, Sparkles } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay, color }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-up');
        }
      },
      { threshold: 0.1 }
    );
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);
  
  return (
    <div 
      className={`neubrutalism-card opacity-0 ${color}`}
      ref={cardRef}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="w-12 h-12 mb-5 bg-white border-2 border-black rounded-md flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold font-display mb-3 font-space-grotesk">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  );
};

const Features = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  
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
    
    return () => {
      if (titleRef.current) {
        observer.unobserve(titleRef.current);
      }
    };
  }, []);
  
  const features = [
    {
      icon: <PencilLine className="w-6 h-6 text-black" />,
      title: "Creative Drawing",
      description: "Children draw their own visual representation of vocabulary words, enhancing creativity and personalization.",
      color: "bg-doodle-yellow-light"
    },
    {
      icon: <Brain className="w-6 h-6 text-black" />,
      title: "Visual Memory",
      description: "Improves memory retention through personal visual associations with new vocabulary words.",
      color: "bg-doodle-blue-light"
    },
    {
      icon: <Award className="w-6 h-6 text-black" />,
      title: "Gamified Learning",
      description: "Fun challenges and rewards keep kids motivated to learn and expand their vocabulary.",
      color: "bg-doodle-coral-light"
    },
    {
      icon: <BookOpen className="w-6 h-6 text-black" />,
      title: "Extensive Dictionary",
      description: "Access to age-appropriate words, with definitions suitable for different learning levels.",
      color: "bg-doodle-green-light"
    },
    {
      icon: <Star className="w-6 h-6 text-black" />,
      title: "Progress Tracking",
      description: "Parents and teachers can monitor vocabulary growth and improvements over time.",
      color: "bg-doodle-yellow-light"
    },
    {
      icon: <Sparkles className="w-6 h-6 text-black" />,
      title: "Personalized Learning",
      description: "Adaptive learning path based on each child's progress and vocabulary needs.",
      color: "bg-doodle-blue-light"
    }
  ];
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-1.5 bg-doodle-yellow border-2 border-black rounded-md font-bold text-sm">
            Why choose DoodleDict
          </div>
          
          <h2 
            className="text-3xl md:text-4xl font-bold font-display mb-6 opacity-0 font-space-grotesk"
            ref={titleRef}
            style={{ animationFillMode: 'forwards' }}
          >
            Features Designed for Young Learners
          </h2>
          
          <p className="text-lg text-gray-700 max-w-2xl mx-auto font-space-grotesk">
            Our app combines drawing, vocabulary, and memory techniques to make learning new words fun and effective.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 100}
              color={feature.color}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
