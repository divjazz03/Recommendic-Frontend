/\*\*

- Integration Example: Patient Consultation Session
-
- This file shows how to integrate the new Patient Consultation UI
- into your existing application routing and pages.
  \*/

// ============================================================================
// OPTION 1: Router Configuration (React Router v6)
// ============================================================================

/\*
// In your main router file (e.g., src/router.tsx or App.tsx)

import { createBrowserRouter } from 'react-router-dom';
import PatientConsultationPage from '@/examples/PatientConsultationPage';
import RootLayout from '@/\_root/pages/RootLayout';

export const router = createBrowserRouter([
{
path: '/',
element: <RootLayout />,
children: [
// ... other routes
{
path: 'consultation/:callId',
element: <PatientConsultationPage />,
errorElement: <ErrorPage />
},
// ... more routes
]
}
]);
\*/

// ============================================================================
// OPTION 2: Direct Page Integration
// ============================================================================

/\*
// In your consultation page (e.g., src/\_root/pages/Consultation.tsx)

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PatientConsultation from '@/components/patient/consultation/PatientConsultation';
import { useTokenStore } from '@/store/TokenStore';
import { useUserContext } from '@/context/AuthContext';
import { ConsultationJoinData } from '@/types';

const PatientConsultationPage: React.FC = () => {
const { callId } = useParams<{ callId: string }>();
const navigate = useNavigate();
const { userContext } = useUserContext();
const { accessToken } = useTokenStore();

if (!callId) {
return <ErrorPage message="Invalid consultation link" />;
}

const consultationData: ConsultationJoinData = {
callId,
apiKey: import.meta.env.VITE_STREAM_IO_API_KEY || '',
token: '', // Fetched automatically by PatientConsultation component
user: {
id: userContext.user_id || '',
name: userContext.userPrincipal?.name || 'Patient',
},
};

const handleSessionEnd = () => {
// Navigate to dashboard or consultation history after session ends
navigate('/dashboard', { state: { consultationEnded: true } });
};

return (
<div className="h-screen">
<PatientConsultation 
        data={consultationData}
        onSessionEnd={handleSessionEnd}
      />
</div>
);
};

export default PatientConsultationPage;
\*/

// ============================================================================
// OPTION 3: Comprehensive Page with Status Handling
// ============================================================================

/\*
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PatientConsultation from '@/components/patient/consultation/PatientConsultation';
import { useTokenStore } from '@/store/TokenStore';
import { useUserContext } from '@/context/AuthContext';
import { useGetConsultationById } from '@/lib/actions/generalQueriesAndMutation';
import { ConsultationJoinData } from '@/types';
import { Loader } from '@/components/shared/Loader';

const PatientConsultationPage: React.FC = () => {
const { callId } = useParams<{ callId: string }>();
const navigate = useNavigate();
const { userContext } = useUserContext();
const { accessToken } = useTokenStore();
const [sessionStarted, setSessionStarted] = useState(false);

// Fetch consultation details
const {
data: consultationData,
isLoading,
error
} = useGetConsultationById(accessToken, callId || '');

if (!callId) {
return (
<div className="flex items-center justify-center h-screen bg-gray-100">
<div className="text-center">
<h1 className="text-2xl font-bold text-gray-900 mb-2">
Invalid Link
</h1>
<p className="text-gray-600 mb-4">
The consultation link is invalid or expired.
</p>
<button
onClick={() => navigate('/dashboard')}
className="bg-indigo-600 text-white px-6 py-2 rounded-lg" >
Back to Dashboard
</button>
</div>
</div>
);
}

if (isLoading) {
return (
<div className="flex items-center justify-center h-screen bg-gray-100">
<Loader />
</div>
);
}

if (error) {
return (
<div className="flex items-center justify-center h-screen bg-gray-100">
<div className="text-center">
<h1 className="text-2xl font-bold text-red-600 mb-2">
Error Loading Consultation
</h1>
<p className="text-gray-600 mb-4">{error.message}</p>
<button
onClick={() => navigate('/dashboard')}
className="bg-indigo-600 text-white px-6 py-2 rounded-lg" >
Back to Dashboard
</button>
</div>
</div>
);
}

const consultationJoinData: ConsultationJoinData = {
callId,
apiKey: import.meta.env.VITE_STREAM_IO_API_KEY || '',
token: '',
user: {
id: userContext.user_id || '',
name: userContext.userPrincipal?.name || 'Patient',
},
};

const handleSessionEnd = () => {
setSessionStarted(false);
// Show session summary or navigate back
navigate('/consultations', {
state: {
message: 'Consultation session ended',
consultationId: callId
}
});
};

return (
<div className="h-screen">
<PatientConsultation 
        data={consultationJoinData}
        onSessionEnd={handleSessionEnd}
      />
</div>
);
};

