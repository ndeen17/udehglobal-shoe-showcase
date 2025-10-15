const features = [
  {
    icon: "✨",
    title: "Premium Quality",
    description: "Made with high-quality materials for long-lasting comfort and durability"
  },
  {
    icon: "🎯",
    title: "Perfect Fit",
    description: "Ergonomically designed to provide the perfect fit for all-day wear"
  },
  {
    icon: "💎",
    title: "Stylish Design",
    description: "Modern and versatile designs that complement any casual outfit"
  },
  {
    icon: "🚀",
    title: "Fast Delivery",
    description: "Quick and reliable shipping to get your slides to you as soon as possible"
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">Why Choose Us</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the perfect blend of comfort, quality, and style
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="text-center p-8 rounded-2xl bg-card border border-border/50 hover:border-accent/50 transition-all duration-300 hover:shadow-elegant group"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
