import { usePatientExamStore } from '@/store/PatientExamStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, Heart, Thermometer, Users } from 'lucide-react';
import { useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useShallow } from 'zustand/react/shallow';

export interface VitalSignResult {
    patientPulseCount: number
    BPM: number,
    pulseRhythm: 'irregular' | 'regular',
    breathingCount30sec: number,
    breathPerMin: number,
    temperature?: number,
    temperatureMethod?: 'oral' | 'forehead' | 'ear' | 'not-available'
}

export const vitalsValidation = z.object({
    patientPulseCount: z.string().min(1, "pulse count is required"),
    BPM: z.string().min(1, "BPM is required"),
    pulseRhythm: z.enum(['irregular', 'regular']),
    breathingCount30sec: z.string().min(1, "Breathing count is required"),
    breathPerMin: z.string().min(1,"Breathing rate is required"),
    temperature: z.string().optional(),
    temperatureMethod: z.enum(['oral', 'forehead', 'ear', 'not-available']).optional()
})

const VitalSignsExam = () => {
    const [complete, setComplete] = useState<boolean>(false)
    const { setPatientExamState, examResults } = usePatientExamStore(
        useShallow((s) => ({
            setPatientExamState: s.setPatientExamState,
            examResults: s.patientExamState.examResults
        }))
    );

    const form = useForm<z.infer<typeof vitalsValidation>>({
        resolver: zodResolver(vitalsValidation),
        mode: 'onSubmit'
    })

    const handleSubmit = (formData: z.infer<typeof vitalsValidation>) => {
        setComplete(true)
        setPatientExamState(
            {
                examResults: {
                    ...examResults,
                    ["vital-signs"]: {
                        BPM: Number(formData.BPM),
                        breathingCount30sec: Number(formData.breathingCount30sec),
                        breathPerMin: Number(formData.breathPerMin),
                        patientPulseCount: Number(formData.patientPulseCount),
                        pulseRhythm: formData.pulseRhythm,
                        temperature: Number(formData.temperature),
                        temperatureMethod: formData.temperatureMethod
                    }

                }
            }
        )
    }
    return (
        <div className="p-4">
            <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-red-800 mb-2">Patient Instructions: Self-Check Vitals</h3>
                    <p className="text-sm text-red-700">
                        Guide the patient through these self-assessments while you observe via video.
                    </p>
                </div>

                <div className="space-y-4">
                    {/* Pulse Check */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Heart className="w-5 h-5 text-red-500" />
                            <h4 className="font-medium text-gray-900">Pulse Check</h4>
                        </div>
                        <div className="text-sm text-gray-700 space-y-2 mb-4">
                            <p><strong>Instructions for patient:</strong></p>
                            <p>1. Place two fingers on your wrist below your palm</p>
                            <p>2. Count heartbeats for 15 seconds</p>
                            <p>3. Multiply by 4 for beats per minute</p>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Patient Count (15s)</label>
                                <input {...form.register("patientPulseCount")} type="number" className="w-full px-2 py-1 border border-gray-300 rounded text-sm" placeholder="e.g., 18" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">BPM (x4)</label>
                                <input {...form.register("BPM")} type="number" className="w-full px-2 py-1 border border-gray-300 rounded text-sm" placeholder="72" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Rhythm</label>
                                <select {...form.register("pulseRhythm")} className="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                                    <option value={'regular'}>Regular</option>
                                    <option value={'irregular'}>Irregular</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Breathing Assessment */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Users className="w-5 h-5 text-purple-500" />
                            <h4 className="font-medium text-gray-900">Breathing Rate</h4>
                        </div>
                        <div className="text-sm text-gray-700 space-y-2 mb-4">
                            <p><strong>Instructions for patient:</strong></p>
                            <p>1. Sit comfortably and breathe normally</p>
                            <p>2. Count each breath (in and out = 1) for 30 seconds</p>
                            <p>3. Tell me the count</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Count (30s)</label>
                                <input {...form.register("breathingCount30sec")} type="number" className="w-full px-2 py-1 border border-gray-300 rounded text-sm" placeholder="e.g., 9" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Per Minute (x2)</label>
                                <input {...form.register("breathPerMin")} type="number" className="w-full px-2 py-1 border border-gray-300 rounded text-sm" placeholder="18" />
                            </div>
                        </div>
                    </div>

                    {/* Temperature */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Thermometer className="w-5 h-5 text-orange-500" />
                            <h4 className="font-medium text-gray-900">Temperature (if available)</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Temperature</label>
                                <input {...form.register("temperature")} type="number" step="0.1" className="w-full px-2 py-1 border border-gray-300 rounded text-sm" placeholder="98.6" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Method</label>
                                <select {...form.register("temperatureMethod")} className="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                                    <option value={'oral'}>Oral</option>
                                    <option value={'forehead'}>Forehead</option>
                                    <option value={'ear'}>Ear</option>
                                    <option value={'not-available'}>Not available</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    type='submit'
                    disabled={complete}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 disabled:bg-light-1 text-white rounded-lg font-medium"
                >
                    <CheckCircle className="w-5 h-5" />
                    Complete Vital Signs Assessment
                </button>
            </form>

        </div>
    )
};

export default VitalSignsExam