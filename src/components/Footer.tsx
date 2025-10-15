const Footer = () => {
  return (
    <footer className="bg-background border-t border-border/30 py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xs sm:text-sm font-light tracking-[0.25em] sm:tracking-[0.3em] text-foreground/60">CONTACT</h3>
            <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm font-light text-muted-foreground">
              <p>info@udehglobal.com</p>
              <p>Nigeria</p>
            </div>
          </div>
          
          <div className="pt-6 sm:pt-8 border-t border-border/30">
            <p className="text-xs font-light tracking-wide sm:tracking-wider text-muted-foreground/60">
              © {new Date().getFullYear()} UDEHGLOBAL
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
