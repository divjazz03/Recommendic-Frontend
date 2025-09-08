
import { Heart, FileText, Activity, Calendar, Edit3 } from 'lucide-react';
import React, { useState } from 'react'
import PatientExaminationInterface from './examination/PatientExaminationInterface';
import PatientLabOrderScreen from './lab_order/PatientLabOrderScreen';

interface NoteViewProps {
    clinicalNotes: string,
    setClinicalNotes: (value: React.SetStateAction<string>) => void
    diagnosis: string
    setDiagnosis: (value: React.SetStateAction<string>) => void
}

const NotesView: React.FC<NoteViewProps> = ({
    diagnosis,
    setClinicalNotes,
    setDiagnosis,
    clinicalNotes,
}) => {
    const [currentSection, setCurrentSection] = useState('')

    const backToHome = () => setCurrentSection('');


    switch (currentSection) {
        case 'examination': return <PatientExaminationInterface backToHome={backToHome}/>
        case 'labOrders': return <PatientLabOrderScreen backToHome={backToHome}/>
    }


    return (
        <div className="flex-1 p-4 space-y-4 lg:min-w-[60em]">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <button
                    onClick={() => setCurrentSection('examination')}
                    className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-medium">Examination</span>
                </button>
                <button 
                    className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium">Templates</span>
                </button>
                <button
                    onClick={() => setCurrentSection('labOrders')} 
                    className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                    <Activity className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium">Lab Orders</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                    <Calendar className="w-5 h-5 text-purple-500" />
                    <span className="text-sm font-medium">Follow-up</span>
                </button>
            </div>

            {/* Clinical Notes */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">Clinical Notes</h4>
                    <button className="p-1 text-gray-400">
                        <Edit3 className="w-4 h-4" />
                    </button>
                </div>
                <textarea
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                    className="w-full h-32 px-3 py-2 text-sm border border-gray-300 rounded resize-none "
                    placeholder="Enter clinical observations..."
                />
            </div>

            {/* Diagnosis */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Provisional Diagnosis</h4>
                <textarea
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="w-full h-24 px-3 py-2 text-sm border border-gray-300 rounded resize-none"
                    placeholder="Enter diagnosis..."
                />
            </div>
        </div>
    )
};

export default NotesView