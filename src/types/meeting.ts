
export type Message = {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  isAI?: boolean;
};

export type Meeting = {
  id: string;
  title: string;
  date: string;
  participants: string[];
  messages: Message[];
};

export type Summary = {
  id: string;
  meetingId: string;
  content: string;
  date: string;
};

export type LogEntry = {
  id: string;
  content: string;
  date: string;
  userId: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
};

export type Decision = {
  id: string;
  meetingId: string;
  content: string;
  date: string;
  tags: string[];
};
