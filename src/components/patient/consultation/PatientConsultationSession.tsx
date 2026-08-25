import {
  AlertCircle,
  CheckCircle,
  Clock,
  Mic,
  MicOff,
  PhoneCall,
  User,
  Video,
  VideoOff,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConsultationResponseData } from "@/types";
import {
  useGetConsultationById,
  useGetStreamToken,
} from "@/lib/actions/generalQueriesAndMutation";
import { useTokenStore } from "@/store/TokenStore";
import { useUserContext } from "@/context/AuthContext";
import { toast } from "sonner";
import {
  StreamVideo,
  StreamCall,
  StreamVideoClient,
  Call,
} from "@stream-io/video-react-sdk";
import {
  initializeStreamClient,
  getOrCreateCall,
  joinCall,
} from "@/lib/streamClient";
import PatientVideoSession from "./PatientVideoSession";
import Loader from "@/components/shared/Loader";

const formatTime = (timeString: string) => {
  const [hours, minutes] = timeString.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

type ConsultationData = {
  id: string;
  patientName: string;
  consultantName: string;
  specialty: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  status: string;
};

const PatientConsultationSession: React.FC<{ callId: string }> = ({
  callId,
}) => {
  const navigate = useNavigate();
  const { accessToken } = useTokenStore();
  const { data: consultationData, error } = useGetConsultationById(
    accessToken,
    callId,
  );
  const [currentTime, setCurrentTime] = useState(new Date());
  const [consultation, setConsultation] = useState<ConsultationData | null>(
    null,
  );

  useEffect(() => {
    if (error) {
      toast.error("Error fetching consultation data:" + error.message);
    }

    setConsultation({
      id: callId,
      patientName: consultationData?.data.patientName || "N/A",
      consultantName: consultationData?.data.consultantName || "N/A",
      specialty: consultationData?.data.consultantData?.specialty || "General",
      scheduledDate: new Date().toISOString()?.split("T")[0],
      scheduledTime:
        consultationData?.data.startTime.split("T")[1].substring(0, 5) || "N/A",
      duration: 30, // minutes
      status: consultationData?.data.status || "N/A", // "ongoing", "missed", "completed"
    });
  }, [consultationData, error, callId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!consultationData && !error) {
    return (
      <div className="flex items-center justify-center h-full">
        {" "}
        Loading consultation details...
      </div>
    );
  }
  if (!consultation) {
    return (
      <div className="flex items-center justify-center h-full">
        {" "}
        Loading consultation details...
      </div>
    );
  }

  function getConsultationStatus(consultation: ConsultationData) {
    const now = currentTime;
    const scheduledDateTime = new Date(
      `${consultation.scheduledDate}T${consultation.scheduledTime}`,
    );
    const endTime = new Date(
      scheduledDateTime.getTime() + (consultation.duration || 30) * 60000,
    );
    const bufferBefore = 15;
    const earlyJoinTime = new Date(
      scheduledDateTime.getTime() - bufferBefore * 60000,
    );

    if (consultation.status === "completed") {
      return {
        type: "completed",
        title: "Consultation Completed",
        message: "This consultation has been completed.",
        icon: CheckCircle,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      };
    }

    if (now > endTime) {
      return {
        type: "expired",
        title: "Consultation Expired",
        message:
          "This consultation time has passed. Please reschedule if you still need medical assistance.",
        icon: XCircle,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      };
    }

    if (now >= earlyJoinTime && now <= endTime) {
      const minutesUntil = Math.floor(
        (scheduledDateTime.getTime() - now.getTime()) / 60000,
      );
      if (minutesUntil > 0) {
        return {
          type: "ready-soon",
          title: "Consultation Starting Soon",
          message: `Your consultation will begin in ${minutesUntil} minute${
            minutesUntil !== 1 ? "s" : ""
          }. Please wait for the consultant to start the session.`,
          icon: Clock,
          color: "text-orange-600",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
          timeUntil: minutesUntil,
        };
      } else {
        return {
          type: "ready-now",
          title: "Consultation Time",
          message:
            "It's time for your consultation. Waiting for the consultant to start the session.",
          icon: Clock,
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        };
      }
    }

    const hoursUntil = Math.floor(
      (scheduledDateTime.getTime() - now.getTime()) / 3600000,
    );
    const minutesUntil = Math.floor(
      ((scheduledDateTime.getTime() - now.getTime()) % 3600000) / 60000,
    );

    let timeMessage = "";
    if (hoursUntil > 0) {
      timeMessage = `${hoursUntil} hour${
        hoursUntil !== 1 ? "s" : ""
      } and ${minutesUntil} minute${minutesUntil !== 1 ? "s" : ""}`;
    } else {
      timeMessage = `${minutesUntil} minute${minutesUntil !== 1 ? "s" : ""}`;
    }

    return {
      type: "not-yet",
      title: "Consultation Not Yet Started",
      message: `Your consultation is scheduled to start in ${timeMessage}. You'll be able to join ${bufferBefore} minutes before the scheduled time.`,
      icon: AlertCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      timeUntil: { hours: hoursUntil, minutes: minutesUntil },
    };
  }

  const status = getConsultationStatus(consultation);

  const StatusIcon = status.icon;
  if (consultation.status === "ONGOING") {
    return <ConsultationStartedView consultationId={consultation.id} />;
  }

  return (
    <div className="h-full">
      <div className="overflow-y-auto h-full p-4 md:p-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Consultation Details
          </h1>
          <p className="text-gray-600">ID: {consultation.id}</p>
        </div>

        {/* Status Card */}
        <div
          className={`${status.bgColor} border-2 ${status.borderColor} rounded-lg p-6 mb-6`}
        >
          <div className="flex items-start gap-4">
            <StatusIcon className={`${status.color} flex-shrink-0`} size={32} />
            <div className="flex-1">
              <h2 className={`text-xl font-semibold ${status.color} mb-2`}>
                {status.title}
              </h2>
              <p className="text-gray-700">{status.message}</p>
            </div>
          </div>
        </div>

        {/* Consultation Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Appointment Information
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Consultant</span>
              <span className="font-medium text-gray-900">
                {consultation?.consultantName}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Specialty</span>
              <span className="font-medium text-gray-900">
                {consultation?.specialty}
              </span>
            </div>
            {
              /* Date and Time formatting */
              consultation.scheduledDate && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium text-gray-900">
                    {formatDate(consultation.scheduledDate)}
                  </span>
                </div>
              )
            }

            {consultation.scheduledTime && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Time</span>
                <span className="font-medium text-gray-900">
                  {formatTime(consultation.scheduledTime)}
                </span>
              </div>
            )}

            <div className="flex justify-between py-2">
              <span className="text-gray-600">Duration</span>
              <span className="font-medium text-gray-900">
                {consultation.duration} minutes
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex gap-3">
            {status.type === "expired" && (
              <button className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Reschedule Consultation
              </button>
            )}

            {(status.type === "not-yet" ||
              status.type === "ready-soon" ||
              status.type === "ready-now") && (
              <button className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                Cancel Appointment
              </button>
            )}
            <button
              onClick={() => navigate("/")}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Need help? Contact support at support@medicalapp.com</p>
        </div>
      </div>
    </div>
  );
};

