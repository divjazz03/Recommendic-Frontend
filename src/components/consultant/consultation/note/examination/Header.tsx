import { usePatientExamStore } from '@/stores/PatientExamStore';
import { ArrowLeft, Pause, Timer } from 'lucide-react';
import React, { useEffect} from 'react'
import { useShallow } from 'zustand/react/shallow';
import { PatientExaminationInterfaceProps } from './PatientExaminationInterface';

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const Header: React.FC<PatientExaminationInterfaceProps> = ({backToHome}) => {

    const {timerRunning, timer, setPatientExamState, currentSection
    } = usePatientExamStore(useShallow((s) => ({
            timerRunning: s.patientExamState.timerRunning,
            timer:s.patientExamState.timer,
            setPatientExamState: s.setPatientExamState,
            currentSection: s.patientExamState.currentSection
        })));

    useEffect(() => {
            let interval = undefined
            let localTimer = timer
            if (timerRunning) {
                interval = setInterval(() => {
                    setPatientExamState({ timer: localTimer++})
                }, 1000);
            }
    
            return () => clearInterval(interval);
        }, [timerRunning])

    return (
        <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-0">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => {
                        if (currentSection) {
                            setPatientExamState({currentSection: undefined}); setPatientExamState({timer: 0})
                        } else {
                            backToHome()
                        }
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex-1">
                    <h2 className="font-semibold text-gray-900">Remote Patient Examination</h2>
                    <p className="text-sm text-gray-600">John Smith • Guided Assessment</p>
                </div>
                <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-700">Video Active</span>
                </div>
            </div>

            {timerRunning && (
                <div className="mt-3 flex items-center justify-center bg-blue-50 border border-blue-200 rounded-lg p-2">
                    <Timer className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm font-mono text-blue-800">Exam Timer: {formatTime(timer)}</span>
                    <button
                        onClick={() =>setPatientExamState({ timerRunning: false })}
                        className="ml-3 text-blue-600 hover:text-blue-800"
                    >
                        <Pause className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    )
};

export default Header