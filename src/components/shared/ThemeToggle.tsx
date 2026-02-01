import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  variant?: 'icon' | 'full';
  className?: string;
}

export function ThemeToggle({ variant = 'icon', className }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  if (variant === 'full') {
    return (
      <div className={cn("flex items-center gap-1 p-1 rounded-xl bg-muted/50", className)}>
        <Button
          variant={theme === 'light' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setTheme('light')}
          className="gap-2"
        >
          <Sun className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only">Light</span>
        </Button>
        <Button
          variant={theme === 'dark' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setTheme('dark')}
          className="gap-2"
        >
          <Moon className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only">Dark</span>
        </Button>
        <Button
          variant={theme === 'system' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setTheme('system')}
          className="gap-2"
        >
          <Monitor className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only">System</span>
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={cycleTheme}
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        className
      )}
      title={`Current: ${theme}. Click to change.`}
    >
      <Sun className={cn(
        "h-4 w-4 absolute transition-all duration-300",
        resolvedTheme === 'dark' 
          ? "rotate-90 scale-0 opacity-0" 
          : "rotate-0 scale-100 opacity-100"
      )} />
      <Moon className={cn(
        "h-4 w-4 absolute transition-all duration-300",
        resolvedTheme === 'dark' 
          ? "rotate-0 scale-100 opacity-100" 
          : "-rotate-90 scale-0 opacity-0"
      )} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
