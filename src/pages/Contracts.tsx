import BottomNav from "@/components/BottomNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileText, CheckCircle2, Clock, Coins } from "lucide-react";

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
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 glass-card border-b border-white/10">
        <div className="max-w-screen-xl mx-auto p-4">
          <h1 className="text-2xl font-bold">My Contracts</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Signed CollabCoins & Milestones
          </p>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto p-4 space-y-4">
        {contracts.map((contract) => (
          <div key={contract.id} className="glass-card rounded-2xl p-6 space-y-4 animate-fade-in">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="font-bold text-xl">{contract.role}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {contract.project} • by @{contract.creator}
                </p>
              </div>
              <Badge className={getStatusColor(contract.status)}>
                {contract.status}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-mono font-bold">{contract.progress}%</span>
              </div>
              <Progress value={contract.progress} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <CheckCircle2 className="h-5 w-5 text-secondary" />
                <div>
                  <p className="text-xs text-muted-foreground">Milestones</p>
                  <p className="font-mono font-bold">
                    {contract.milestones.completed}/{contract.milestones.total}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <Coins className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Payment</p>
                  <p className="font-mono font-bold">{contract.payment}</p>
                </div>
              </div>
            </div>

            <Button className="w-full bg-gradient-to-r from-primary to-secondary">
              Open Workspace
            </Button>
          </div>
        ))}

        {contracts.length === 0 && (
          <div className="glass-card rounded-2xl p-12 text-center">
            <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-bold text-lg mb-2">No Active Contracts</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Browse CollabFeed to find opportunities
            </p>
            <Button className="bg-gradient-to-r from-primary to-secondary">
              Explore Collabs
            </Button>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Contracts;
