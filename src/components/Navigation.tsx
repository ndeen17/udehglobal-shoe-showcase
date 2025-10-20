import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";

const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/20">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="UdehGlobal" className="h-8 sm:h-10" />
          </Link>
          
          <div className="flex gap-8 sm:gap-12">
            <Link 
              to="/" 
              className={`text-xs sm:text-sm tracking-[0.2em] transition-colors ${
                location.pathname === "/" 
                  ? "text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              SLIDES
            </Link>
            <Link 
              to="/artwork" 
              className={`text-xs sm:text-sm tracking-[0.2em] transition-colors ${
                location.pathname === "/artwork" 
                  ? "text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              ARTWORK
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
