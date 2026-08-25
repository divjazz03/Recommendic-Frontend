# Consultation Session UI Implementation

## Overview

The Consultation Session UI is a comprehensive video conferencing and clinical note-taking system built for medical consultants using Stream IO for real-time video communication and React for the frontend.

## Architecture

### Components

#### 1. **ConsultantVideoSession** (Main Component)

Located at: `src/components/consultant/consultation/ConsultantVideoSession.tsx`

The main component that combines all consultation features:

- Video conference display
- Clinical notes interface
- Prescription management
- Patient information sidebar
- Session controls and download options

**Key Features:**

- Real-time video streaming via Stream IO
- Session timer with live tracking
- Professional medical UI layout
- Responsive design for different screen sizes

#### 2. **ConsultationVideoView**

Displays the video conference with controls:

- Video feed using Stream IO's `SpeakerLayout`
- Audio/Video toggle buttons
- Screen sharing capability
- Call end button
- Session timer display
- Patient name badge

#### 3. **SessionTimer**

Real-time consultation duration tracker:

- Displays hours:minutes:seconds format
- Updates every second
- Shows formatted output (e.g., "2m 34s")

#### 4. **NotesSection**

Clinical note-taking interface:

- Add notes with different categories (Observation, Diagnosis, Prescription, Follow-up)
- Timestamp each note automatically
- Color-coded categories
- Scrollable notes list
- Quick add functionality

#### 5. **PrescriptionsSection**

Prescription management interface:

- Add medicine details (name, dosage, frequency, duration)
- Additional notes for each prescription
- Collapsible interface to save space
- Display all prescriptions in an organized format

#### 6. **PatientInfoPanel**

Quick reference panel for patient data:

- Patient name, age, and gender
- Chief complaint
- Medical history list
- Static display during consultation

### Hooks

#### **useConsultationSession**

Located at: `src/hooks/useConsultationSession.ts`

A comprehensive hook for managing consultation state:

```typescript
const {
  notes, // ConsultationNote[]
  prescriptions, // PrescriptionItem[]
  addNote, // (content, category) => ConsultationNote
  addPrescription, // (prescription) => PrescriptionItem
  removeNote, // (noteId) => void
  removePrescription, // (prescriptionId) => void
  isRecording, // boolean
  toggleRecording, // () => Promise<void>
  sessionDuration, // number (seconds)
  participantCount, // number
  getSessionStats, // () => SessionStats
  generateConsultationReport, // () => ConsultationReport
  toggleAudio, // () => Promise<void>
  toggleVideo, // () => Promise<void>
  toggleScreenShare, // () => Promise<void>
  endSession, // () => Promise<void>
} = useConsultationSession(callId);
```

### Utilities

#### **streamClient.ts**

Located at: `src/lib/streamClient.ts`

Stream IO client initialization and management:

- `initializeStreamClient()` - Set up Stream IO with user credentials
- `getOrCreateCall()` - Create or get an existing call
- `joinCall()` - Join a consultation call
- `leaveCall()` - Leave the call
- `startRecording()` / `stopRecording()` - Manage call recording
- `toggleAudio()` / `toggleVideo()` / `toggleScreenShare()` - Media controls
- `updateCallSettings()` - Batch update call settings
- `muteOthers()` / `unmuteAll()` - Participant controls
- `endCallForAll()` - End session for all participants

#### **consultationUtils.ts**

Located at: `src/lib/consultationUtils.ts`

Report generation and export utilities:

- `generateTextReport()` - Plain text consultation report
- `generateHtmlReport()` - Formatted HTML report
- `downloadReport()` - Download report as file
- `downloadPDFReport()` - Export as PDF (requires html2pdf library)
- `sendReportToServer()` - Send report to backend API

### Types

Located at: `src/types/index.ts`

```typescript
interface ConsultationNote {
  id: string;
  timestamp: string;
  content: string;
  category: "observation" | "diagnosis" | "prescription" | "follow-up";
}

interface PrescriptionItem {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes: string;
}

interface ConsultationSession {
  id: string;
  patientId: string;
  consultantId: string;
  patientName: string;
  consultantName: string;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  // ... more fields
}
```

