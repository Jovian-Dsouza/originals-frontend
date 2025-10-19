import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, Plus } from "lucide-react";
import { toast } from "sonner";

const CreateContent = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"indie" | "collab" | null>(null);
  const [selectedCollab, setSelectedCollab] = useState("");
  const [stage, setStage] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contentType, setContentType] = useState("");

  // Mock existing collabs - will be replaced with real data
  const existingCollabs = [
    { id: "1", title: "Short Film Project" },
    { id: "2", title: "Music Video Collab" },
    { id: "3", title: "Photography Series" },
  ];

  const handlePublish = () => {
    if (mode === "indie" && (!title || !contentType)) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (mode === "collab" && (!selectedCollab || !stage)) {
      toast.error("Please select collab and stage");
      return;
    }

    toast.success("Content posted successfully!");
    navigate("/feed");
  };

  if (!mode) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="max-w-2xl mx-auto p-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <h1 className="text-3xl font-bold mb-2">Post Content</h1>
          <p className="text-muted-foreground mb-8">Choose your content type</p>

          <div className="grid gap-4">
            <button
              onClick={() => setMode("indie")}
              className="p-6 border-2 border-border hover:border-primary rounded-lg smooth-transition text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 smooth-transition">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Indie Content</h3>
                  <p className="text-muted-foreground text-sm">
                    Share your own standalone work, thoughts, or creations
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setMode("collab")}
              className="p-6 border-2 border-border hover:border-primary rounded-lg smooth-transition text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 smooth-transition">
                  <Upload className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Collab Content</h3>
                  <p className="text-muted-foreground text-sm">
                    Add BTS or Release updates to an existing collaboration
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-2xl mx-auto p-6">
        <Button
          variant="ghost"
          onClick={() => setMode(null)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <h1 className="text-3xl font-bold mb-2">
          {mode === "indie" ? "Indie Content" : "Collab Content"}
        </h1>
        <p className="text-muted-foreground mb-8">
          {mode === "indie" 
            ? "Share your independent work with the community" 
            : "Add progress updates to your collab"}
        </p>

        <div className="space-y-6">
          {mode === "collab" && (
            <>
              <div className="space-y-2">
                <Label>Select Collab</Label>
                <Select value={selectedCollab} onValueChange={setSelectedCollab}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a collab..." />
                  </SelectTrigger>
                  <SelectContent>
                    {existingCollabs.map((collab) => (
                      <SelectItem key={collab.id} value={collab.id}>
                        {collab.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Stage</Label>
                <Select value={stage} onValueChange={setStage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bts">BTS (Behind the Scenes)</SelectItem>
                    <SelectItem value="release">Release</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {mode === "indie" && (
            <>
              <div className="space-y-2">
                <Label>Content Type</Label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bts">BTS (Behind the Scenes)</SelectItem>
                    <SelectItem value="release">Release</SelectItem>
                    <SelectItem value="thoughts">Thoughts</SelectItem>
                    <SelectItem value="independent">Independent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  placeholder="Give your post a title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Tell us about this content..."
              className="min-h-[120px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Media Upload</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary smooth-transition cursor-pointer">
              <Upload className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                Images, videos, or documents
              </p>
            </div>
          </div>

          <Button
            onClick={handlePublish}
            className="w-full"
            size="lg"
          >
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateContent;
