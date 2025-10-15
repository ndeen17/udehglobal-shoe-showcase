const features = [
  {
    title: "Premium Quality",
    description: "Crafted with exceptional materials for lasting comfort"
  },
  {
    title: "Perfect Fit",
    description: "Ergonomically designed for all-day wear"
  },
  {
    title: "Stylish Design",
    description: "Timeless aesthetics that elevate any look"
  },
  {
    title: "Fast Delivery",
    description: "Swift and reliable nationwide shipping"
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20 space-y-6">
          <h2 className="text-3xl md:text-4xl font-light tracking-[0.15em] text-foreground">EXCELLENCE</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="text-center p-8 space-y-3"
            >
              <h3 className="text-lg font-medium text-foreground tracking-wide">{feature.title}</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
