export interface Person {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials: string;
}

export interface EmailThread {
  id: string;
  type: 'email';
  subject: string;
  snippet: string;
  from: Person;
  to: Person[];
  cc?: Person[];
  timestamp: Date;
  isRead: boolean;
  isStarred: boolean;
  labels: string[];
  hasAttachment: boolean;
  replyCount: number;
  linkedEvent?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

export interface CalendarEvent {
  id: string;
  type: 'event';
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  attendees: Person[];
  location?: string;
  isAllDay: boolean;
  eventType: 'meeting' | 'task' | 'reminder' | 'focus';
  linkedThread?: string;
  conferenceLink?: string;
  status: 'confirmed' | 'tentative' | 'cancelled';
}

export type TimelineItem = EmailThread | CalendarEvent;

export interface FocusSession {
  id: string;
  startTime: Date;
  endTime: Date;
  isActive: boolean;
  blockedNotifications: boolean;
}

export interface StreamGroup {
  id: string;
  name: string;
  items: TimelineItem[];
  participants: Person[];
  lastActivity: Date;
}
