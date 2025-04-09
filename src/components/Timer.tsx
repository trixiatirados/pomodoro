'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useSound from 'use-sound';
import { Settings, RotateCcw } from 'lucide-react';

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

const TIMER_MODES = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const COLOR_SCHEMES = {
  default: '#545454',
  nature: '#8C916C',
  mud: '#95714F',
  ocean: '#56768D',
  rose: '#EFBDBD',
  pistachio: '#B6C687'
};

export default function Timer() {
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(TIMER_MODES[mode]);
  const [isActive, setIsActive] = useState(false);
  const [color, setColor] = useState<string>(COLOR_SCHEMES.default);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Load sound effect
  const [playSound] = useSound('/timer-end.mp3', { volume: 0.5 });

  const resetTimer = useCallback(() => {
    setTimeLeft(TIMER_MODES[mode]);
    setIsActive(false);
  }, [mode]);

  const toggleTimer = useCallback(() => {
    setIsActive(prev => !prev);
  }, []);

  useEffect(() => {
    resetTimer();
  }, [mode, resetTimer]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsActive(false);
            playSound();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, playSound]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        toggleTimer();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        resetTimer();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggleTimer, resetTimer]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        {(['pomodoro', 'shortBreak', 'longBreak'] as const).map((timerMode) => (
          <Button
            key={timerMode}
            variant={mode === timerMode ? 'default' : 'outline'}
            onClick={() => setMode(timerMode)}
            className="capitalize w-full sm:w-auto"
            style={{
              backgroundColor: mode === timerMode ? color : 'transparent',
              color: mode === timerMode ? '#fff' : color,
              borderColor: color
            }}
          >
            {timerMode === 'pomodoro' ? 'Pomodoro' : 
             timerMode === 'shortBreak' ? 'Short Break' : 'Long Break'}
          </Button>
        ))}
      </div>

      <div 
        className="text-8xl font-bold tracking-wider"
        style={{ color }}
      >
        {String(minutes).padStart(2, '0')}:
        {String(seconds).padStart(2, '0')}
      </div>

      <div className="flex items-center space-x-4">
        <Button
          size="lg"
          onClick={toggleTimer}
          className="w-32 text-lg"
          style={{
            backgroundColor: color,
            color: '#fff',
          }}
        >
          {isActive ? 'Pause' : 'Start'}
        </Button>

        <Button
          size="icon"
          variant="outline"
          onClick={resetTimer}
          style={{ color, borderColor: color }}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              style={{ color, borderColor: color }}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="mb-4">Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-3">Color Theme</h4>
                <div className="flex space-x-3">
                  {Object.entries(COLOR_SCHEMES).map(([name, value]) => (
                    <button
                      key={name}
                      className={`w-8 h-8 rounded-full transition-transform ${
                        color === value ? 'scale-125 ring-2 ring-offset-2' : ''
                      }`}
                      style={{ backgroundColor: value }}
                      onClick={() => {
                        setColor(value);
                        setIsSettingsOpen(false);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 