
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

interface FeedbackData {
  name: string;
  value: number;
  color: string;
}

const FeedbackAnalytics = () => {
  const [feedbackData, setFeedbackData] = useState<FeedbackData[]>([]);
  const [totalFeedback, setTotalFeedback] = useState(0);

  const fetchFeedbackData = async () => {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('feedback_type');

      if (error) throw error;

      const counts = {
        true_result: 0,
        false_result: 0,
        partially_correct: 0,
      };

      data?.forEach((feedback) => {
        counts[feedback.feedback_type as keyof typeof counts]++;
      });

      const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
      setTotalFeedback(total);

      if (total > 0) {
        setFeedbackData([
          {
            name: 'True Results',
            value: Math.round((counts.true_result / total) * 100),
            color: '#22c55e',
          },
          {
            name: 'False Results',
            value: Math.round((counts.false_result / total) * 100),
            color: '#ef4444',
          },
          {
            name: 'Partially Correct',
            value: Math.round((counts.partially_correct / total) * 100),
            color: '#f59e0b',
          },
        ]);
      }
    } catch (error) {
      console.error('Error fetching feedback data:', error);
    }
  };

  useEffect(() => {
    fetchFeedbackData();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('feedback-analytics')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'feedback'
        },
        () => {
          fetchFeedbackData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (totalFeedback === 0) {
    return (
      <Card className="backdrop-blur-xl bg-white/70 border-white/20">
        <CardHeader>
          <CardTitle className="text-center text-gray-600">
            Feedback Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">No feedback data available yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="backdrop-blur-xl bg-white/70 border-white/20">
        <CardHeader>
          <CardTitle className="text-center">
            Live Feedback Analytics
          </CardTitle>
          <p className="text-center text-sm text-gray-600">
            Based on {totalFeedback} user responses
          </p>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              trueResults: { label: "True Results", color: "#22c55e" },
              falseResults: { label: "False Results", color: "#ef4444" },
              partiallyCorrect: { label: "Partially Correct", color: "#f59e0b" },
            }}
            className="h-64"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={feedbackData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {feedbackData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {feedbackData.map((data, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-2 rounded-lg bg-white/50"
              >
                <div
                  className="w-4 h-4 rounded-full mx-auto mb-1"
                  style={{ backgroundColor: data.color }}
                />
                <p className="text-xs font-medium">{data.name}</p>
                <p className="text-lg font-bold" style={{ color: data.color }}>
                  {data.value}%
                </p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FeedbackAnalytics;
