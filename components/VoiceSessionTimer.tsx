'use client';

import { useState } from 'react';
import { Play, Pause, Square, Clock, AlertTriangle } from 'lucide-react';
import { formatSessionTime, getTimeWarningColor, VoiceSessionState, VoiceSessionActions } from '@/hooks/useVoiceSession';

interface VoiceSessionTimerProps {
  sessionState: VoiceSessionState;
  sessionActions: VoiceSessionActions;
  onSessionEnd?: () => void;
}

export const VoiceSessionTimer = ({ sessionState, sessionActions, onSessionEnd }: VoiceSessionTimerProps) => {
  const {
    isActive,
    duration,
    maxDuration,
    remainingTime,
    canStart,
    minutesRemaining,
    error,
  } = sessionState;

  const {
    startSession,
    endSession,
    pauseSession,
    resumeSession,
  } = sessionActions;
  
  // Track pause state
  const [isPaused, setIsPaused] = useState(false);

  const handleEnd = async () => {
    await endSession();
    setIsPaused(false);
    onSessionEnd?.();
  };

  const handlePause = () => {
    pauseSession();
    setIsPaused(true);
  };

  const handleResume = () => {
    resumeSession();
    setIsPaused(false);
  };

  const warningColor = getTimeWarningColor(remainingTime, maxDuration);

  // Show error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
          <div>
            <h4 className="font-semibold text-red-800">Session Error</h4>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Show can't start state
  if (!canStart) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <Clock className="w-5 h-5 text-yellow-600 mr-2" />
          <div>
            <h4 className="font-semibold text-yellow-800">Voice Limit Reached</h4>
            <p className="text-sm text-yellow-700">
              You've reached your monthly voice limit. 
              {minutesRemaining !== undefined && (
                <span> You have {minutesRemaining} minutes remaining.</span>
              )}
            </p>
            <a 
              href="/subscription" 
              className="text-sm text-yellow-800 underline hover:text-yellow-900"
            >
              Upgrade your plan
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Timer Display */}
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className={`text-2xl font-mono font-bold ${warningColor}`}>
              {formatSessionTime(duration)}
            </div>
            <div className="text-xs text-gray-500">
              Session Time
            </div>
          </div>
          
          <div className="text-center">
            <div className={`text-lg font-mono ${warningColor}`}>
              {formatSessionTime(remainingTime)}
            </div>
            <div className="text-xs text-gray-500">
              Remaining
            </div>
          </div>
        </div>

        {/* Session Status */}
        <div className="text-center">
          {!canStart && (
            <p className="text-xs text-red-600">
              ❌ Voice limit reached
            </p>
          )}
          {canStart && !isActive && (
            <p className="text-xs text-gray-500">
              ⏳ Ready for session
            </p>
          )}
          {isActive && (
            <div className="flex items-center justify-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-yellow-600' : 'bg-green-600 animate-pulse'}`}></div>
              <span className={`text-xs font-medium ${isPaused ? 'text-yellow-600' : 'text-green-600'}`}>
                {isPaused ? 'Session Paused' : 'Recording Session'}
              </span>
            </div>
          )}
        </div>

        {/* Control Buttons */}
        {isActive && (
          <div className="flex items-center space-x-2">
            {!isPaused ? (
              <button
                onClick={handlePause}
                className="flex items-center justify-center w-8 h-8 bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200 transition-colors"
                title="Pause session"
              >
                <Pause className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleResume}
                className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                title="Resume session"
              >
                <Play className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleEnd}
              className="flex items-center justify-center w-8 h-8 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
              title="End session"
            >
              <Square className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progress</span>
          <span>{Math.round((duration / maxDuration) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-1000 ${
              remainingTime <= 60 ? 'bg-red-500' : 
              remainingTime <= 300 ? 'bg-yellow-500' : 
              'bg-green-500'
            }`}
            style={{ width: `${Math.min(100, (duration / maxDuration) * 100)}%` }}
          />
        </div>
      </div>

      {/* Warnings */}
      {isActive && remainingTime <= 60 && remainingTime > 0 && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          <div className="flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Session will end in {remainingTime} seconds
          </div>
        </div>
      )}
      
      {isActive && remainingTime <= 300 && remainingTime > 60 && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            {Math.ceil(remainingTime / 60)} minutes remaining
          </div>
        </div>
      )}

      {/* Session Info */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Max session: {Math.floor(maxDuration / 60)} minutes</span>
          <span>Monthly remaining: {minutesRemaining || 0} minutes</span>
        </div>
      </div>
    </div>
  );
};