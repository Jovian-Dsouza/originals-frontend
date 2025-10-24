import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface OnboardingErrorDialogProps {
  isOpen: boolean;
  error: string | null;
  onRetry: () => void;
  onClose?: () => void;
}

export const OnboardingErrorDialog: React.FC<OnboardingErrorDialogProps> = ({
  isOpen,
  error,
  onRetry,
  onClose,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <AlertDialogTitle>Connection Error</AlertDialogTitle>
              <AlertDialogDescription className="mt-1">
                Unable to verify your onboarding status. Please check your connection and try again.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        
        {error && (
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3">
            <p className="text-sm text-destructive font-medium">Error Details:</p>
            <p className="text-sm text-destructive/80 mt-1">{error}</p>
          </div>
        )}
        
        <AlertDialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onRetry}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