export default PatientConsultationPage;
\*/

// ============================================================================
// OPTION 4: Link Generation for Patient Notifications
// ============================================================================

/\*
// In your consultation booking/notification logic

import { useNavigate } from 'react-router-dom';

const sendConsultationLink = (consultationId: string) => {
// Generate the consultation URL
const consultationUrl = `${window.location.origin}/consultation/${consultationId}`;

// Send to patient via email/SMS/notification
console.log(`Join your consultation: ${consultationUrl}`);

// You can also use this to create a clickable link
return consultationUrl;
};

// In your notification service
const notifyPatient = (patientEmail: string, consultationId: string) => {
const consultationUrl = `${process.env.REACT_APP_BASE_URL}/consultation/${consultationId}`;

// Send via your email/SMS service
sendEmailNotification({
to: patientEmail,
subject: 'Your Consultation is Ready',
body: `       Your consultation is scheduled. Click the link below to join:
      ${consultationUrl}
    `
});
};
\*/

// ============================================================================
// OPTION 5: With Consultation History/Follow-up
// ============================================================================

/\*
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PatientConsultation from '@/components/patient/consultation/PatientConsultation';
import ConsultationSummary from '@/components/patient/consultation/ConsultationSummary';
import { ConsultationJoinData } from '@/types';

const PatientConsultationPage: React.FC = () => {
const { callId } = useParams<{ callId: string }>();
const navigate = useNavigate();
const [sessionEnded, setSessionEnded] = useState(false);
const [sessionData, setSessionData] = useState<any>(null);

const handleSessionEnd = () => {
// Save session data for follow-up
setSessionData({
callId,
endTime: new Date(),
status: 'completed'
});
setSessionEnded(true);
};

if (sessionEnded && sessionData) {
return (
<div className="min-h-screen bg-gray-100 p-4">
<ConsultationSummary
sessionData={sessionData}
onDone={() => navigate('/consultations')}
/>
</div>
);
}

return (
<div className="h-screen">
<PatientConsultation
data={{
          callId: callId || '',
          apiKey: import.meta.env.VITE_STREAM_IO_API_KEY || '',
          token: '',
          user: { id: '', name: '' }
        }}
onSessionEnd={handleSessionEnd}
/>
</div>
);
};

export default PatientConsultationPage;
\*/

// ============================================================================
// OPTION 6: With Custom Pre-Join Validation
// ============================================================================

/\*
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PatientConsultation from '@/components/patient/consultation/PatientConsultation';
import { useTokenStore } from '@/store/TokenStore';
import { ConsultationJoinData } from '@/types';

