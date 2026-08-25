import { useState, useCallback, useEffect } from "react";
import { useCall } from "@stream-io/video-react-sdk";
import { useEndConsultation } from "@/lib/actions/generalQueriesAndMutation";
import { useTokenStore } from "@/store/TokenStore";
import { toast } from "sonner";

interface ConsultationNote {
  id: string;
  timestamp: string;
  content: string;
  category: "observation" | "diagnosis" | "prescription" | "follow-up";
}

interface PrescriptionItem {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes: string;
}

interface SessionStats {
  duration: number;
  notesCount: number;
  prescriptionsCount: number;
  participantsCount: number;
}

export const useConsultationSession = (callId: string) => {
  const call = useCall();
  const { accessToken } = useTokenStore();
  const { mutateAsync: endConsultation } = useEndConsultation(accessToken);
  const [notes, setNotes] = useState<ConsultationNote[]>([]);
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [participantCount, setParticipantCount] = useState(0);
  const [showEndSessionConfirmation, setShowEndSessionConfirmation] =
    useState(false);
  const [isSessionOngoing, setIsSessionOngoing] = useState(true);

  // Track session duration
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Monitor participants
  useEffect(() => {
    if (call) {
      const handleParticipantsUpdated = () => {
        setParticipantCount(call.state.participants.length + 1); // +1 for self
      };

      call.on("call.updated", handleParticipantsUpdated);
      return () => {
        call.off("call.updated", handleParticipantsUpdated);
      };
    }
  }, [call]);

  // Monitor Session
  useEffect(() => {
    if (call) {
      const handleEndCall = () => {
        setIsSessionOngoing(false);
        toast.info("Call Ended");
      };
      call.on("call.session_ended", handleEndCall);
    }
  }, [call]);
  const addNote = useCallback(
    (content: string, category: ConsultationNote["category"]) => {
      const newNote: ConsultationNote = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        content,
        category,
      };

      setNotes((prev) => [...prev, newNote]);
      return newNote;
    },
    [],
  );

  const addPrescription = useCallback(
    (prescription: Omit<PrescriptionItem, "id">) => {
      const newPrescription: PrescriptionItem = {
        ...prescription,
        id: Date.now().toString(),
      };

      setPrescriptions((prev) => [...prev, newPrescription]);
      return newPrescription;
    },
    [],
  );

  const removeNote = useCallback((noteId: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId));
  }, []);

  const removePrescription = useCallback((prescriptionId: string) => {
    setPrescriptions((prev) =>
      prev.filter((prescription) => prescription.id !== prescriptionId),
    );
  }, []);

  const toggleRecording = useCallback(async () => {
    if (call) {
      try {
        if (!isRecording) {
          await call.startRecording();
          setIsRecording(true);
        } else {
          await call.stopRecording();
          setIsRecording(false);
        }
      } catch (error) {
        console.error("Recording toggle error:", error);
      }
    }
  }, [call, isRecording]);

  const getSessionStats = useCallback((): SessionStats => {
    return {
      duration: sessionDuration,
      notesCount: notes.length,
      prescriptionsCount: prescriptions.length,
      participantsCount: participantCount,
    };
  }, [sessionDuration, notes.length, prescriptions.length, participantCount]);

  const generateConsultationReport = useCallback(() => {
    return {
      callId,
      notes,
      prescriptions,
      stats: getSessionStats(),
      generatedAt: new Date().toISOString(),
    };
  }, [callId, notes, prescriptions, getSessionStats]);

  const toggleAudio = useCallback(async () => {
    if (call) {
      try {
        await call.microphone.toggle();
      } catch (error) {
        console.error("Audio toggle error:", error);
      }
    }
  }, [call]);

  const toggleVideo = useCallback(async () => {
    if (call) {
      try {
        await call.camera.toggle();
      } catch (error) {
        console.error("Video toggle error:", error);
      }
    }
  }, [call]);

  const toggleScreenShare = useCallback(async () => {
    if (call) {
      try {
        await call.screenShare.toggle();
      } catch (error) {
        console.error("Screen share toggle error:", error);
      }
    }
  }, [call]);

  const endSession = useCallback(async () => {
    if (call) {
      try {
        await endConsultation(callId);
        await call.stopRecording(); // Ensure recording is stopped
        await call.screenShare.dispose(); // Ensure screen share is stopped
        await call.camera.dispose(); // Ensure camera is stopped
        await call.leave();
      } catch (error) {
        console.error("End session error:", error);
      }
    }
  }, [call, callId, endConsultation]);

  return {
    notes,
    prescriptions,
    addNote,
    addPrescription,
    removeNote,
    removePrescription,
    isRecording,
    toggleRecording,
    sessionDuration,
    participantCount,
    getSessionStats,
    generateConsultationReport,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    endSession,
    showEndSessionConfirmation,
    setShowEndSessionConfirmation,
    isSessionOngoing,
    setIsSessionOngoing,
  };
};
