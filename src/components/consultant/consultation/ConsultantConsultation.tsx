import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import ConsultationInitializer from "@/ConsultationInitializer";
import { useUserContext } from "@/context/AuthContext";
import { useGetConsultationById } from "@/lib/actions/generalQueriesAndMutation";
import { useConsultationStore } from "@/store/ConsultationStore";
import { useTokenStore } from "@/store/TokenStore";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import ConsultantConsultationSession from "./ConsultantConsultationSession";

const ConsultantConsultation = () => {
  const params = useParams();
  const consultationId = params.id;
  const { userContext } = useUserContext();
  const { accessToken } = useTokenStore();
  const {
    data: consultationData,
    error: consultationError,
    isPending,
  } = useGetConsultationById(accessToken, consultationId);
  const { addOrUpdateConsultation } = useConsultationStore();

  useEffect(() => {
    if (consultationData?.data) {
      console.log(
        "Setting consultation Data: id: ",
        consultationData.data.consultationId,
      );
      const consultation = consultationData.data;
      addOrUpdateConsultation({
        id: consultation.consultationId,
        data: {
          consultantId: consultation.consultantId,
          id: consultation.consultationId,
          patientId: consultation.patientId,
          startTime: consultation.startTime,
          status: consultation.status,
          consultantJoined: true,
        },
      });
    }
  }, [consultationData?.data, addOrUpdateConsultation]);

  useEffect(() => {
    if (consultationError) {
      toast.error(consultationError.message);
    }
  }, [consultationError]);
  if (consultationError) {
    return <Navigate to={"/"} />;
  }
  if (!consultationId) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Consultation Id Not Present</EmptyTitle>
          <EmptyDescription>
            ConsultationId in query param not present
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft />
            <span>Go Back</span>
          </Button>
        </EmptyContent>
      </Empty>
    );
  }
  if (!userContext.userType) {
    return null;
  }
  if (isPending) {
    return (
      <>
        <Loader />
      </>
    );
  }
  return (
    <>
      <ConsultationInitializer />
      <ConsultantConsultationSession
        callId={consultationData.data.consultationId}
      />
    </>
  );
};

export default ConsultantConsultation;
