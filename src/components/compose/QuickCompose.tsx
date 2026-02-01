import { useState } from 'react';
import { Send, Calendar, Paperclip, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuickComposeProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickCompose({ isOpen, onClose }: QuickComposeProps) {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [showSchedule, setShowSchedule] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-card rounded-2xl shadow-elevated border animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-display text-lg font-medium">New Message</h2>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form */}
        <div className="p-4 space-y-3">
          {/* To */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-muted-foreground w-12">To</label>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Enter recipients..."
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          <div className="h-px bg-border" />

          {/* Subject */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-muted-foreground w-12">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What's this about?"
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          <div className="h-px bg-border" />

          {/* Body */}
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your message..."
            rows={8}
            className="w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none resize-none"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon-sm" title="Attach files">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              title="Schedule send"
              onClick={() => setShowSchedule(!showSchedule)}
              className={cn(showSchedule && "text-accent")}
            >
              <Calendar className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" title="AI assist">
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Discard
            </Button>
            <Button variant="accent">
              <Send className="h-4 w-4" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
