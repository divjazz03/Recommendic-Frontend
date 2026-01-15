import React, { useState, useEffect } from 'react';
import { Clock, User, FileText, Calendar, Video, Mic, MicOff, VideoOff, Phone, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ConsultantWaitingScreen = () => {
  const [waitingTime, setWaitingTime] = useState(0);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [showNotification, setShowNotification] = useState(true);

  // Demo consultation data
  const consultation = {
    id: 'CONS-2024-001',
    patientName: 'John Doe',
    patientAge: 45,
    patientGender: 'Male',
    chiefComplaint: 'Follow-up on cardiac health',
    scheduledTime: '14:30',
    duration: 30,
    patientHistory: [
      'Hypertension - diagnosed 2019',
      'Previous consultation - Dec 2025',
      'Current medications: Lisinopril 10mg'
    ],
    startedAt: new Date(),
    patientNotified: true
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Math.floor((new Date().getTime() - consultation.startedAt.getTime()) / 1000);
      setWaitingTime(elapsed);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => setShowNotification(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  const formatWaitingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndSession = () => {
    if (confirm('Are you sure you want to end this consultation session? The patient has not joined yet.')) {
      console.log('Ending consultation session...');
      alert('Consultation ended. Returning to dashboard...');
    }
  };

  const handleCallPatient = () => {
    alert('Calling patient via phone...');
  };

  return (
    <div className="h-full">
      <div className="p-4 sm:p-6 overflow-y-auto h-full flex flex-col gap-6">
        
        {/* Notification Banner */}
        {showNotification && (
          <div className="bg-green-500 text-white rounded-lg shadow-md p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle size={24} />
              <p className="font-semibold">Patient has been notified and can now join the consultation</p>
            </div>
            <button 
              onClick={() => setShowNotification(false)}
              className="text-white hover:text-green-100"
            >
              ✕
            </button>
          </div>
        )}

        {/* Header Status */}
        <div className="flex flex-col gap-4 bg-white rounded-2xl shadow-md p-4 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Consultation Started</h1>
              <p className="text-gray-600">Waiting for patient to join...</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Waiting Time</p>
              <div className="bg-orange-100 text-orange-700 rounded-lg px-6 py-3 flex items-center gap-2">
                <Clock size={24} />
                <span className="font-mono text-2xl font-bold">{formatWaitingTime(waitingTime)}</span>
              </div>
            </div>
          </div>

          {/* Waiting Indicator */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
            <div className="flex flex-col sm:flex-row text-center sm:text-start items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-main-light rounded-full flex items-center justify-center">
                  <User className="text-white" size={32} />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-orange-400 border-2 border-white rounded-full animate-pulse"></div>
              </div>
              <div className="flex-1 flex flex-col">
                <h3 className="text-xl font-semibold text-gray-900">
                  Waiting for {consultation.patientName}
                </h3>
                <p className="text-gray-600">The patient has been notified and can join at any moment</p>
              </div>
              <Button
                onClick={handleCallPatient}
                className="bg-main-light hover:bg-main text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <Phone size={20} />
                Call Patient
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Left Column - Patient Information */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Patient Details */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User size={24} className="text-indigo-600" />
                Patient Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Name</p>
                  <p className="font-semibold text-gray-900">{consultation.patientName}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Age / Gender</p>
                  <p className="font-semibold text-gray-900">{consultation.patientAge} / {consultation.patientGender}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Chief Complaint</p>
                  <p className="font-semibold text-gray-900">{consultation.chiefComplaint}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText size={20} className="text-indigo-600" />
                  Medical History
                </h3>
                <ul className="space-y-2">
                  {consultation.patientHistory.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="text-indigo-600 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quick Notes */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText size={24} className="text-indigo-600" />
                Quick Notes
              </h2>
              <textarea
                placeholder="Add any pre-consultation notes or reminders here..."
                className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Right Column - Controls & Settings */}
          <div className="space-y-6">
            
            {/* Video Preview */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Your Preview</h3>
              <div className="bg-gray-900 rounded-lg aspect-video mb-4 flex items-center justify-center relative overflow-hidden">
                {isVideoEnabled ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                    <User size={64} className="text-white opacity-50" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-white">
                    <VideoOff size={48} />
                    <p className="text-sm">Camera Off</p>
                  </div>
                )}
              </div>

              {/* Media Controls */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                  className={`py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    isAudioEnabled 
                      ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' 
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
                  {isAudioEnabled ? 'Mute' : 'Unmute'}
                </button>

                <button
                  onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                  className={`py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    isVideoEnabled 
                      ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' 
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
                  {isVideoEnabled ? 'Stop' : 'Start'}
                </button>
              </div>
            </div>

            {/* Session Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-indigo-600" />
                Session Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Consultation ID</span>
                  <span className="font-medium text-gray-900">{consultation.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Scheduled Time</span>
                  <span className="font-medium text-gray-900">{consultation.scheduledTime}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium text-gray-900">{consultation.duration} min</span>
                </div>
              </div>
            </div>

            {/* Important Reminder */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-amber-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="font-semibold text-amber-900 mb-1">Patient Not Joined Yet</h4>
                  <p className="text-sm text-amber-800">
                    If the patient doesn't join within 5 minutes, consider calling them directly.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors">
                View Full Medical Records
              </button>
              <button 
                onClick={handleEndSession}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                End Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const ConsultantConsultation = () => {

    return (<>
    <ConsultantWaitingScreen />
    </>)
}

export default ConsultantWaitingScreen;