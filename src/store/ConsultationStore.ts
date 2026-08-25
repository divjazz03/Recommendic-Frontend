import { create } from "zustand";

interface Consultation {
  id: string;
  consultantId: string;
  patientId: string;
  startTime: string;
  endTime?: string;
  status: string;
  startedAt?: string;
  endedAt?: string;
  patientJoined?: boolean;
  consultantJoined: boolean;
}
type UpsertConsultation = {
  id: string;
  data: Partial<Consultation>;
};

interface ConsultationState {
  consultations: Record<string, Partial<Consultation>>;
  addOrUpdateConsultation: (data: UpsertConsultation) => void;
  removeConsultation: (callId: string) => void;
}

export const useConsultationStore = create<ConsultationState>((set) => ({
  consultations: {},
  addOrUpdateConsultation: (data) =>
    set((state) => ({
      consultations: { ...state.consultations, [data.id]: data.data },
    })),
  removeConsultation: (callId) =>
    set((state) => {
      const newConsultations = { ...state.consultations };
      delete newConsultations[callId];
      return { consultations: newConsultations };
    }),
}));