export default PatientConsultationSession;

type ConsultationPreJoinScreenProps = {
  data: ConsultationResponseData | undefined;
  handleJoinConsultation: () => void;
  isLoading?: boolean;
  error?: string | null;
};

const ConsultationPreJoinScreen: React.FC<ConsultationPreJoinScreenProps> = ({
  data,
  handleJoinConsultation,
  isLoading = false,
  error = null,
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  const consultation = {
    id: data?.consultationId,
    consultantName: data?.consultantName,
    consultantTitle: data?.consultantData?.title || null,
    consultantImage: data?.consultantData?.image || null, // Replace with actual image URL
    scheduledTime: data?.startTime
      ? data.startTime.split("T")[1].substring(0, 5)
      : "",
    duration: 30,
    startedAt: data?.startTime ? new Date(data.startTime) : new Date(),
  };
  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Math.floor(
        (new Date().getTime() - consultation.startedAt.getTime()) / 1000,
      );
      setElapsedTime(elapsed);
    }, 1000);
    return () => clearInterval(timer);
  }, [consultation.startedAt]);

  const formatElapsedTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  return (
    <div className="h-full">
      <div className="h-full p-4 md:p-8 overflow-y-auto">
        {/* Status Banner */}
        <div className="bg-green-500 text-white rounded-lg shadow-lg p-4 mb-6 animate-pulse">
          <div className="flex items-center justify-center gap-3">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <p className="font-semibold text-lg">Consultation is Live</p>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-main-light to-main text-white p-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Your Consultation is Ready
                </h1>
                <p className="text-blue-100">
                  The consultant is waiting for you
                </p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2 flex items-center gap-2">
                <Clock size={20} />
                <span className="font-mono text-lg">
                  {formatElapsedTime(elapsedTime)}
                </span>
              </div>
            </div>
          </div>

          {/* Consultant Info */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-main-light to-main rounded-full flex items-center justify-center text-white shadow-lg">
                {consultation.consultantImage ? (
                  <img
                    src={consultation.consultantImage}
                    alt={consultation.consultantName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User size={48} />
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {consultation.consultantName}
                </h2>
                <p className="text-gray-600 mb-3">
                  {consultation.consultantTitle}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                    Online
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                    Available Now
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Pre-Join Settings */}
          <div className="p-8 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Before You Join
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Audio Control */}
              <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isAudioEnabled ? (
                      <Mic className="text-blue-600" size={24} />
                    ) : (
                      <MicOff className="text-red-600" size={24} />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">Microphone</p>
                      <p className="text-sm text-gray-500">
                        {isAudioEnabled ? "Enabled" : "Disabled"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      isAudioEnabled
                        ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    {isAudioEnabled ? "Mute" : "Unmute"}
                  </button>
                </div>
              </div>

              {/* Video Control */}
              <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isVideoEnabled ? (
                      <Video className="text-blue-600" size={24} />
                    ) : (
                      <VideoOff className="text-red-600" size={24} />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">Camera</p>
                      <p className="text-sm text-gray-500">
                        {isVideoEnabled ? "Enabled" : "Disabled"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      isVideoEnabled
                        ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    {isVideoEnabled ? "Turn Off" : "Turn On"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Join Button Section */}
          <div className="p-8">
            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}
            <button
              onClick={handleJoinConsultation}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-400 text-white py-6 px-8 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100 transition-all duration-200 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <Loader />
                  <span>Joining...</span>
                </>
              ) : (
                <>
                  <PhoneCall size={28} />
                  Join Consultation Now
                </>
              )}
            </button>

            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <button className="py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
                Test Audio & Video
              </button>
              <button className="py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
                Back to Dashboard
              </button>
            </div>
          </div>

          {/* Important Notes */}
          <div className="px-8 pb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">
                Important Reminders:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Ensure you're in a quiet, private location</li>
                <li>• Have your medical records or questions ready</li>
                <li>
                  • Stable internet connection recommended for best experience
                </li>
                <li>
                  • The consultation will last approximately{" "}
                  {consultation.duration} minutes
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Support Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Having trouble joining?{" "}
            <a href="#" className="text-blue-600 hover:underline font-medium">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

const ConsultationStartedView: React.FC<{ consultationId: string }> = ({
  consultationId,
}) => {
  const { accessToken } = useTokenStore();
  const { userContext } = useUserContext();
  const { data: consultation } = useGetConsultationById(
    accessToken,
    consultationId,
  );
  const navigate = useNavigate();

  const [streamClient, setStreamClient] = useState<StreamVideoClient | null>(
    null,
  );
  const [call, setCall] = useState<Call | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch Stream token
  const { data: streamTokenData } = useGetStreamToken(accessToken || "");

  const handleJoinConsultation = async () => {
    try {
      setIsInitializing(true);
      setError(null);

      if (!userContext.user_id || !userContext.userPrincipal?.email) {
        throw new Error("User context not available");
      }

      if (!streamTokenData?.data?.token) {
        throw new Error("Failed to generate Stream token");
      }

      // Initialize Stream client
      const client = await initializeStreamClient(
        userContext.user_id,
        streamTokenData.data.token,
        userContext.user_id,
        "patient",
      );

      setStreamClient(client);

      // Get or create call
      const consultationCall = await getOrCreateCall(
        client,
        consultationId,
        "default",
      );

      // Join the call
      await joinCall(consultationCall);

      setCall(consultationCall);
      setJoined(true);
      setIsInitializing(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to join consultation";
      setError(errorMessage);
      setIsInitializing(false);
      console.error("Join error:", err);
      toast.error(errorMessage);
    }
  };

  if (joined && streamClient && call) {
    return (
      <StreamVideo client={streamClient}>
        <StreamCall call={call}>
          <PatientVideoSession
            session={{
              id: consultationId,
              consultantName: consultation?.data?.consultantName || "N/A",
              consultantSpecialty:
                consultation?.data?.consultantData?.specialty || "N/A",
              chiefComplaint: consultation?.data?.reason || "N/A",
              consultationReason: consultation?.data?.reason || "N/A",
              scheduledTime:
                consultation?.data?.startTime || new Date().toISOString(),
              duration: 30,
            }}
            notes={[]}
            onEndSession={() => {
              setStreamClient(null);
              setCall(null);
              navigate("/");
            }}
          />
        </StreamCall>
      </StreamVideo>
    );
  }

  return (
    <ConsultationPreJoinScreen
      data={consultation?.data}
      handleJoinConsultation={handleJoinConsultation}
      isLoading={isInitializing}
      error={error}
    />
  );
};
