
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface MeetingTimerProps {
  isRunning: boolean;
  startTime: Date | null;
}

const MeetingTimer: React.FC<MeetingTimerProps> = ({ isRunning, startTime }) => {
  const [duration, setDuration] = useState('00:00:00');
  
  useEffect(() => {
    if (!isRunning || !startTime) {
      return;
    }
    
    const interval = setInterval(() => {
      const now = new Date();
      const diffMs = now.getTime() - startTime.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const hours = Math.floor(diffSec / 3600).toString().padStart(2, '0');
      const minutes = Math.floor((diffSec % 3600) / 60).toString().padStart(2, '0');
      const seconds = (diffSec % 60).toString().padStart(2, '0');
      setDuration(`${hours}:${minutes}:${seconds}`);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isRunning, startTime]);
  
  return (
    <p className="text-gray-500 flex items-center gap-2">
      <Clock className="h-4 w-4" />
      Duración: <span id="meeting-duration">{duration}</span>
    </p>
  );
};

export default MeetingTimer;
