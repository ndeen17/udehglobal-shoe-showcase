import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Hero = () => {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTItMnYyaDJ2LTJoLTJ6bTItMnYyaDJ2LTJoLTJ6bTItMnYyaDJ2LTJoLTJ6bTItMnYyaDJ2LTJoLTJ6bTItMnYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="UdehGlobal Logo" className="h-24 md:h-32 object-contain animate-scale-in" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            UDEHGLOBAL
          </h1>
          
          <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto">
            Premium Comfort Slides for Every Step
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              size="lg" 
              onClick={scrollToProducts}
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg font-semibold rounded-xl shadow-accent transition-all duration-300 hover:scale-105"
            >
              Shop Now
            </Button>
            <div className="flex items-center gap-2 text-lg">
              <span className="text-primary-foreground/80">Starting at</span>
              <span className="text-2xl font-bold text-accent">₦15,000</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-primary-foreground/60" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
