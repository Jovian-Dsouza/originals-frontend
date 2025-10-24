import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useWallet } from "@/contexts/WalletContext";
import { uploadFileToIPFS } from "@/lib/ipfs";
import { apiClient, ApiResponse } from "@/lib/api-client";
import type { MintPostCoinRequest } from "@/types/postcoin";

interface Collaborator {
  role: string;
  creatorType: "indie" | "org" | "brand" | "";
  credits: number;
  compensationType: "paid" | "barter" | "both" | "";
  timeCommitment: "ongoing" | "one-time" | "";
  jobDescription: string;
}

interface MintPostCoinData {
  collabPostId: string;
  coinAddress: string;
  coinName: string;
  coinSymbol: string;
  transactionHash?: string;
  zoraUrl: string;
}

const CreatePost = () => {
  const navigate = useNavigate();
  const { zoraWallet, isConnected } = useWallet();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [ipfsUrl, setIpfsUrl] = useState<string | null>(null);

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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadFileToIPFS(selectedFile);
      setIpfsUrl(result.ipfsUri);
      toast.success("File uploaded to IPFS successfully!");
      console.log("IPFS URL:", result.ipfsUri);
      console.log("Gateway URL:", result.gatewayUrl);
    } catch (error) {
      console.error("Failed to upload file:", error);
      toast.error("Failed to upload file to IPFS");
    } finally {
      setIsUploading(false);
    }
  };

  const handleContinueToCollaborators = async () => {
    if (!title || !description) {
      toast.error("Please fill in title and description");
      return;
    }

    // If there's a selected file but no IPFS URL, upload it first
    if (selectedFile && !ipfsUrl) {
      await handleFileUpload();
      // Wait a moment for the upload to complete
      setTimeout(() => {
        setStep(2);
      }, 1000);
    } else {
      setStep(2);
    }
  };

  const handlePublish = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    // if (totalCredits !== 100) {
    //   toast.error("Total credits must equal 100%");
    //   return;
    // }

    // if (collaborators.length === 0) {
    //   toast.error("Please add at least one collaborator");
    //   return;
    // }

    if (!title || !description) {
      toast.error("Please fill in title and description");
      return;
    }

    // Validate required fields
    if (!selectedFile || !ipfsUrl) {
      toast.error("Please upload a media file first");
      return;
    }

    // Prepare API request data for PostCoin minting
    const mintPostCoinData: MintPostCoinRequest = {
      title,
      description,
      media: {
        ipfsUrl,
        gatewayUrl: ipfsUrl.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/'),
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size
      },
      collaboration: {
        role: collaborators[0]?.role || "Collaborator",
        paymentType: collaborators[0]?.compensationType === "both" ? "both" : 
                     collaborators[0]?.compensationType === "paid" ? "paid" : "barter",
        credits: totalCredits,
        workStyle: collaborators[0]?.timeCommitment === "ongoing" ? "freestyle" : "contract",
        location: "Remote",
        collaborators: collaborators.map(c => ({
          role: c.role,
          creatorType: c.creatorType as "indie" | "org" | "brand",
          credits: c.credits,
          compensationType: c.compensationType as "paid" | "barter" | "both",
          timeCommitment: c.timeCommitment as "ongoing" | "one-time",
          jobDescription: c.jobDescription,
        })),
      },
      creatorWallet: zoraWallet || "",
    };

    try {
      // Call the new PostCoin minting API using the API client
      const result: ApiResponse<MintPostCoinData> = await apiClient.post<MintPostCoinData>(
        '/collabs/mint-postcoin',
        mintPostCoinData,
        zoraWallet || undefined
      );

      if (result.success) {
        toast.success("PostCoin minted successfully!");
        console.log("PostCoin Details:", result.data);
        console.log("Zora URL:", result.data?.zoraUrl);
        navigate("/collab");
      } else {
        toast.error(result.error?.message || "Failed to mint PostCoin");
        console.error("Minting errors:", result.error);
      }
    } catch (error) {
      console.error("Failed to mint PostCoin:", error);
      toast.error("Failed to mint PostCoin. Please try again.");
    }
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
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*,audio/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {!selectedFile ? (
                  <div 
                    className="border-2 border-dashed border-white/20 rounded-2xl p-12 text-center hover:border-primary/50 smooth-transition cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Images, videos, or audio files
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="border border-white/20 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <ImageIcon className="h-5 w-5 text-primary" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{selectedFile.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedFile(null);
                            setImagePreview(null);
                            setIpfsUrl(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {imagePreview && selectedFile.type.startsWith('image/') && (
                        <div className="mb-3">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      
                      {/* {!ipfsUrl && (
                        <Button
                          onClick={handleFileUpload}
                          disabled={isUploading}
                          className="w-full"
                          size="sm"
                        >
                          {isUploading ? "Uploading to IPFS..." : "Upload to IPFS"}
                        </Button>
                      )}
                      
                      {ipfsUrl && (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                          <p className="text-xs text-green-400 font-medium mb-1">✅ Uploaded to IPFS</p>
                          <p className="text-xs text-muted-foreground break-all">{ipfsUrl}</p>
                        </div>
                      )} */}
                    </div>
                  </div>
                )}
              </div>

              <Button
                onClick={handleContinueToCollaborators}
                disabled={!title || !description || isUploading}
                className="w-full bg-gradient-to-r from-primary to-secondary"
                size="lg"
              >
                {isUploading ? "Uploading..." : "Continue to Collaborators"}
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
                disabled={!isConnected || !selectedFile || !ipfsUrl}
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
