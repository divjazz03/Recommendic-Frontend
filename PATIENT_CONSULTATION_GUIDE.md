# Patient Consultation Session UI Implementation Guide

## Overview

This guide explains the implementation of the Patient Consultation Session UI for video consultations with healthcare consultants using Stream IO.

## Architecture

### Components

#### 1. **PatientVideoSession** (`src/components/patient/consultation/PatientVideoSession.tsx`)

The main video session component that displays:

- Video call interface with SpeakerLayout
- Real-time video controls (mic, camera, screen share)
- Session timer
- Consultant information badge
- Session details panel (collapsible)
- Consultation notes viewer (read-only for patients)
- End session confirmation modal

**Key Features:**

- Responsive design for desktop and mobile
- Real-time session duration tracking
- Live consultant status indicator
- Medical consultation context

#### 2. **PatientConsultation** (`src/components/patient/consultation/PatientConsultation.tsx`)

Wrapper component that handles:

- Stream IO client initialization
- Token generation and management
- Call creation and joining
- Stream provider setup
- Pre-join screen and status checking
- Consultation data fetching

**Key Features:**

- Automatic Stream IO setup
- Pre-join device testing
- Consultation status management (waiting, ready, expired)
- Error handling and recovery

### Hooks

#### **usePatientConsultationSession** (`src/hooks/usePatientConsultationSession.ts`)

Custom hook for managing patient-specific consultation state:

- Session duration tracking
- Participant monitoring
- Consultant join status detection
- Audio/Video toggle management
- Helper utilities for session formatting

**Methods:**

```typescript
{
  // State
  notes: ConsultationNote[]
  sessionDuration: number
  participantCount: number
  consultantJoined: boolean
  isAudioEnabled: boolean
  isVideoEnabled: boolean

  // Methods
  toggleAudio(): Promise<void>
  toggleVideo(): Promise<void>
  toggleScreenShare(): Promise<void>
  getSessionStats(): PatientSessionStats
  endSession(): Promise<void>
}
```

## Integration Steps

### Step 1: Environment Variables

Ensure your `.env.local` has:

```env
VITE_STREAM_IO_API_KEY=your_api_key_here
VITE_STREAM_API_SECRET=your_api_secret_here
```

### Step 2: Backend Setup

Generate Stream IO tokens on your backend:

```typescript
// Example: Node.js/Express backend
import { StreamClient } from "stream-chat";

const streamClient = new StreamClient(apiKey, apiSecret);
const token = streamClient.createToken(userId);

// Return token in consultation API response
```

### Step 3: Create Consultation Page

```typescript
import PatientConsultation from '@/components/patient/consultation/PatientConsultation';

const ConsultationPage = () => {
  const { callId } = useParams();

  const consultationData: ConsultationJoinData = {
    callId,
    apiKey: import.meta.env.VITE_STREAM_IO_API_KEY,
    token: "", // Will be fetched by component
    user: {
      id: userId,
      name: userPrincipal.name
    }
  };

  return <PatientConsultation data={consultationData} />;
};
```

### Step 4: Add Route

```typescript
// In your router configuration
{
  path: "/consultation/:callId",
  element: <PatientConsultationPage />
}
```

## Component Usage Examples

### Basic Usage

```typescript
import PatientVideoSession from '@/components/patient/consultation/PatientVideoSession';

const MyConsultation = () => {
  return (
    <PatientVideoSession
      session={{
        id: "consultation-123",
        consultantName: "Dr. John Doe",
        consultantSpecialty: "Cardiologist",
        chiefComplaint: "Chest Pain",
        consultationReason: "Regular checkup",
        scheduledTime: "2024-01-15 2:00 PM",
        duration: 30,
        symptoms: ["Chest pain", "Shortness of breath"]
      }}
      notes={[]}
      onEndSession={() => console.log('Session ended')}
    />
  );
};
```

### With Hook Integration

```typescript
import { usePatientConsultationSession } from '@/hooks/usePatientConsultationSession';

const ConsultationWithHook = () => {
  const {
    sessionDuration,
    consultantJoined,
    isAudioEnabled,
    toggleAudio,
    toggleVideo,
    endSession
  } = usePatientConsultationSession(callId);

  return (
    <div>
      <p>Session Duration: {sessionDuration}s</p>
      <p>Consultant Joined: {consultantJoined ? 'Yes' : 'No'}</p>
      <button onClick={toggleAudio}>
        {isAudioEnabled ? 'Mute' : 'Unmute'}
      </button>
    </div>
  );
};
```

## Data Flow

