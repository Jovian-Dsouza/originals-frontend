import { Link, useLocation } from "react-router-dom";
import { Image, Handshake, FileText, User, Plus } from "lucide-react";
import { Button } from "./ui/button";

const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", icon: Image, label: "PostFeed" },
    { path: "/collab", icon: Handshake, label: "CollabFeed" },
    { path: "/contracts", icon: FileText, label: "Contracts" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-white/10 z-50">
      <div className="max-w-screen-xl mx-auto px-4 h-20 flex items-center justify-around relative">
        {navItems.map((item, index) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 smooth-transition ${
              isActive(item.path)
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <item.icon className={`h-6 w-6 ${isActive(item.path) ? "glow-primary" : ""}`} />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
        
        {/* Floating Create Button */}
        <Link
          to="/create"
          className="absolute -top-6 left-1/2 -translate-x-1/2"
        >
          <Button
            size="lg"
            className="h-14 w-14 rounded-full bg-gradient-to-r from-primary to-secondary hover:scale-110 smooth-transition shadow-lg glow-primary"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNav;
