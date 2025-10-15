import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-4">
            <img src={logo} alt="UdehGlobal Logo" className="h-16 object-contain" />
            <p className="text-primary-foreground/80">
              Your trusted source for premium comfort slides
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#products" className="hover:text-accent transition-colors">Products</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>📧 info@udehglobal.com</li>
              <li>📱 +234 XXX XXX XXXX</li>
              <li>📍 Nigeria</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 pt-8 text-center text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} UdehGlobal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
