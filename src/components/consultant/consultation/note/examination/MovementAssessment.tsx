import { usePatientExamStore } from '@/store/PatientExamStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle } from 'lucide-react';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useShallow } from 'zustand/react/shallow';

export interface MovementAssessmentResult {
    neckMovement: string
    shoulderMovement: string
    coordination: string
    balance: string
}

const movementAssessmentValidation = z.object({
    neckMovement: z.string(),
    shoulderMovement: z.string(),
    coordination: z.string(),
    balance: z.string()
})

const MovementAssessment = () => {
    const [complete, setComplete] = useState<boolean>(false)
    const { examResult, setPatientExamState
    } = usePatientExamStore(
        useShallow((s) => ({
            setPatientExamState: s.setPatientExamState,
            examResult: s.patientExamState.examResults
        }))
    );

    const form = useForm<z.infer<typeof movementAssessmentValidation>>({
        resolver: zodResolver(movementAssessmentValidation),
        mode: 'onSubmit'
    });

    const submit = (formData: z.infer<typeof movementAssessmentValidation>) => {
        setComplete(true)
        setPatientExamState({
            examResults: {
                ...examResult, 
                'movement-assessment': {
                    balance: formData.balance,
                    coordination: formData.coordination,
                    neckMovement: formData.neckMovement,
                    shoulderMovement: formData.shoulderMovement
                }
            }
        })
    }


    return (
        <form onSubmit={form.handleSubmit(submit)} className="p-4 space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">Movement & Mobility Assessment</h3>
                <p className="text-sm text-green-700">
                    Guide the patient through basic movement tests while observing via video.
                </p>
            </div>

            <div className="space-y-4">
                {/* Range of Motion */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Range of Motion Tests</h4>
                    <div className="text-sm text-gray-700 space-y-3 mb-4">
                        <div>
                            <p><strong>Neck Movement:</strong></p>
                            <p>Ask patient to: "Slowly turn your head left, then right. Now look up, then down."</p>
                        </div>
                        <div>
                            <p><strong>Shoulder Movement:</strong></p>
                            <p>Ask patient to: "Raise both arms above your head, then lower them."</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-gray-600 mb-1">Neck ROM</label>
                            <select {...form.register("neckMovement")} className="w-full px-2 py-2 border border-gray-300 rounded text-sm">
                                <option>Full range, no pain</option>
                                <option>Limited ROM, no pain</option>
                                <option>Full range, with pain</option>
                                <option>Limited ROM, with pain</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1">Shoulder ROM</label>
                            <select {...form.register("shoulderMovement")} className="w-full px-2 py-2 border border-gray-300 rounded text-sm">
                                <option>Full range, no pain</option>
                                <option>Limited ROM, no pain</option>
                                <option>Full range, with pain</option>
                                <option>Limited ROM, with pain</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Coordination Test */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Basic Coordination</h4>
                    <div className="text-sm text-gray-700 space-y-2 mb-4">
                        <p><strong>Finger-to-Nose Test:</strong></p>
                        <p>Ask patient to: "Touch your nose with your index finger, then extend your arm. Repeat 5 times with each hand."</p>
                    </div>
                    <div>
                        <label className="block text-gray-600 mb-1">Coordination Assessment</label>
                        <select {...form.register("coordination")} className="w-full px-2 py-2 border border-gray-300 rounded text-sm">
                            <option>Normal coordination</option>
                            <option>Mild incoordination</option>
                            <option>Significant incoordination</option>
                            <option>Unable to perform</option>
                        </select>
                    </div>
                </div>

                {/* Balance Assessment */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Static Balance (if safe)</h4>
                    <div className="text-sm text-gray-700 space-y-2 mb-4">
                        <p><strong>Safety First:</strong> Only if patient feels stable and has support nearby</p>
                        <p>Ask patient to: "Stand with feet together for 10 seconds. Hold onto a chair if needed."</p>
                    </div>
                    <div>
                        <label className="block text-gray-600 mb-1">Balance Assessment</label>
                        <select {...form.register("balance")} className="w-full px-2 py-2 border border-gray-300 rounded text-sm">
                            <option>Stable balance</option>
                            <option>Mild unsteadiness</option>
                            <option>Significant balance issues</option>
                            <option>Not attempted (safety)</option>
                        </select>
                    </div>
                </div>
            </div>

            <button
                type='submit'
                disabled={complete}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 disabled:bg-light-1 text-white rounded-lg font-medium"
            >
                <CheckCircle className="w-5 h-5" />
                Complete Movement Assessment
            </button>
        </form>
    )
};

export default MovementAssessment