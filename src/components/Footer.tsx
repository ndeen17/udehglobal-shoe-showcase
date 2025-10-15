const Footer = () => {
  return (
    <footer className="bg-background border-t border-border/30 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h3 className="text-sm font-light tracking-[0.3em] text-foreground/60">CONTACT</h3>
            <div className="space-y-2 text-sm font-light text-muted-foreground">
              <p>info@udehglobal.com</p>
              <p>Nigeria</p>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border/30">
            <p className="text-xs font-light tracking-wider text-muted-foreground/60">
              © {new Date().getFullYear()} UDEHGLOBAL
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
