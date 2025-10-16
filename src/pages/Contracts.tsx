import BottomNav from "@/components/BottomNav";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { MessageCircle } from "lucide-react";

const Contracts = () => {
  const contracts = [
    {
      id: "1",
      project: "Neon Dream",
      role: "VFX Artist",
      creator: "Dharma",
      status: "active",
      progress: 65,
      payment: "0.2 ETH",
      milestones: { completed: 2, total: 3 },
      lastMessage: "Just submitted milestone 2 for review",
      lastMessageTime: "2m ago",
      unread: 3,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dharma",
    },
    {
      id: "2",
      project: "Cyber Beats EP",
      role: "Mix Engineer",
      creator: "Luna",
      status: "delivered",
      progress: 100,
      payment: "$2.5k",
      milestones: { completed: 3, total: 3 },
      lastMessage: "Final mix is ready!",
      lastMessageTime: "1h ago",
      unread: 0,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
    },
    {
      id: "3",
      project: "Abstract Motion",
      role: "Animator",
      creator: "Koda",
      status: "active",
      progress: 30,
      payment: "0.5 ETH",
      milestones: { completed: 1, total: 4 },
      lastMessage: "Can we schedule a sync call?",
      lastMessageTime: "3h ago",
      unread: 1,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Koda",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-primary/20 text-primary";
      case "delivered":
        return "bg-secondary/20 text-secondary";
      case "completed":
        return "bg-green-500/20 text-green-400";
      default:
        return "bg-muted/20 text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-background">
      <header className="sticky top-0 z-40 glass-card border-b border-white/10">
        <div className="max-w-screen-xl mx-auto p-4">
          <h1 className="text-2xl font-bold">My Contracts</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Active workspace channels
          </p>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto">
        {contracts.map((contract) => (
          <div 
            key={contract.id} 
            className="border-b border-white/10 hover:bg-muted/30 smooth-transition cursor-pointer"
          >
            <div className="p-4 flex items-center gap-4">
              {/* Avatar */}
              <div className="relative">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center overflow-hidden">
                  <img src={contract.avatar} alt={contract.creator} className="w-full h-full" />
                </div>
                {contract.status === "active" && (
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-secondary border-2 border-background" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold truncate">{contract.project}</h3>
                    <Badge className={getStatusColor(contract.status) + " text-xs"}>
                      {contract.status}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {contract.lastMessageTime}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground truncate mb-1">
                  {contract.role} • @{contract.creator}
                </p>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground truncate flex items-center gap-2">
                    <MessageCircle className="h-3 w-3" />
                    {contract.lastMessage}
                  </p>
                  {contract.unread > 0 && (
                    <Badge className="bg-primary text-xs h-5 w-5 p-0 flex items-center justify-center rounded-full">
                      {contract.unread}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {contracts.length === 0 && (
          <div className="glass-card rounded-2xl p-12 text-center m-4">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-bold text-lg mb-2">No Active Contracts</h3>
            <p className="text-sm text-muted-foreground">
              Your workspace channels will appear here
            </p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Contracts;
