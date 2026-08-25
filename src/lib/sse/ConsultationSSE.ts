// consultation-sse.ts

import { useConsultationStore } from "@/store/ConsultationStore";
import { toast } from "sonner";

class ConsultationSSE {
  private source: EventSource | null = null;

  connect(token: string) {
    if (this.source) {
      return;
    }

    this.source = new EventSource(
      import.meta.env.VITE_BACKEND_BASE_URL +
        `/sse/consultations/subscribe?token=${token}`,
    );

    this.source.addEventListener("CONSULTATION_STARTED", (event) => {
      const consultation = JSON.parse(event.data);
      toast.info(
        "New consultation started with consultant " +
          consultation.consultantName,
      );
      const store = useConsultationStore.getState();
      store.addOrUpdateConsultation(consultation);
    });

    this.source.addEventListener("PATIENT_JOINED", (event) => {
      const { consultationId } = JSON.parse(event.data);
      toast.info("Patient joined the consultation " + consultationId);
      const store = useConsultationStore.getState();
      store.addOrUpdateConsultation({
        id: consultationId,
        data: {
          patientJoined: true,
        },
      });
    });

    this.source.addEventListener("CONSULTATION_ENDED", (event) => {
      const { consultationId } = JSON.parse(event.data);
      toast.info("Consultation ended");
      const store = useConsultationStore.getState();
      store.removeConsultation(consultationId);
    });

    this.source.onerror = (error) => {
      console.error(error);
    };
  }

  disconnect() {
    this.source?.close();
    this.source = null;
  }
}

export const consultationSSE = new ConsultationSSE();
