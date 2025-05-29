
import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const VisitorTracker = () => {
  const [onlineVisitors, setOnlineVisitors] = useState(0);
  const [sessionId] = useState(() => {
    // Check if session already exists in localStorage
    const existingSession = localStorage.getItem('neuro-ai-session');
    if (existingSession) {
      return existingSession;
    }
    // Create new session ID and store it
    const newSession = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('neuro-ai-session', newSession);
    return newSession;
  });

  const getClientIP = async () => {
    try {
      // Using a simple IP detection service
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.log('Could not get IP, using session only');
      return null;
    }
  };

  const updateVisitorStatus = async () => {
    try {
      const clientIP = await getClientIP();
      const uniqueId = clientIP ? `${clientIP}-${sessionId}` : sessionId;
      
      const { error } = await supabase
        .from('visitors')
        .upsert({
          session_id: uniqueId,
          is_online: true,
          last_seen: new Date().toISOString(),
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating visitor status:', error);
    }
  };

  const fetchOnlineVisitors = async () => {
    try {
      // Clean up old visitors first
      await supabase.rpc('cleanup_offline_visitors');
      
      // Get current online visitors
      const { data, error } = await supabase
        .from('visitors')
        .select('*')
        .eq('is_online', true);

      if (error) throw error;
      
      // Count unique IPs to avoid counting same user multiple times
      const uniqueVisitors = new Set();
      data?.forEach(visitor => {
        const ip = visitor.session_id.split('-')[0];
        uniqueVisitors.add(ip);
      });
      
      setOnlineVisitors(uniqueVisitors.size);
    } catch (error) {
      console.error('Error fetching online visitors:', error);
    }
  };

  useEffect(() => {
    // Initial setup
    updateVisitorStatus();
    fetchOnlineVisitors();

    // Update visitor status every 30 seconds
    const statusInterval = setInterval(updateVisitorStatus, 30000);
    
    // Fetch visitor count every 10 seconds
    const countInterval = setInterval(fetchOnlineVisitors, 10000);

    // Subscribe to real-time updates
    const channel = supabase
      .channel('visitors-tracker')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'visitors'
        },
        () => {
          fetchOnlineVisitors();
        }
      )
      .subscribe();

    // Cleanup on unmount
    return () => {
      clearInterval(statusInterval);
      clearInterval(countInterval);
      supabase.removeChannel(channel);
      
      // Mark user as offline when leaving
      const clientIP = localStorage.getItem('neuro-ai-client-ip');
      const uniqueId = clientIP ? `${clientIP}-${sessionId}` : sessionId;
      
      supabase
        .from('visitors')
        .update({ is_online: false })
        .eq('session_id', uniqueId);
    };
  }, [sessionId]);

  // Handle page visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateVisitorStatus();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg"
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-2 h-2 bg-green-500 rounded-full"
      />
      <Users className="h-4 w-4 text-gray-600" />
      <span className="text-sm font-medium text-gray-700">
        Live Visitors Now: 
        <motion.span
          key={onlineVisitors}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="ml-1 font-bold text-green-600"
        >
          {onlineVisitors}
        </motion.span>
      </span>
    </motion.div>
  );
};

export default VisitorTracker;