## File Structure

```
src/
├── components/
│   └── consultant/
│       └── consultation/
│           ├── ConsultantConsultation.tsx    (Waiting screen)
│           └── ConsultantVideoSession.tsx    (Main video session)
├── hooks/
│   └── useConsultationSession.ts             (Session state management)
├── lib/
│   ├── streamClient.ts                       (Stream IO utilities)
│   └── consultationUtils.ts                  (Report generation)
└── types/
    └── index.ts                              (TypeScript interfaces)
```

## Setup Instructions

### 1. Install Dependencies

Stream IO React SDK is already installed:

```bash
npm install @stream-io/video-react-sdk@^1.37.0
```

### 2. Configure Environment Variables

Create `.env.local`:

```env
VITE_STREAM_IO_API_KEY=your_api_key_here
VITE_STREAM_API_SECRET=your_api_secret_here
```

### 3. Initialize Stream IO Client

```typescript
import { StreamVideo } from '@stream-io/video-react-sdk';
import { initializeStreamClient } from '@/lib/streamClient';
import ConsultantVideoSession from '@/components/consultant/consultation/ConsultantVideoSession';

export function ConsultationPage() {
  const [client, setClient] = useState<StreamVideoClient | null>(null);

  useEffect(() => {
    const setupStreamClient = async () => {
      const streamClient = await initializeStreamClient(
        consultantId,
        userToken,
        consultantName,
        'consultant'
      );
      setClient(streamClient);
    };

    setupStreamClient();
  }, []);

  if (!client) return <LoadingSpinner />;

  return (
    <StreamVideo client={client}>
      <ConsultantVideoSession />
    </StreamVideo>
  );
}
```

### 4. (Optional) PDF Export Setup

To enable PDF report downloads, install html2pdf:

```bash
npm install html2pdf.js
```

Then add to your HTML:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
```

## Usage Examples

### Basic Implementation

```typescript
import ConsultantVideoSession from '@/components/consultant/consultation/ConsultantVideoSession';

export function ConsultationPage() {
  return <ConsultantVideoSession />;
}
```

### Using the Consultation Hook

```typescript
import { useConsultationSession } from '@/hooks/useConsultationSession';

export function MyConsultationApp() {
  const session = useConsultationSession('consultation-001');

  const handleAddObservation = () => {
    session.addNote('Patient appears anxious', 'observation');
  };

  const handlePrescribeMedicine = () => {
    session.addPrescription({
      medicineName: 'Aspirin',
      dosage: '500mg',
      frequency: 'Twice daily',
      duration: '7 days',
      notes: 'Take with food',
    });
  };

  const handleDownloadReport = () => {
    const report = session.generateConsultationReport();
    console.log(report);
  };

  return (
    <div>
      <button onClick={handleAddObservation}>Add Observation</button>
      <button onClick={handlePrescribeMedicine}>Prescribe Medicine</button>
      <button onClick={handleDownloadReport}>Download Report</button>
      <p>Notes: {session.notes.length}</p>
      <p>Prescriptions: {session.prescriptions.length}</p>
      <p>Duration: {Math.floor(session.sessionDuration / 60)}m</p>
    </div>
  );
}
```

### Generating Reports

```typescript
import {
  generateTextReport,
  generateHtmlReport,
  downloadReport,
  downloadPDFReport,
} from '@/lib/consultationUtils';

const consultationData = {
  callId: 'cons-001',
  consultantName: 'Dr. Smith',
  patientName: 'John Doe',
  consultationDate: '2024-05-25',
  consultationTime: '14:30',
  duration: 1800, // 30 minutes
  chiefComplaint: 'Follow-up on cardiac health',
  notes: [...],
  prescriptions: [...],
};

// Download as text
const textReport = generateTextReport(consultationData);
downloadReport(textReport, 'consultation-report.txt', 'text/plain');

