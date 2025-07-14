'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { canStartVoiceSession, getMaxSessionDuration, recordVoiceSession } from '@/lib/actions/subscription.actions';
import { vapi } from '@/lib/vapi.sdk';

export interface VoiceSessionState {
  isActive: boolean;
  duration: number; // in seconds
  maxDuration: number; // in seconds
  remainingTime: number; // in seconds
  canStart: boolean;
  minutesRemaining?: number;
  error?: string;
}

export interface VoiceSessionActions {
  startSession: (tutorId: string) => Promise<void>;
  endSession: () => Promise<void>;
  pauseSession: () => void;
  resumeSession: () => void;
}

export const useVoiceSession = (tutorId: string): [VoiceSessionState, VoiceSessionActions] => {
  const [state, setState] = useState<VoiceSessionState>({
    isActive: false,
    duration: 0,
    maxDuration: 0,
    remainingTime: 0,
    canStart: false,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStartRef = useRef<Date | null>(null);
  const isPausedRef = useRef(false);

  // Check if user can start a session
  const checkCanStart = useCallback(async () => {
    try {
      const { canStart, minutesRemaining, reason } = await canStartVoiceSession();
      const maxDuration = await getMaxSessionDuration();
      
      setState(prev => ({
        ...prev,
        canStart,
        minutesRemaining,
        maxDuration: maxDuration * 60, // convert to seconds
        error: reason,
      }));
    } catch (error) {
      console.error('Error checking session permissions:', error);
      setState(prev => ({
        ...prev,
        canStart: false,
        error: 'Unable to check session permissions',
      }));
    }
  }, []);

  // Initialize permissions check
  useEffect(() => {
    checkCanStart();
  }, [checkCanStart]);

  // Timer effect
  useEffect(() => {
    if (state.isActive && !isPausedRef.current) {
      intervalRef.current = setInterval(() => {
        setState(prev => {
          const newDuration = prev.duration + 1;
          const remainingTime = Math.max(0, prev.maxDuration - newDuration);
          
          // Auto-end session if max duration reached
          if (remainingTime <= 0) {
            // Don't call endSession here to avoid circular dependency
            // Just set isActive to false and let the component handle cleanup
            return {
              ...prev,
              isActive: false,
              duration: prev.maxDuration,
              remainingTime: 0,
            };
          }
          
          return {
            ...prev,
            duration: newDuration,
            remainingTime,
          };
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state.isActive]);

  // Auto-end session when timer reaches limit
  useEffect(() => {
    if (!state.isActive && sessionStartRef.current && state.remainingTime === 0 && state.duration > 0) {
      // Use a ref to avoid dependency on endSession
      const cleanup = async () => {
        if (!sessionStartRef.current) return;
        
        const endTime = new Date();
        const durationMinutes = state.duration / 60;
        
        // Record session in database (completely non-blocking)
        if (durationMinutes > 0) {
          recordVoiceSession(
            tutorId,
            durationMinutes,
            sessionStartRef.current,
            endTime
          ).catch(() => {
            // Silently fail
          });
        }
        
        sessionStartRef.current = null;
        isPausedRef.current = false;
        
        // Refresh permissions for next session
        await checkCanStart();
      };
      
      cleanup();
    }
  }, [state.isActive, state.remainingTime, state.duration, tutorId, checkCanStart]);

  // Session warning effects
  useEffect(() => {
    if (state.isActive && state.remainingTime <= 60 && state.remainingTime > 0) {
      // Show warning when 1 minute remaining
      console.warn('Voice session will end in', state.remainingTime, 'seconds');
    }
  }, [state.isActive, state.remainingTime]);

  const startSession = useCallback(async (tutorId: string) => {
    try {
      // Check permissions before starting and get fresh result
      const { canStart, reason } = await canStartVoiceSession();
      
      if (!canStart) {
        throw new Error(reason || 'Cannot start session');
      }

      // Get fresh max duration
      const maxDurationMinutes = await getMaxSessionDuration();
      const maxDurationSeconds = maxDurationMinutes * 60;

      // Don't start VAPI here - let the CompanionComponent handle it
      // Just start our timer
      sessionStartRef.current = new Date();
      isPausedRef.current = false;
      
      setState(prev => ({
        ...prev,
        isActive: true,
        duration: 0,
        maxDuration: maxDurationSeconds,
        remainingTime: maxDurationSeconds,
        error: undefined,
      }));
      
    } catch (error) {
      console.error('Error starting voice session:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to start session',
      }));
    }
  }, [checkCanStart]);

  const endSession = useCallback(async () => {
    try {
      if (!sessionStartRef.current) {
        return;
      }

      // Clear the timer first to stop logging
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Don't stop VAPI here - let the CompanionComponent handle it
      
      const endTime = new Date();
      const durationMinutes = state.duration / 60;
      
      // Record session in database (completely non-blocking)
      if (durationMinutes > 0) {
        recordVoiceSession(
          tutorId,
          durationMinutes,
          sessionStartRef.current,
          endTime
        ).catch(() => {
          // Silently fail - don't clutter console for 0-duration sessions
        });
      }
      
      setState(prev => ({
        ...prev,
        isActive: false,
        duration: 0,
        remainingTime: 0,
      }));
      
      sessionStartRef.current = null;
      isPausedRef.current = false;
      
      // Refresh permissions for next session
      await checkCanStart();
      
    } catch (error) {
      console.error('Error ending voice session:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to end session',
      }));
    }
  }, [state.isActive, state.duration, tutorId, checkCanStart]);

  const pauseSession = useCallback(() => {
    if (state.isActive) {
      isPausedRef.current = true;
      // Don't control VAPI here - let the CompanionComponent handle it
    }
  }, [state.isActive]);

  const resumeSession = useCallback(() => {
    if (state.isActive && isPausedRef.current) {
      isPausedRef.current = false;
      // Don't control VAPI here - let the CompanionComponent handle it
    }
  }, [state.isActive]);

  const actions: VoiceSessionActions = {
    startSession,
    endSession,
    pauseSession,
    resumeSession,
  };

  return [state, actions];
};

// Helper function to format time in MM:SS format
export const formatSessionTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Helper function to get warning color based on remaining time
export const getTimeWarningColor = (remainingTime: number, maxDuration: number): string => {
  const percentage = (remainingTime / maxDuration) * 100;
  
  if (percentage <= 10) return 'text-red-600';
  if (percentage <= 25) return 'text-yellow-600';
  return 'text-green-600';
};