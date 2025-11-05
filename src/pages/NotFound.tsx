import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background pt-20 px-8">
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center space-y-8">
          <h1 className="font-light text-6xl tracking-widest text-foreground">
            404
          </h1>
          <p className="font-light text-lg tracking-wider text-gray-500">
            PAGE NOT FOUND
          </p>
          <Link 
            to="/" 
            className="inline-block font-light text-sm tracking-widest text-foreground hover:text-gray-500 transition-colors duration-300 mt-8"
          >
            RETURN HOME
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
