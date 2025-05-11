
import React from 'react';
import { Calendar, Clock, MessageSquare } from 'lucide-react';
import MeetingTimer from '@/components/MeetingTimer';

interface MeetingHeaderProps {
  meetingActive: boolean;
  meetingName: string;
  startTime: Date | null;
}

const MeetingHeader: React.FC<MeetingHeaderProps> = ({
  meetingActive,
  meetingName,
  startTime
}) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
        <MessageSquare className="h-8 w-8 text-blue-600" />
        Reunión {meetingActive ? 'Activa' : 'Nueva'}
      </h1>
      <div className="flex items-center justify-between mt-2">
        <p className="text-gray-500 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {meetingName}
        </p>
        {meetingActive && (
          <MeetingTimer isRunning={meetingActive} startTime={startTime} />
        )}
      </div>
    </div>
  );
};

export default MeetingHeader;
