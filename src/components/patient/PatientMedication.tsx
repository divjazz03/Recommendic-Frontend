
import { ArrowLeft, BellDot, BellOff, Calendar, CheckCircle, Clock, Download, Eye, Pill, Plus, Share2, Shield, User } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

interface Medication {
  id: number;
  name?: string;
  dosage?: string;
  frequency?: 'Once Daily' | 'Twice daily' | 'Three Times Daily' | 'As needed';
  timeToTake?: 'morning' | 'evening' | 'bed time' | 'with meals' | 'other';
  startDate?: string;
  endDate?: string;
  prescribedBy?: string;
  condition?: string;
  notes?: string;
  adherence?: number;
  status?: 'ongoing' | 'completed';
  nextDose?: string;
  consultationDate?: string;
  prescriptionId?: string;
}
interface MedicalDetailProps {
  medicationDetail: Medication;
}
interface MedicationCardProps {
  medication: Medication;
  isPrescribed?: boolean;

}


const currentMedicationList: Medication[] = [
  {
    id: 1,
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once Daily",
    timeToTake: "morning",
    startDate: "2024-05-15",
    prescribedBy: "Self-reported",
    condition: "Hypertension",
    notes: "Take with water, avoid potassium supplements",
    nextDose: "Today, 8:00 AM",
    adherence: 94,
    status: "ongoing"
  },
  {
    id: 2,
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    timeToTake: "with meals",
    startDate: "2024-04-20",
    prescribedBy: "Self-reported",
    condition: "Type 2 Diabetes",
    notes: "Take with breakfast and dinner",
    nextDose: "Today, 7:30 AM",
    adherence: 89,
    status: "ongoing"
  }
];

const prescribedMedications: Medication[] = [
  {
    id: 3,
    name: "Amlodipine",
    dosage: "5mg",
    frequency: "Once Daily",
    timeToTake: "evening",
    startDate: "2024-06-01",
    prescribedBy: "Dr. Sarah Mitchell",
    consultationDate: "2024-05-28",
    condition: "Hypertension",
    notes: "Monitor blood pressure weekly",
    nextDose: "Today, 7:00 PM",
    adherence: 100,
    status: 'ongoing',
    prescriptionId: "RX001234"
  },
  {
    id: 4,
    name: "Atorvastatin",
    dosage: "20mg",
    frequency: "Once Daily",
    timeToTake: "bed time",
    startDate: "2024-05-20",
    endDate: "2024-06-05",
    prescribedBy: "Dr. Sarah Mitchell",
    consultationDate: "2024-05-15",
    condition: "High Cholesterol",
    notes: "Completed course",
    adherence: 96,
    status: "completed",
    prescriptionId: "RX001221"
  }
];
interface MedicationFormType {
  medicationName: string;
  frequency: 'Once Daily' | 'Twice daily' | 'Three Times Daily' | 'As needed';
  timeToTake: 'morning' | 'evening' | 'bed time' | 'with meals' | 'other';
  purpose: string;
  dosage: number;
  notes?: string;
}

