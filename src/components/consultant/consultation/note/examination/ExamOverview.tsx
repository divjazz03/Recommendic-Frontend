
import { usePatientExamStore } from '@/stores/PatientExamStore';
import { useShallow } from "zustand/react/shallow";
import { Activity, CheckCircle, ChevronRight, Eye, Heart, Play, Stethoscope} from 'lucide-react';
import React from 'react'

const ExamOverview = () => {
    
    const {examResults, setPatientExamState,examNotes,timerRunning} = usePatientExamStore(
        useShallow((s) => ({
            currentSection: s.patientExamState.currentSection,
            examResults: s.patientExamState.examResults,
            setPatientExamState: s.setPatientExamState,
            examNotes: s.patientExamState.examNotes,
            timerRunning: s.patientExamState.timerRunning
        }))
    )

    const examSections = [
        {
            id: 'vital-signs',
            title: 'Vital Signs Self-Check',
            icon: Heart,
            color: 'red',
            status: examResults['vital-signs'] ? 'completed' : 'pending'
        },
        {
            id: 'visual-inspection',
            title: 'Visual Inspection',
            icon: Eye,
            color: 'blue',
            status: examResults['visual-inspection'] ? 'completed' : 'pending'
        },
        {
            id: 'movement-assessment',
            title: 'Movement Assessment',
            icon: Activity,
            color: 'green',
            status: examResults['movement-assessment'] ? 'completed' : 'pending'
        }
        // {
        //     id: 'respiratory-exam',
        //     title: 'Breathing Assessment',
        //     icon: Users,
        //     color: 'purple',
        //     status: examResults['respiratory-exam'] ? 'completed' : 'pending'
        // },
        // {
        //     id: 'neurological',
        //     title: 'Basic Neurological',
        //     icon: Brain,
        //     color: 'indigo',
        //     status: examResults['neurological'] ? 'completed' : 'pending'
        // },
        // {
        //     id: 'pain-assessment',
        //     title: 'Pain Assessment',
        //     icon: Target,
        //     color: 'orange',
        //     status: examResults['pain-assessment'] ? 'completed' : 'pending'
        // }
    ]
    return (
        <div className="p-4 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                    <Stethoscope className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-800">Remote Examination Guide</h3>
                </div>
                <p className="text-sm text-blue-700">
                    Guide the patient through self-examinations and visual assessments via video call.
                    Each section provides step-by-step instructions for the patient.
                </p>
            </div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Examination Sections</h3>
                {!timerRunning? <button
                    onClick={() => setPatientExamState({timerRunning: true})}
                    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg text-sm"
                >
                    <Play className="w-4 h-4" />
                    Start Exam
                </button>:
                <button
                    onClick={() => setPatientExamState({timerRunning: false, timer: 0})}
                    className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg text-sm"
                >
                    <Play className="w-4 h-4" />
                    Stop Exam
                </button> 
                 }
                
            </div>

            <div className="space-y-3">
                {examSections.map((section) => {
                    const IconComponent = section.icon;
                    return (
                        <button
                            key={section.id}
                            // onClick={() => { setCurrentSection(section.id); setActiveExam(section.id); }}
                            onClick={() => { setPatientExamState({ currentSection: section.id, activeExam: section.id})}}
                            className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg bg-${section.color}-100`}>
                                    <IconComponent className={`w-5 h-5 text-${section.color}-600`} />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-medium text-gray-900">{section.title}</h4>
                                    <p className="text-sm text-gray-500">
                                        {section.status === 'completed' ? 'Completed' : 'Not started'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {section.status === 'completed' && (
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                )}
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Quick Notes */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">General Examination Notes</h4>
                <textarea
                    value={examNotes}
                    onChange={(e) => setPatientExamState({examNotes: e.target.value })}
                    placeholder="Overall patient presentation, cooperation level, general observations..."
                    className="w-full h-24 px-3 py-2 text-sm border border-gray-300 rounded resize-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>
    )
};

export default ExamOverview