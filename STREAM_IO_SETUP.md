# Stream IO Integration Setup Guide

## Overview

This guide explains how to set up and configure the Consultation Session UI with Stream IO for video chat functionality and note-taking features.

## Prerequisites

- Stream IO account (create at https://getstream.io/)
- API Key and Secret from Stream IO Dashboard
- Node.js and npm/yarn installed

## Installation

Stream IO React SDK is already installed in the project:

```bash
@stream-io/video-react-sdk: ^1.37.0
```

## Configuration Steps

### 1. Get Stream IO Credentials

1. Go to https://dashboard.getstream.io/
2. Create a new project or use an existing one
3. Navigate to the **API Keys** section
4. Copy your:
   - **API Key** (public key)
   - **API Secret** (keep this secure, use only on backend)

### 2. Environment Variables

Create or update `.env.local` in your project root:

```env
VITE_STREAM_IO_API_KEY=your_api_key_here
VITE_STREAM_API_SECRET=your_api_secret_here
VITE_STREAM_CALL_ID=consultation-session-001
```

### 3. Initialize Stream IO Client

Create a new file `src/lib/streamClient.ts`:

```typescript
import { StreamVideoClient } from "@stream-io/video-react-sdk";

const apiKey = import.meta.env.VITE_STREAM_IO_API_KEY;
const userId = "consultant-user-id"; // Get from auth context
const token = "user-token"; // Generated on backend

const client = new StreamVideoClient({
  apiKey,
  user: {
    id: userId,
    name: "Dr. Name",
    role: "consultant",
  },
  token,
});

export default client;
```

### 4. Token Generation (Backend)

Generate the token on your backend using Stream IO SDK:

```typescript
// Node.js backend example
import { StreamClient } from "stream-chat";

const client = new StreamClient(apiKey, apiSecret);

const token = client.createToken(userId);
```

### 5. Update ConsultantVideoSession Component

The component is already set up but you need to wrap it with the Stream provider:

```typescript
import { StreamVideo } from '@stream-io/video-react-sdk';
import streamClient from '@/lib/streamClient';
import ConsultantVideoSession from '@/components/consultant/consultation/ConsultantVideoSession';

export function ConsultationPage() {
  return (
    <StreamVideo client={streamClient}>
      <ConsultantVideoSession />
    </StreamVideo>
  );
}
```

## Component Features

### 1. Video Conference

- **SpeakerLayout**: Displays the participant speaking
- **Video Controls**: Mute/Unmute audio and video
- **Screen Sharing**: Share consultant's screen with patient
- **Session Timer**: Track consultation duration

### 2. Clinical Notes

- **Note Categories**: Observation, Diagnosis, Prescription, Follow-up
- **Real-time Notes**: Add notes during the consultation
- **Time-stamped**: Each note shows when it was added
- **Searchable**: Filter notes by category

### 3. Prescriptions

- **Medicine Management**: Add and manage medications
- **Dosage Tracking**: Specify dosage, frequency, duration
- **Additional Notes**: Add special instructions for each medicine
- **Export**: Download prescriptions with consultation report

### 4. Patient Information

- **Quick View**: See patient details during consultation
- **Medical History**: Reference patient's medical background
- **Session Details**: Consultation ID, scheduled time, duration

## Usage Example

```typescript
import ConsultantVideoSession from '@/components/consultant/consultation/ConsultantVideoSession';
import { useConsultationSession } from '@/hooks/useConsultationSession';

export function ConsultationPage() {
  const callId = 'consultation-001';
  const session = useConsultationSession(callId);

  // Add a note
  session.addNote('Patient shows signs of anxiety', 'observation');

  // Add a prescription
  session.addPrescription({
    medicineName: 'Aspirin',
    dosage: '500mg',
    frequency: '2 times daily',
    duration: '7 days',
    notes: 'Take with food',
  });

  // Get session statistics
  const stats = session.getSessionStats();
  console.log(`Session duration: ${stats.duration}s`);

  return <ConsultantVideoSession />;
}
```

## Hooks

### useConsultationSession

A custom hook that manages consultation state:

```typescript
const {
  notes, // Array of notes
  prescriptions, // Array of prescriptions
  addNote, // Function to add note
  addPrescription, // Function to add prescription
  isRecording, // Recording status
  toggleRecording, // Start/stop recording
  sessionDuration, // Duration in seconds
  participantCount, // Number of participants
  toggleAudio, // Mute/unmute
  toggleVideo, // Video on/off
  toggleScreenShare, // Screen share toggle
  endSession, // End the call
  generateConsultationReport, // Generate report
} = useConsultationSession(callId);
```

## Styling

The component uses:

- **Tailwind CSS**: For responsive layout
- **Lucide Icons**: For UI icons
- **Stream IO CSS**: For video components

```bash
@stream-io/video-react-sdk/dist/css/styles.css
```

## Security Considerations

1. **API Keys**: Never expose your API Secret in client code
2. **Tokens**: Generate tokens on backend with expiration
3. **User Verification**: Verify user identity before creating calls
4. **Recording Consent**: Get patient consent before recording
5. **Data Privacy**: Ensure HIPAA compliance if handling medical data

## Troubleshooting

### Issue: "Invalid API Key"

- Check `.env.local` file exists and has correct API key
- Verify API key in Stream IO dashboard
- Restart development server after env changes

### Issue: "Call not found"

- Ensure call ID matches between client creation and component
- Check that StreamVideo provider wraps the component

### Issue: "Microphone/Camera not working"

- Check browser permissions for camera and microphone
- Ensure HTTPS in production (Stream IO requires secure context)
- Test in recent browser version

### Issue: "Video not displaying"

- Verify participant has joined the call
- Check browser console for Stream IO errors
- Ensure camera permissions are granted

## Next Steps

1. Implement backend token generation
2. Integrate with patient notification system
3. Add consultation end state with summary
4. Implement report download functionality
5. Add consultation history tracking
6. Integrate with appointment system

## Resources

- [Stream IO Documentation](https://getstream.io/video/docs/)
- [Stream IO React SDK](https://github.com/GetStream/stream-video-js)
- [Stream IO Dashboard](https://dashboard.getstream.io/)
- [Video Conference Best Practices](https://getstream.io/video/docs/react/guides/overview/)

## Support

For issues or questions:

- Check Stream IO documentation
- Review Stream IO GitHub issues
- Contact Stream IO support at support@getstream.io
