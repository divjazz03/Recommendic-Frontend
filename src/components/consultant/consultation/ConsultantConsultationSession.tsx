import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTokenStore } from "@/store/TokenStore";
import {
  useGetConsultationById,
  useGetStreamToken,
} from "@/lib/actions/generalQueriesAndMutation";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Call,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-sdk";
import ConsultantVideoSession from "./ConsultantVideoSession";
import { useUserContext } from "@/context/AuthContext";
import {
  getOrCreateCall,
  initializeStreamClient,
  joinCall,
} from "@/lib/streamClient";
import { useConsultationStore } from "@/store/ConsultationStore";
import Loader from "@/components/shared/Loader";
import ConsultantWaitingScreen from "./ConsultantWaitingScreen";

const ConsultantConsultationSession: React.FC<{ callId: string }> = ({
  callId,
}) => {
  const { accessToken } = useTokenStore();
  const {
    data: consultation,
    error: consultationError,
    isPending: isLoadingConsultationInfo,
  } = useGetConsultationById(accessToken, callId); // Fetch consultation details if needed
  const {
    data: streamToken,
    error: streamTokenError,
    isPending: isGettingStreamToken,
  } = useGetStreamToken(accessToken);
  const { userContext } = useUserContext();
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const patientJoined = useConsultationStore(
    (state) => state.consultations[callId]?.patientJoined ?? false,
  );

  console.log("Patient Joined: ", patientJoined);
  // Initialize Stream IO client
  useEffect(() => {
    if (client || !userContext?.user_id) return;

    let localStreamClient: StreamVideoClient | null = null;

    const setupStreamClient = async () => {
      try {
        setLoading(true);
        if (!streamToken?.data) {
          console.error("Stream token not availaible");
          return;
        }
        const userToken = streamToken.data.token;
        localStreamClient = await initializeStreamClient(
          userContext.user_id!,
          userToken,
          userContext.userPrincipal?.email || "Unknown",
          "consultant",
        );

        setClient(localStreamClient);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        console.error("Failed to initialize consultation:", err);
      } finally {
        setLoading(false);
      }
    };

    setupStreamClient();

    // return () => {
    //   localStreamClient?.disconnectUser().catch((err) => {
    //     console.error("Failed to disconnect user: " + err);
    //   });
    // };
  }, [
    streamToken,
    userContext.user_id,
    client,
    userContext.userPrincipal?.email,
  ]);

  // Initialize call
  useEffect(() => {
    if (!client) {
      console.error("No client yet");
      return;
    }
    if (call) {
      return;
    }
    let callLocal: Call | null = null;
    const setupCall = async () => {
      try {
        console.log("setting up call");
        callLocal = await getOrCreateCall(client, callId);
        // 4. Join call
        await joinCall(callLocal, true);
        setCall(callLocal);
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
      }
    };

    setupCall().catch((err) => console.error(err));
    // return () => {
    //   callLocal?.leave().catch((err) => {
    //     console.error("Failed to leave call: " + err);
    //   });
    // };
  }, [callId, client, call]);

  if (isGettingStreamToken || loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <div className="w-12 h-12 border-4 border-gray-600 border-t-indigo-600 rounded-full"></div>
          </div>
          <p className="text-gray-600">Initializing consultation...</p>
        </div>
      </div>
    );
  }
  if (isLoadingConsultationInfo) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">Loading consultation details...</p>
      </div>
    );
  }
  if (error || streamTokenError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 font-semibold mb-2">Error</h2>
          <p className="text-red-700 text-sm">
            {error || streamTokenError?.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!client || !call) {
    return <Loader />;
  }

  if (consultationError || !consultation) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Failed to load consultation details</EmptyTitle>
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
  return (
    <>
      {!patientJoined ? (
        <ConsultantWaitingScreen data={consultation.data} />
      ) : (
        <StreamVideo client={client}>
          <StreamCall call={call}>
            <ConsultantVideoSession
              data={consultation.data}
              onEndSession={() => {
                setClient(null);
                setCall(null);
              }}
            />
          </StreamCall>
        </StreamVideo>
      )}
    </>
  );
};

export default ConsultantConsultationSession;
