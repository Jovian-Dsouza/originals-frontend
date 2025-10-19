import { Link, useLocation } from "react-router-dom";
import { Image, Handshake, FileText, User } from "lucide-react";

const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/feed", icon: Image, label: "PostFeed" },
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
      </div>
    </nav>
  );
};

export default BottomNav;
