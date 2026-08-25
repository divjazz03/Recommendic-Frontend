import { consultationSSE } from "@/lib/sse/ConsultationSSE";
import { useTokenStore } from "@/store/TokenStore";
import { useEffect } from "react";

export function useConsultationSSE() {
  const { accessToken } = useTokenStore();

  useEffect(() => {
    if (!accessToken) return;
    consultationSSE.connect(accessToken);

    return () => consultationSSE.disconnect();
  }, [accessToken]);
}