const PatientConsultationPage: React.FC = () => {
const { callId } = useParams<{ callId: string }>();
const navigate = useNavigate();
const { accessToken } = useTokenStore();
const [isEligible, setIsEligible] = useState(false);
const [isChecking, setIsChecking] = useState(true);

useEffect(() => {
const checkEligibility = async () => {
try {
// Validate consultation eligibility
const response = await fetch(
`/api/consultations/${callId}/validate`,
{ headers: { Authorization: `Bearer ${accessToken}` } }
);

        if (response.ok) {
          setIsEligible(true);
        } else {
          throw new Error('Not eligible for this consultation');
        }
      } catch (error) {
        console.error('Eligibility check failed:', error);
        navigate('/consultations');
      } finally {
        setIsChecking(false);
      }
    };

    if (callId && accessToken) {
      checkEligibility();
    }

}, [callId, accessToken, navigate]);

if (isChecking) {
return <div>Validating your access...</div>;
}

if (!isEligible) {
return <div>You don't have access to this consultation</div>;
}

return (
<PatientConsultation
data={{
        callId: callId || '',
        apiKey: import.meta.env.VITE_STREAM_IO_API_KEY || '',
        token: '',
        user: { id: '', name: '' }
      }}
/>
);
};

export default PatientConsultationPage;
\*/

// ============================================================================
// Navigation Links - How to link to consultations
// ============================================================================

/\*
// From your consultations list page

import { useNavigate } from 'react-router-dom';

const ConsultationsList = () => {
const navigate = useNavigate();

const consultations = [
{ id: 'cons-001', consultant: 'Dr. Smith', status: 'upcoming' },
// ...
];

const handleJoinConsultation = (callId: string) => {
navigate(`/consultation/${callId}`);
};

return (
<div className="space-y-2">
{consultations.map(consultation => (
<div 
          key={consultation.id}
          className="p-4 border rounded-lg"
        >
<p>{consultation.consultant}</p>
<button
onClick={() => handleJoinConsultation(consultation.id)}
className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded" >
Join Consultation
</button>
</div>
))}
</div>
);
};
\*/

// ============================================================================
// Environment Configuration
// ============================================================================

/\*
// .env.local

VITE_STREAM_IO_API_KEY=your_stream_io_api_key_here
VITE_STREAM_API_SECRET=your_stream_api_secret_here

// .env.production

VITE_STREAM_IO_API_KEY=production_stream_io_api_key
VITE_STREAM_API_SECRET=production_stream_api_secret
\*/

// ============================================================================
// Type Definitions (if needed in your types file)
// ============================================================================

/\*
// In src/types/index.ts

export interface ConsultationJoinData {
callId: string;
apiKey: string;
token: string;
user: {
id: string;
name: string;
};
}

export interface PatientConsultationSession {
id: string;
consultantName: string;
consultantSpecialty: string;
chiefComplaint: string;
consultationReason: string;
scheduledTime: string;
duration: number;
symptoms?: string[];
}
\*/

// ============================================================================
// Example: Complete Implementation in Existing Consultation Page
// ============================================================================

/\*
// Modify your existing src/\_root/pages/Consultation.tsx

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import PatientConsultation from '@/components/patient/consultation/PatientConsultation';
import PatientConsultationWaitingScreen from '@/components/patient/consultation/PatientConsultationWaitingScreen';
import { useUserContext } from '@/context/AuthContext';
import { useTokenStore } from '@/store/TokenStore';
import { ConsultationJoinData } from '@/types';

export const Consultation: React.FC = () => {
const { callId } = useParams<{ callId: string }>();
const { userContext } = useUserContext();
const { accessToken } = useTokenStore();

const consultationData: ConsultationJoinData = {
callId: callId || '',
apiKey: import.meta.env.VITE_STREAM_IO_API_KEY || '',
token: '',
user: {
id: userContext.user_id || '',
name: userContext.userPrincipal?.name || 'Patient',
},
};

return (
<div className="h-screen">
{/_ Use the pre-join waiting screen if not ready _/}
{/_ OR use the full video session component if ready _/}
<PatientConsultation data={consultationData} />
</div>
);
};

export default Consultation;
\*/

export default {
message:
"This file demonstrates 6 different integration options for the Patient Consultation UI. " +
"Uncomment and adapt the option that best fits your application architecture.",
};
