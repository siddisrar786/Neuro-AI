
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, ThumbsUp, ThumbsDown, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FeedbackButtonProps {
  onFeedbackSubmit?: () => void;
}

const FeedbackButton = ({ onFeedbackSubmit }: FeedbackButtonProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleFeedback = async (feedbackType: 'true_result' | 'false_result' | 'partially_correct') => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('feedback')
        .insert([{ feedback_type: feedbackType }]);

      if (error) throw error;

      toast({
        title: "Thank you for your feedback!",
        description: "Your feedback helps us improve our AI model.",
      });

      setShowOptions(false);
      onFeedbackSubmit?.();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Feedback submission failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openContact = (method: 'linkedin' | 'email') => {
    if (method === 'linkedin') {
      window.open('https://www.linkedin.com/in/isarar/', '_blank');
    } else {
      window.open('mailto:isararsiddique@gmail.com?subject=Neuro AI Feedback', '_blank');
    }
  };

  if (!showOptions) {
    return (
      <Button
        onClick={() => setShowOptions(true)}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        <MessageSquare className="mr-2 h-4 w-4" />
        Feedback
      </Button>
    );
  }

  return (
    <div className="space-y-4 p-4 bg-white/60 backdrop-blur-sm rounded-lg border">
      <h3 className="font-semibold text-gray-800">Was this result helpful?</h3>
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => handleFeedback('true_result')}
          disabled={isSubmitting}
          className="bg-green-600 hover:bg-green-700"
          size="sm"
        >
          <ThumbsUp className="mr-1 h-4 w-4" />
          ✅ True Result
        </Button>
        <Button
          onClick={() => handleFeedback('false_result')}
          disabled={isSubmitting}
          className="bg-red-600 hover:bg-red-700"
          size="sm"
        >
          <ThumbsDown className="mr-1 h-4 w-4" />
          ❌ False Result
        </Button>
        <Button
          onClick={() => handleFeedback('partially_correct')}
          disabled={isSubmitting}
          className="bg-yellow-600 hover:bg-yellow-700"
          size="sm"
        >
          <AlertTriangle className="mr-1 h-4 w-4" />
          ⚠️ Partially Correct
        </Button>
      </div>
      <div className="flex gap-2 pt-2 border-t">
        <Button
          onClick={() => openContact('linkedin')}
          variant="outline"
          size="sm"
        >
          Contact on LinkedIn
        </Button>
        <Button
          onClick={() => openContact('email')}
          variant="outline"
          size="sm"
        >
          Send Email
        </Button>
      </div>
      <Button
        onClick={() => setShowOptions(false)}
        variant="ghost"
        size="sm"
        className="w-full"
      >
        Cancel
      </Button>
    </div>
  );
};

export default FeedbackButton;
