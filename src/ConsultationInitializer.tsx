import { useConsultationSSE } from "./hooks/useConsultationSSE";

function ConsultationInitializer() {
  useConsultationSSE();
  return null;
}

export default ConsultationInitializer;
