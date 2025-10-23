import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Send, Paperclip, Image } from "lucide-react";
import { useMessages, useSendMessage, useMarkAsRead } from "@/hooks/useMessages";
import { useMatches } from "@/hooks/useMatches";
import { useWallet } from "@/contexts/WalletContext";
import { MessageSkeleton } from "@/components/LoadingStates";

const MatchDetail = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const { zoraWallet } = useWallet();
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch match details
  const { data: matchesData } = useMatches();
  const match = matchesData?.matches.find(m => m.id === matchId);

  // Fetch messages
  const { data: messagesData, isLoading: messagesLoading } = useMessages(matchId!);
  const sendMessageMutation = useSendMessage(matchId!);
  const markAsReadMutation = useMarkAsRead(matchId!);

  const messages = messagesData?.messages || [];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark messages as read when component mounts
  useEffect(() => {
    if (matchId && messages.length > 0) {
      markAsReadMutation.mutate();
    }
  }, [matchId, messages.length]);

  const handleSendMessage = () => {
    if (!messageText.trim() || sendMessageMutation.isPending) return;

    sendMessageMutation.mutate({
      content: messageText.trim(),
      messageType: "text",
    });

    setMessageText("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!match) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Match not found</h2>
          <Button onClick={() => navigate("/contracts")}>
            Back to Contracts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-card border-b border-white/10">
        <div className="max-w-screen-xl mx-auto p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/contracts")}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {match.otherUser?.wallet.slice(2, 4).toUpperCase() || "??"}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h1 className="font-bold text-lg">{match.projectName}</h1>
                <p className="text-sm text-muted-foreground">
                  {match.role} • @{match.otherUser?.wallet.slice(0, 8)}...
                </p>
              </div>
            </div>

            <Badge className="ml-auto capitalize">
              {match.status}
            </Badge>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-4 space-y-4">
          {messagesLoading ? (
            <>
              <MessageSkeleton />
              <MessageSkeleton />
              <MessageSkeleton />
            </>
          ) : messages.length > 0 ? (
            messages.map((message) => {
              const isOwn = message.senderWallet === zoraWallet;
              
              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                      {message.senderWallet.slice(2, 4).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={`flex-1 max-w-xs ${isOwn ? "text-right" : ""}`}>
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        isOwn
                          ? "bg-primary text-primary-foreground ml-auto"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No messages yet</p>
              <p className="text-sm text-muted-foreground">
                Start the conversation!
              </p>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Message Input */}
      <div className="sticky bottom-0 glass-card border-t border-white/10 p-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="p-2">
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="sm" className="p-2">
            <Image className="h-4 w-4" />
          </Button>
          
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
            disabled={sendMessageMutation.isPending}
          />
          
          <Button
            onClick={handleSendMessage}
            disabled={!messageText.trim() || sendMessageMutation.isPending}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MatchDetail;
