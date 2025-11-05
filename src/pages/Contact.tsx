import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Contact = () => {
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

      {/* Contact Content */}
      <div className="px-brutalist-md py-brutalist-xl">
        <div className="max-w-2xl mx-auto text-center space-y-brutalist-lg">
          
          <h1 className="font-brutalist text-brutalist-xl font-light tracking-widest text-foreground">
            CONTACT
          </h1>
          
          <div className="space-y-brutalist-md">
            <p className="font-brutalist text-brutalist-sm font-light tracking-wide text-muted-foreground leading-relaxed">
              EMAIL: INFO@UDEHGLOBAL.COM
            </p>
            <p className="font-brutalist text-brutalist-sm font-light tracking-wide text-muted-foreground leading-relaxed">
              PHONE: +234 XXX XXX XXXX
            </p>
            <p className="font-brutalist text-brutalist-sm font-light tracking-wide text-muted-foreground leading-relaxed">
              ADDRESS: LAGOS, NIGERIA
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;