```
┌─────────────────┐
│  Consultation   │
│     Page        │
└────────┬────────┘
         │
         ├─→ useGetStreamToken (fetch Stream token)
         │
         ├─→ initializeStreamClient (create Stream client)
         │
         ├─→ getOrCreateCall (get or create Stream call)
         │
         └─→ joinCall (join the video call)
               │
               └─→ PatientConsultation (wrapper)
                     │
                     └─→ StreamVideo Provider
                           │
                           └─→ StreamCall Provider
                                 │
                                 └─→ PatientVideoSession (UI)
```

## State Management

### Session States

1. **Waiting**: Consultation scheduled but not yet available
2. **Ready**: Consultant available, patient can join
3. **Active**: Patient and consultant in call
4. **Completed**: Consultation session ended
5. **Expired**: Consultation time passed

### Media States

- Audio: Enabled/Disabled (tracked by Stream SDK)
- Video: Enabled/Disabled (tracked by Stream SDK)
- Screen Share: Active/Inactive (tracked by Stream SDK)

## Key Features

### 1. Video Conference

- Real-time video streaming with SpeakerLayout
- Automatic speaker highlighting
- Multi-participant support

### 2. Session Management

- Real-time duration tracking
- Participant count monitoring
- Consultant join detection
- Graceful session ending

### 3. Device Controls

- Microphone toggle with status feedback
- Camera toggle with status feedback
- Screen sharing capability
- Visual indicators for disabled devices

### 4. Session Information

- Expandable consultation details
- Chief complaint and symptoms display
- Scheduled time and duration
- Consultant specialty information

### 5. Notes Viewer

- Real-time note updates from consultant
- Color-coded note categories
- Timestamped notes
- Searchable notes list

### 6. User Experience

- Responsive design (mobile and desktop)
- Confirmation modals for destructive actions
- Loading states and error handling
- Professional medical context styling

## Error Handling

The components handle various error scenarios:

```typescript
// Token generation errors
if (!streamTokenData?.token) {
  throw new Error("Failed to generate Stream token");
}

// Client initialization errors
if (!apiKey) {
  throw new Error("Stream API key not configured");
}

// Network/connection errors
try {
  await call.join({ create: false });
} catch (error) {
  // Handled with user-friendly error message
}
```

## Performance Optimizations

1. **Lazy Loading**: Components load only when needed
2. **Memoization**: Session data cached for re-renders
3. **Event Cleanup**: Proper listener cleanup in useEffect
4. **Responsive Images**: Avatar placeholders with initials
5. **Efficient Rendering**: Conditional rendering for UI elements

## Accessibility Features

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Color contrast compliance
- Clear status indicators with text labels

## Customization

### Styling

- Uses Tailwind CSS for styling
- Can be customized via CSS classes
- Responsive breakpoints: `md:` and `lg:`

### Theming

Modify color scheme by updating Tailwind classes:

```typescript
// Example: Change primary color from indigo to blue
className="bg-indigo-600" → className="bg-blue-600"
```

### UI Elements

Each component can be customized independently:

- SessionTimer format
- Note category colors
- Button styles
- Layout arrangements

## Testing

### Mock Data Example

```typescript
const mockConsultation = {
  id: "test-001",
  consultantName: "Dr. Test User",
  consultantSpecialty: "Internal Medicine",
  chiefComplaint: "Routine Checkup",
  consultationReason: "Annual physical",
  scheduledTime: new Date().toISOString(),
  duration: 30,
  symptoms: ["None reported"],
};
```

## Troubleshooting

### Common Issues

1. **"VITE_STREAM_IO_API_KEY is not defined"**
   - Solution: Add API key to `.env.local`

2. **Failed to join call**
   - Check network connection
   - Verify Stream token is valid
   - Confirm consultation ID matches

3. **Video/Audio not working**
   - Check browser permissions
   - Test device availability
   - Check bandwidth

4. **Consultant not appearing**
   - Wait for consultant to join
   - Check participant count in hook
   - Verify user roles are correct

## Security Considerations

1. **Token Management**: Tokens are generated server-side for security
2. **User Validation**: User context verified before initialization
3. **Call Access**: Only authenticated users can access calls
4. **Data Privacy**: Consultation data encrypted in transit

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS 14.5+)
- Mobile browsers: Full support with mobile-optimized UI

## Dependencies

Required packages (already installed):

- `@stream-io/video-react-sdk`: ^1.37.0
- `react`: ^18.0.0
- `react-dom`: ^18.0.0
- `lucide-react`: For icons
- `tailwindcss`: For styling

## Future Enhancements

Possible improvements:

1. Recording and playback
2. Chat messaging during consultation
3. Document sharing
4. Medical records viewer
5. Prescription management
6. Appointment follow-up scheduling
7. Consultation history
8. Analytics and reporting

## Support

For issues or questions:

1. Check the troubleshooting section
2. Review Stream IO documentation: https://getstream.io/video/docs/
3. Check browser console for error messages
4. Verify all dependencies are installed