// Download as HTML
const htmlReport = generateHtmlReport(consultationData);
downloadReport(htmlReport, 'consultation-report.html', 'text/html');

// Download as PDF (requires html2pdf)
downloadPDFReport(consultationData, 'consultation-report.pdf');

// Send to server
await sendReportToServer(
  consultationData,
  '/api/consultations/save-report'
);
```

## Features

### Video Conference

- ✅ Real-time video/audio streaming
- ✅ Speaker layout (focuses on active speaker)
- ✅ Mute/unmute audio
- ✅ Start/stop video
- ✅ Screen sharing
- ✅ Call recording
- ✅ Session timer
- ✅ Participant count

### Clinical Notes

- ✅ Add timestamped notes
- ✅ Categorize notes (Observation, Diagnosis, Prescription, Follow-up)
- ✅ Color-coded categories
- ✅ Remove notes
- ✅ Search/filter capability (extensible)

### Prescriptions

- ✅ Add medication details
- ✅ Specify dosage and frequency
- ✅ Add special instructions
- ✅ Remove prescriptions
- ✅ Collapsible interface

### Patient Information

- ✅ Quick reference panel
- ✅ Patient demographics
- ✅ Chief complaint
- ✅ Medical history

### Report Generation

- ✅ Text format export
- ✅ HTML format export
- ✅ PDF export (with html2pdf)
- ✅ Server submission
- ✅ Comprehensive formatting

## Security Considerations

1. **API Key Management**
   - Never expose API secret in client code
   - Generate tokens on backend
   - Implement token expiration

2. **User Authentication**
   - Verify user identity before creating calls
   - Implement role-based access control
   - Use secure session management

3. **Data Privacy**
   - Ensure HIPAA compliance
   - Encrypt sensitive data
   - Implement audit logging
   - Get patient consent for recording

4. **Call Security**
   - Use HTTPS in production
   - Implement call authentication
   - Control who can join calls
   - Implement call room limits

## Performance Optimization

1. **Component Memoization**

   ```typescript
   const VideoView = React.memo(ConsultationVideoView);
   ```

2. **Hook Optimization**
   - Use `useCallback` for event handlers
   - Minimize re-renders with proper dependencies

3. **State Management**
   - Keep notes/prescriptions in component state
   - Batch updates when possible
   - Lazy load data as needed

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 12+
- Edge 80+

Requires:

- WebRTC support
- Media devices API access
- HTTPS (for production)

## Troubleshooting

### Video Not Displaying

```
Check:
1. Camera permissions granted
2. WebRTC connection established
3. HTTPS enabled in production
4. Browser console for errors
```

### Audio Issues

```
Check:
1. Microphone permissions granted
2. Audio device properly configured
3. Browser volume not muted
4. Audio levels in Stream IO settings
```

### Notes Not Saving

```
Check:
1. Component state management
2. Storage implementation if using localStorage
3. API connection if saving to server
4. Console for errors
```

## API Integration

### Saving Consultation Data

```typescript
// POST /api/consultations
const saveConsultation = async (data: ConsultationSession) => {
  const response = await fetch("/api/consultations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
};
```

### Retrieving Consultation History

```typescript
// GET /api/consultations/:patientId
const getPatientConsultations = async (patientId: string) => {
  const response = await fetch(`/api/consultations/patient/${patientId}`);
  return response.json();
};
```

## Future Enhancements

1. **Real-time Collaboration**
   - Multiple consultants view
   - Shared whiteboard
   - Real-time prescription updates

2. **AI Integration**
   - Automatic transcription
   - AI-powered suggestions
   - Diagnosis support

3. **Advanced Analytics**
   - Consultation metrics
   - Patient outcomes tracking
   - Performance analytics

4. **Integration**
   - EHR system integration
   - Laboratory results import
   - Insurance verification

5. **Accessibility**
   - Screen reader support
   - Keyboard navigation
   - Multi-language support

## Support & Documentation

- [Stream IO Documentation](https://getstream.io/video/docs/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- See `STREAM_IO_SETUP.md` for detailed setup guide