interface UpcomingDosesState {
  medication:string,
  time:string, 
  taken:boolean
}
const PatientMedication = () => {

  const [activeTab, setActiveTab] = useState('current');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication|null>();
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [currentMedications, setCurrentMedications] = useState<Medication[]>([...prescribedMedications, ...currentMedicationList])
  const [upcomingDosesState, setUpcomingDoses] = useState<UpcomingDosesState[]>(currentMedications.filter(medication => medication.status !== 'completed').flatMap(medication => {
    if (medication.frequency === 'Once Daily') {
      return [{
        medication: medication.name,
        time: medication.timeToTake === 'evening'
          ? '7:00 PM'
          :
          medication.timeToTake === 'morning'
            ? '8:00 AM'
            : medication.timeToTake === 'bed time'
              ? 'Next Meal'
              : 'As Described',
        taken: false
      }]
    }
    if (medication.frequency === 'Three Times Daily') {
      return [{
        medication: medication.name,
        time: '8:00 AM',
        taken: false
      },
      {
        medication: medication.name,
        time: '4:00 PM',
        taken: false
      },
      {
        medication: medication.name,
        time: '12:00 AM',
        taken: false
      }
      ]
    }
    if (medication.frequency === 'As needed') {
      return [{
        medication: medication.name,
        time: 'As needed',
        taken: false
      }]
    }
    if (medication.frequency === 'Twice daily') {
      return [
        {
          medication: medication.name,
          time: '8:00 AM',
          taken: false
        },
        {
          medication: medication.name,
          time: '4:00 PM',
          taken: false
        },
      ]
    }

  }
  ));

  const handleMedication = (medicationForm: MedicationFormType) => {
    if (medicationForm.dosage < 0) {
      return toast.error(`Dosage can't be negative`)
    }
    if (medicationForm.medicationName.trim().length == 0) {
      return toast.error(`name can't be left blank`)
    }
    if (medicationForm.purpose.trim().length == 0) {
      return toast.error(`Purpose/condition can't be left blank`)
    }
    const medication: Medication = {
      dosage: medicationForm.dosage + '' + 'mg',
      frequency: medicationForm.frequency,
      name: medicationForm.medicationName,
      notes: medicationForm.notes,
      id: currentMedications.length + 1,
      condition: medicationForm.purpose,
      timeToTake: medicationForm.timeToTake,
      adherence: 100,
      startDate: new Date().toLocaleDateString(),
      prescribedBy: 'Self-reported',
      nextDose: 'Today, 9:00 AM',
      status: 'ongoing'
    }
    setCurrentMedications(prev => ([...prev, medication]))

    const upcomingDoses = 
      medication.frequency === 'Once Daily' ? [{
        medication: medication.name,
        time: medication.timeToTake === 'evening'
          ? '7:00 PM'
          :
          medication.timeToTake === 'morning'
            ? '8:00 AM'
            : medication.timeToTake === 'bed time'
              ? 'Next Meal'
              : 'As Described',
        taken: false
      }]:
      medication.frequency === 'Three Times Daily' ? [{
        medication: medication.name,
        time: '8:00 AM',
        taken: false
      },
      {
        medication: medication.name,
        time: '4:00 PM',
        taken: false
      },
      {
        medication: medication.name,
        time: '12:00 AM',
        taken: false
      }
      ]:
      medication.frequency === 'As needed' ? [{
        medication: medication.name,
        time: 'As needed',
        taken: false
      }]:
      [
        {
          medication: medication.name,
          time: '8:00 AM',
          taken: false
        },
        {
          medication: medication.name,
          time: '4:00 PM',
          taken: false
        },
      ]
      
    setUpcomingDoses(prev => ([...prev, ...upcomingDoses]))
    setShowAddForm(false)
    return toast.success(`Medication was added successfully` )
  }


  const MedicationCard: React.FC<MedicationCardProps> = ({
    medication,
    isPrescribed
  }) => (
    <div className='bg-white rounde-2xl p-6 hover:shadow-sm transition-all duration-100'>
      <div className='flex items-start justify-between mb-4'>
        <div className='flex items-center gap-3'>
          <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center ${medication.status === 'completed' ? 'bg-green-100' : 'bg-main-light'
            }
          `}>
            <Pill className={`w-6 h-6 ${medication.status === 'completed' ? 'text-green-600' : 'text-light-3'}`} />
          </div>
          <div>
            <h3 className='text-xl font-semibold text-dark-3'>{medication.name}</h3>
            <p className='text-gray-600'>{medication.dosage} • {medication.frequency} </p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          {medication.status === 'completed' && (
            <span className='px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium'>
              Completed
            </span>
          )}
          <button onClick={() => setSelectedMedication(medication)}
            className='p-2 hover:bg-gray-100 rounded-lg transition-colors duration-100'><Eye className='w-4 h-4 text-gray-400' /></button>
        </div>
      </div>

      <div className='space-y-3'>
        <div className='flex items-center gap-2 text-sm text-gray-600'>
          <User className='w-4 h-4' />
          <span>Prescribed by: {medication.prescribedBy}</span>
          {isPrescribed && (
            <Shield className='w-4 h-4 text-main-light' />
          )}
        </div>

        <div className='flex items-center gap-2 text-sm text-gray-600'>
          <Calendar className='w-4 h-4' />
          <span>Started: {new Date(medication.startDate).toLocaleDateString()}</span>
          {medication.endDate && (
            <span>• Ended: {new Date(medication.endDate).toLocaleDateString()}</span>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>Take: {medication.timeToTake}</span>
        </div>

        {medication.condition && (
          <div className='px-3 py-1 bg-gray-100 rounded-lg text-sm text-gray-700'>
            For: {medication.condition}
          </div>
        )}

        {medication && medication.status === 'ongoing' && (
          <div className='flex items-center justify-between pt-3 border-t border-gray-100'>
            <div className='flex items-center gap-2'>
              <div className='text-sm text-gray-600'>Adherence: </div>
              <div className={`text-sm font-medium ${medication.adherence >= 90 ? 'text-green-600' :
                medication.adherence >= 70 ? 'text-yellow-600' : 'text-red-600'
                }`}>{medication.adherence}%
              </div>
            </div>
            <div className='text-sm text-gray-600'>
              Next: {medication.nextDose}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const AddMedicationForm = () => {

    const [medication, setMedication] = useState<MedicationFormType>({ medicationName: '', dosage: 0, frequency: 'As needed', purpose: '', timeToTake: 'morning', notes: null });

    const handleFormChange = (key: keyof MedicationFormType, value: unknown) => {
      setMedication(prev => ({ ...prev, [key]: value }))
    }



    return (
      <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
        <div className='bg-white rounded-2xl p-6 w-full max-w-md'>
          <h3 className='text-xl font-semibold text-dark-3 mb-4'>Add Medication</h3>
          <div className='space-y-4'>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Medication Name</label>
              <input
                type="text"
                value={medication.medicationName}
                onChange={(e) => handleFormChange('medicationName', e.currentTarget.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="e.g., Aspirin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dosage (In mg)</label>
              <input
                type="number"
                value={medication.dosage}
                onChange={(e) => handleFormChange('dosage', e.currentTarget.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="e.g. 20"
              />
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
              <select value={medication.frequency} onChange={(e) => handleFormChange('frequency', e.currentTarget.value)} className="w-full p-3 border border-gray-300 rounded-lg">
                <option>Once daily</option>
                <option>Twice daily</option>
                <option>Three times daily</option>
                <option>As needed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time to Take</label>
              <select value={medication.timeToTake} onChange={(e) => handleFormChange('timeToTake', e.currentTarget.value)} className="w-full p-3 border border-gray-300 rounded-lg">
                <option value={'morning'}>Morning</option>
                <option value={'evening'}>Evening</option>
                <option value={'bed time'}>Bed time</option>
                <option value={'with meals'}>With meals</option>
                <option value={'other'}>Other (details in notes)</option>
              </select>
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Condition/Purpose</label>
              <input
                value={medication.purpose}
                onChange={(e) => handleFormChange('purpose', e.currentTarget.value)}
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg "
                placeholder="What is this medication for?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
              <textarea
                value={medication.notes}
                onChange={(e) => handleFormChange('notes', e.currentTarget.value)}
                className="w-full p-3 border border-gray-300 rounded-lg "
                rows={2}
                placeholder="Any special instructions or notes..."
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowAddForm(false)}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              onClick={() => handleMedication(medication)}
              className="flex-1 py-3 bg-main-light text-white rounded-lg hover:bg-main transition-colors duration-300"
            >
              Add Medication
            </button>
          </div>
        </div>
      </div>
    );
  }

  const MedicationDetail = (prop: MedicalDetailProps) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-gray-900">{prop.medicationDetail?.name}</h3>
          <button
            onClick={() => setSelectedMedication(null)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Dosage</div>
              <div className="font-semibold text-gray-900">{prop.medicationDetail?.dosage}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Frequency</div>
              <div className="font-semibold text-gray-900">{prop.medicationDetail?.frequency}</div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-600 mb-1">Prescribed by</div>
            <div className="font-semibold text-blue-900">{prop.medicationDetail?.prescribedBy}</div>
            {prop.medicationDetail?.consultationDate && (
              <div className="text-sm text-blue-600 mt-1">
                Consultation: {new Date(prop.medicationDetail.consultationDate).toLocaleDateString()}
              </div>
            )}
          </div>

          {prop.medicationDetail?.condition && (
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-green-600 mb-1">Condition</div>
              <div className="font-semibold text-green-900">{prop.medicationDetail?.condition}</div>
            </div>
          )}

          {prop.medicationDetail?.notes && (
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="text-sm text-yellow-600 mb-1">Important Notes</div>
              <div className="text-yellow-900">{prop.medicationDetail?.notes}</div>
            </div>
          )}

          {prop.medicationDetail?.prescriptionId && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Prescription ID</div>
              <div className="font-mono text-sm text-gray-900">{prop.medicationDetail.prescriptionId}</div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button className="flex-1 py-3 bg-main text-white rounded-lg hover:bg-main transition-colors duration-300 flex items-center justify-center gap-2">
              <Share2 className="w-4 h-4" />
              Share with Doctor
            </button>
            {prop.medicationDetail?.prescriptionId && (
              <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300">
                <Download className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );


  return (
    <div className="h-full bg-white overflow-y-auto scroll-smooth from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-white rounded-xl transition-colors duration-300"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">My Medications</h1>
              <p className="text-sm sm:text-base text-gray-600">Track your current medications and prescriptions</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setReminderEnabled(!reminderEnabled)}
              className={`p-2 rounded-xl transition-colors duration-300 ${reminderEnabled ? 'bg-blue-50 text-main-light' : 'bg-gray-100 text-gray-600'
                }`}
            >
              {reminderEnabled ? <BellDot className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-2 py-1 w-32 bg-main-light text-white rounded-lg hover:bg-main transition-colors duration-300 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <p className=' text-xs sm:text-sm'>Add Medication</p>
              
            </button>
          </div>
        </div>

        {/* Today's Reminders */}
        {reminderEnabled && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-main" />
              Today's Schedule
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {upcomingDosesState.map((dose, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-900">{dose.medication}</div>
                    <button disabled={dose.taken} onClick={() => setUpcomingDoses((doses) => [...doses.filter(doseFilter => !(doseFilter.time === doses[index].time && doseFilter.medication === doses[index].medication)), doses[index] = { ...doses[index], taken: true }])} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${dose.taken ? 'bg-green-500 border-green-500' : 'border-gray-300'
                      }`}>
                      {dose.taken && <CheckCircle className="w-4 h-4 text-white" />}
                    </button>
                  </div>
                  <div className="text-sm text-gray-600">{dose.time}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'current', label: 'Current Medications', count: currentMedications.filter(medication => medication.prescriptionId == null).length },
              { id: 'prescribed', label: 'App Prescriptions', count: prescribedMedications.filter(medication => medication.prescriptionId != null).length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-4 font-medium transition-all duration-300 ${activeTab === tab.id
                  ? 'text-main-light border-b-2 border-main-light bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                {tab.label}
                <span className={`px-2 py-1 rounded-full text-xs ${activeTab === tab.id ? 'bg-blue-100 text-main-light' : 'bg-gray-100 text-gray-600'
                  }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="p-3 sm:p-6">
            {activeTab === 'current' && (
              <div>
                {currentMedications.length > 0 ? (
                  <div className="grid gap-6">
                    {currentMedications.filter(medication => medication.prescriptionId == null).map((medication) => (
                      <MedicationCard key={medication.id} medication={medication} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No medications added</h3>
                    <p className="text-gray-600 mb-6">Add your current medications to share with doctors during consultations</p>
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="px-6 py-3 bg-main-light text-white rounded-xl hover:bg-main transition-colors duration-300"
                    >
                      Add Your First Medication
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'prescribed' && (
              <div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-main-light mt-0.5" />
                    <div>
                      <h4 className="font-medium text-main mb-1">App Prescriptions</h4>
                      <p className="text-sm text-main-light">
                        These medications were prescribed by doctors through consultations on this app.
                        They are verified and include detailed instructions.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6">
                  {currentMedications.filter(medication => medication.prescriptionId != null).map((prescribed) => (
                    <MedicationCard key={prescribed.id} medication={prescribed} isPrescribed={true} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddForm && <AddMedicationForm />}
      {selectedMedication && <MedicationDetail medicationDetail={selectedMedication} />}
    </div>
  )
}

export default PatientMedication