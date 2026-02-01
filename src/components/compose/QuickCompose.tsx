import { useState } from 'react';
import { Send, Calendar, Paperclip, X, Sparkles, AtSign, ChevronDown } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-foreground/30 backdrop-blur-md animate-fade-in">
      <div className="w-full sm:max-w-2xl bg-card rounded-t-3xl sm:rounded-2xl shadow-elevated border animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-accent flex items-center justify-center">
              <Send className="h-4 w-4 text-white" />
            </div>
            <h2 className="font-display text-lg font-semibold">New Message</h2>
          </div>
          <Button 
            variant="ghost" 
            size="icon-sm" 
            onClick={onClose}
            className="rounded-xl hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form */}
        <div className="p-5 space-y-4">
          {/* To */}
          <div className="flex items-center gap-3 group">
            <label className="text-sm font-medium text-muted-foreground w-16 shrink-0">To</label>
            <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/50 bg-background/50 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20 transition-all duration-200">
              <AtSign className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Enter recipients..."
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm"
              />
            </div>
          </div>

          {/* Subject */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-muted-foreground w-16 shrink-0">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What's this about?"
              className="flex-1 px-4 py-2.5 rounded-xl border border-border/50 bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200 text-sm"
            />
          </div>

          {/* Body */}
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your message..."
            rows={6}
            className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200 resize-none text-sm"
          />

          {/* Schedule Picker */}
          {showSchedule && (
            <div className="p-4 rounded-xl bg-muted/30 border animate-fade-in-up">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Schedule for later</span>
                <ChevronDown className="h-4 w-4 ml-auto" />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t bg-muted/20">
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon-sm" 
              title="Attach files"
              className="rounded-xl"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button
              variant={showSchedule ? "secondary" : "ghost"}
              size="icon-sm"
              title="Schedule send"
              onClick={() => setShowSchedule(!showSchedule)}
              className="rounded-xl"
            >
              <Calendar className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon-sm" 
              title="AI assist"
              className="rounded-xl text-focus"
            >
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="rounded-xl"
            >
              Discard
            </Button>
            <Button 
              className="rounded-xl gap-2 gradient-accent border-0 shadow-soft hover:opacity-90 transition-opacity"
            >
              <Send className="h-4 w-4" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
