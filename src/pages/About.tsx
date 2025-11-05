import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background pt-20">
      
      {/* Back Navigation */}
      <div className="px-8 pt-8">
        <Link 
          to="/"
          className="inline-flex items-center space-x-2 brutalist-body text-sm tracking-wider text-gray-500 hover:text-foreground transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1} />
          <span>BACK</span>
        </Link>
      </div>

      {/* About Content */}
      <div className="px-8 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-16">
          
          <h1 className="brutalist-heading text-xl tracking-widest text-foreground">
            ABOUT UDEH GLOBAL
          </h1>
          
          <div className="space-y-8">
            <p className="brutalist-body text-sm tracking-wide text-gray-500 leading-relaxed">
              PREMIUM COMFORT SLIDES DESIGNED FOR THE MODERN LIFESTYLE
            </p>
            <p className="brutalist-body text-sm tracking-wide text-gray-500 leading-relaxed">
              CRAFTED WITH ATTENTION TO DETAIL AND SUPERIOR MATERIALS
            </p>
            <p className="brutalist-body text-sm tracking-wide text-gray-500 leading-relaxed">
              COMMITTED TO DELIVERING EXCEPTIONAL COMFORT AND STYLE
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default About;