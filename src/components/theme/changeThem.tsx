'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export function ModeChange() {
  const { theme, setTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = React.useState(theme);

  // Listen for theme changes and update the current theme state
  React.useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <div className="m-3 flex justify-center items-center space-x-2 border p-2 text-xs rounded-lg lg:hidden dark:text-slate-500 ml-48 w-[200px] bg-gray-200">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="text-sm w-[170px]">Change Theme</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={() => {
            setTheme('light');
            setCurrentTheme('light');
          }}
          className={currentTheme === 'light' ? 'font-bold' : ''}
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setTheme('dark');
            setCurrentTheme('dark');
          }}
          className={currentTheme === 'dark' ? 'font-bold' : ''}
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setTheme('system');
            setCurrentTheme('system');
          }}
          className={currentTheme === 'system' ? 'font-bold' : ''}
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
