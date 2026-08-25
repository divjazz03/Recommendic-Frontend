import { Call, StreamVideoClient, User } from "@stream-io/video-react-sdk";

/**
 * Initialize Stream IO Video Client
 * This should be called after authentication
 */
export const initializeStreamClient = async (
  userId: string,
  userToken: string,
  userName: string,
  userRole: string = "consultant",
): Promise<StreamVideoClient> => {
  console.log("Initializing Stream Client for ", userId);
  const apiKey = import.meta.env.VITE_STREAM_IO_API_KEY;

  if (!apiKey) {
    throw new Error(
      "VITE_STREAM_IO_API_KEY is not defined in environment variables",
    );
  }

  const user: User = {
    id: userId,
    name: userName,
    custom: {
      role: userRole,
    },
  };

  const client = new StreamVideoClient({
    apiKey,
    user,
    token: userToken,
  });

  return client;
};

/**
 * Create or get a call
 */
export const getOrCreateCall = async (
  client: StreamVideoClient,
  callId: string,
  callType: string = "default",
) => {
  const call = client.call(callType, callId);
  await call.getOrCreate({
    data: {
      custom: {
        callType: "medical_consultation",
        createdAt: new Date().toISOString(),
      },
    },
  });
  return call;
};

/**
 * Join a call
 */
export const joinCall = async (call: Call | null, create: boolean = false) => {
  if (!call) return;
  await call.join({
    create,
  });
};

/**
 * Leave a call
 */
export const leaveCall = async (call: Call) => {
  await call.leave();
};

/**
 * Start recording
 */
export const startRecording = async (call: Call) => {
  try {
    await call.startRecording();
    return true;
  } catch (error) {
    console.error("Failed to start recording:", error);
    return false;
  }
};

/**
 * Stop recording
 */
export const stopRecording = async (call: Call) => {
  try {
    await call.stopRecording();
    return true;
  } catch (error) {
    console.error("Failed to stop recording:", error);
    return false;
  }
};

/**
 * Send a message in the call
 */
export const sendMessage = async (call: Call, message: string) => {
  try {
    await call.sendCustomEvent({
      type: "message",
      data: {
        text: message,
        timestamp: new Date().toISOString(),
      },
    });
    return true;
  } catch (error) {
    console.error("Failed to send message:", error);
    return false;
  }
};

/**
 * Update call settings
 */
export const updateCallSettings = async (
  call: Call,
  settings: {
    audio?: boolean;
    video?: boolean;
    screenShare?: boolean;
  },
) => {
  try {
    if (settings.audio !== undefined) {
      if (settings.audio) {
        await call.microphone.enable();
      } else {
        await call.microphone.disable();
      }
    }

    if (settings.video !== undefined) {
      if (settings.video) {
        await call.camera.enable();
      } else {
        await call.camera.disable();
      }
    }

    if (settings.screenShare !== undefined) {
      if (settings.screenShare) {
        await call.screenShare.enable();
      } else {
        await call.screenShare.disable();
      }
    }

    return true;
  } catch (error) {
    console.error("Failed to update call settings:", error);
    return false;
  }
};

/**
 * Get call state
 */
export const getCallState = (call: Call) => {
  return {
    isRecording: call.state.recording,
    participantCount: call.state.participants.length + 1, // +1 for self
    participants: call.state.participants,
    callState: call.state.callingState,
    createdAt: call.state.createdAt,
  };
};

/**
 * End call for all participants
 */
export const endCallForAll = async (call: Call) => {
  try {
    await call.endCall();
    return true;
  } catch (error) {
    console.error("Failed to end call:", error);
    return false;
  }
};

/**
 * Mute all participants except self
 */
export const muteOthers = async (call: Call) => {
  try {
    await call.updateCallMembers({
      update_members: [{ user_id: "*" }],
    });
    return true;
  } catch (error) {
    console.error("Failed to mute others:", error);
    return false;
  }
};

/**
 * Unmute all participants
 */
export const unmuteAll = async (call: any) => {
  try {
    await call.updateCallMembers({
      update_members: {
        "*": { audio: true },
      },
    });
    return true;
  } catch (error) {
    console.error("Failed to unmute all:", error);
    return false;
  }
};
