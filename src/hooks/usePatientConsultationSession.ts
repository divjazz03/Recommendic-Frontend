import { useState, useCallback, useEffect } from "react";
import { useCall } from "@stream-io/video-react-sdk";

interface ConsultationNote {
  id: string;
  timestamp: string;
  content: string;
  category: "observation" | "diagnosis" | "prescription" | "follow-up";
}

interface PatientSessionStats {
  duration: number;
  consultantJoined: boolean;
  participantCount: number;
}

/**
 * Hook for managing patient consultation sessions
 * Handles session timing, participant tracking, and consultation data
 */
export const usePatientConsultationSession = (callId: string) => {
  const call = useCall();
  const [notes, setNotes] = useState<ConsultationNote[]>([]);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [participantCount, setParticipantCount] = useState(0);
  const [consultantJoined, setConsultantJoined] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  // Track session duration
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Monitor participants and consultant status
  useEffect(() => {
    if (call) {
      const handleParticipantsUpdated = () => {
        const participants = call.state.participants || [];
        setParticipantCount(participants.length + 1); // +1 for self

        // Check if consultant (non-patient) has joined
        const hasConsultant = participants.some(
          (p) =>
            p.userId !== call.currentUserId &&
            p.roles.includes("consultant"),
        );
        setConsultantJoined(hasConsultant);
      };

      call.on("call.updated", handleParticipantsUpdated);
      // Initial check
      handleParticipantsUpdated();

      return () => {
        call.off("call.updated", handleParticipantsUpdated);
      };
    }
  }, [call]);

  const toggleAudio = useCallback(async () => {
    if (call) {
      try {
        await call.microphone.toggle();
        setIsAudioEnabled(!isAudioEnabled);
      } catch (error) {
        console.error("Audio toggle error:", error);
      }
    }
  }, [call, isAudioEnabled]);

  const toggleVideo = useCallback(async () => {
    if (call) {
      try {
        await call.camera.toggle();
        setIsVideoEnabled(!isVideoEnabled);
      } catch (error) {
        console.error("Video toggle error:", error);
      }
    }
  }, [call, isVideoEnabled]);

  const toggleScreenShare = useCallback(async () => {
    if (call) {
      try {
        await call.screenShare.toggle();
      } catch (error) {
        console.error("Screen share error:", error);
      }
    }
  }, [call]);

  const getSessionStats = useCallback((): PatientSessionStats => {
    return {
      duration: sessionDuration,
      consultantJoined,
      participantCount,
    };
  }, [sessionDuration, consultantJoined, participantCount]);

  const endSession = useCallback(async () => {
    if (call) {
      try {
        await call.leave();
      } catch (error) {
        console.error("Error leaving call:", error);
      }
    }
  }, [call]);

  return {
    // State
    notes,
    sessionDuration,
    participantCount,
    consultantJoined,
    isAudioEnabled,
    isVideoEnabled,
    call,
    // Methods
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    getSessionStats,
    endSession,
  };
};

/**
 * Format session duration to readable time format
 */
export const formatSessionDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};
