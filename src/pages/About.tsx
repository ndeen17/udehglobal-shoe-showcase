import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background pt-20">
      
      {/* Back Navigation */}
      <div className="px-brutalist-md pt-brutalist-md">
        <Link 
          to="/"
          className="inline-flex items-center space-x-2 font-brutalist text-brutalist-sm font-light tracking-wider text-muted-foreground hover:text-foreground transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1} />
          <span>BACK</span>
        </Link>
      </div>

      {/* About Content */}
      <div className="px-brutalist-md py-brutalist-xl">
        <div className="max-w-2xl mx-auto text-center space-y-brutalist-lg">
          
          <h1 className="font-brutalist text-brutalist-xl font-light tracking-widest text-foreground">
            ABOUT UDEH GLOBAL
          </h1>
          
          <div className="space-y-brutalist-md">
            <p className="font-brutalist text-brutalist-sm font-light tracking-wide text-muted-foreground leading-relaxed">
              PREMIUM COMFORT SLIDES DESIGNED FOR THE MODERN LIFESTYLE
            </p>
            <p className="font-brutalist text-brutalist-sm font-light tracking-wide text-muted-foreground leading-relaxed">
              CRAFTED WITH ATTENTION TO DETAIL AND SUPERIOR MATERIALS
            </p>
            <p className="font-brutalist text-brutalist-sm font-light tracking-wide text-muted-foreground leading-relaxed">
              COMMITTED TO DELIVERING EXCEPTIONAL COMFORT AND STYLE
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default About;