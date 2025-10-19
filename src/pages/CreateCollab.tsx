import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Collaborator {
  role: string;
  creatorType: "indie" | "org" | "brand" | "";
  credits: number;
  compensationType: "paid" | "barter" | "both" | "";
  timeCommitment: "ongoing" | "one-time" | "";
  jobDescription: string;
}

const CreatePost = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

  const addCollaborator = () => {
    setCollaborators([
      ...collaborators,
      { 
        role: "", 
        creatorType: "", 
        credits: 0, 
        compensationType: "", 
        timeCommitment: "",
        jobDescription: ""
      },
    ]);
  };

  const removeCollaborator = (index: number) => {
    setCollaborators(collaborators.filter((_, i) => i !== index));
  };

  const updateCollaborator = (index: number, field: keyof Collaborator, value: any) => {
    const updated = [...collaborators];
    updated[index] = { ...updated[index], [field]: value };
    setCollaborators(updated);
  };

  const totalCredits = collaborators.reduce((sum, c) => sum + (c.credits || 0), 0);

  const handlePublish = () => {
    if (totalCredits !== 100) {
      toast.error("Total credits must equal 100%");
      return;
    }
    toast.success("PostCoin minted successfully!");
    navigate("/");
  };

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 glass-card border-b border-white/10">
        <div className="max-w-screen-xl mx-auto p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => (step === 1 ? navigate(-1) : setStep(1))}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Create PostCoin</h1>
              <p className="text-sm text-muted-foreground">
                {step === 1 ? "Project details" : "Invite collaborators"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto p-4">
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="glass-card rounded-2xl p-8 space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Project Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter project title..."
                  className="bg-muted/50 border-white/10"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your project..."
                  rows={5}
                  className="bg-muted/50 border-white/10 resize-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Upload Media</label>
                <div className="border-2 border-dashed border-white/20 rounded-2xl p-12 text-center hover:border-primary/50 smooth-transition cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Images, videos, or audio files
                  </p>
                </div>
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!title || !description}
                className="w-full bg-gradient-to-r from-primary to-secondary"
                size="lg"
              >
                Continue to Collaborators
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="glass-card rounded-2xl p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-lg">Invite Collaborators</h2>
                  <p className="text-sm text-muted-foreground">
                    Define roles and split credits
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Credits</p>
                  <p className={`text-2xl font-mono font-bold ${
                    totalCredits === 100 ? "text-secondary" : "text-destructive"
                  }`}>
                    {totalCredits}%
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {collaborators.map((collab, index) => (
                  <div key={index} className="glass-card rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">Collaborator {index + 1}</Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCollaborator(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div>
                      <Label className="text-xs mb-2">Role</Label>
                      <Input
                        placeholder="e.g., VFX Artist, Sound Designer"
                        value={collab.role}
                        onChange={(e) => updateCollaborator(index, "role", e.target.value)}
                        className="bg-muted/50 border-white/10"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs mb-2">Creator Type</Label>
                        <Select
                          value={collab.creatorType}
                          onValueChange={(value) => updateCollaborator(index, "creatorType", value)}
                        >
                          <SelectTrigger className="bg-muted/50 border-white/10">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="indie">Indie</SelectItem>
                            <SelectItem value="org">Organization</SelectItem>
                            <SelectItem value="brand">Brand</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-xs mb-2">Credits %</Label>
                        <Input
                          type="number"
                          placeholder="25"
                          value={collab.credits || ""}
                          onChange={(e) =>
                            updateCollaborator(index, "credits", parseInt(e.target.value) || 0)
                          }
                          className="bg-muted/50 border-white/10"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs mb-2">Compensation</Label>
                        <Select
                          value={collab.compensationType}
                          onValueChange={(value) => updateCollaborator(index, "compensationType", value)}
                        >
                          <SelectTrigger className="bg-muted/50 border-white/10">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="barter">Barter</SelectItem>
                            <SelectItem value="both">Both</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-xs mb-2">Time Commitment</Label>
                        <Select
                          value={collab.timeCommitment}
                          onValueChange={(value) => updateCollaborator(index, "timeCommitment", value)}
                        >
                          <SelectTrigger className="bg-muted/50 border-white/10">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ongoing">Ongoing</SelectItem>
                            <SelectItem value="one-time">One-Time</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs mb-2">Job Description (Optional)</Label>
                      <Textarea
                        placeholder="Skills, role description, requirements..."
                        value={collab.jobDescription}
                        onChange={(e) => updateCollaborator(index, "jobDescription", e.target.value)}
                        className="bg-muted/50 border-white/10 resize-none min-h-[80px]"
                        rows={3}
                      />
                    </div>
                  </div>
                ))}

                <Button
                  onClick={addCollaborator}
                  variant="outline"
                  className="w-full border-dashed border-primary/50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Collaborator
                </Button>
              </div>

              <Button
                onClick={handlePublish}
                disabled={totalCredits !== 100 || collaborators.length === 0}
                className="w-full bg-gradient-to-r from-primary to-secondary"
                size="lg"
              >
                Publish & Mint PostCoin
              </Button>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default CreatePost;
