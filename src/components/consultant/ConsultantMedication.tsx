import { Calendar, CheckCircle, Clock, Download, Edit, Eye, FileText, Filter, Plus, Search, Trash2, User, X, XCircle } from 'lucide-react';
import React, { useMemo, useState } from 'react'
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface Prescription {
  id: string;
  patientName: string;
  patientMRN: string;
  age: string;
  gender: string;
  diagnosis: string;
  medications: Medication[];
  prescribedBy: string;
  date: string;
  status: 'active' | 'completed' | 'cancelled';
  notes: string;
}

const examplePrescriptions: Prescription[] = [
  {
      id: 'RX001',
      patientName: 'John Smith',
      patientMRN: 'MRN001234',
      age: '45',
      gender: 'Male',
      diagnosis: 'Hypertension, Type 2 Diabetes',
      medications: [
        { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days' },
        { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '30 days' }
      ],
      prescribedBy: 'Dr. Sarah Williams',
      date: '2024-12-28',
      status: 'active',
      notes: 'Monitor blood pressure weekly'
    },
    {
      id: 'RX002',
      patientName: 'Sarah Johnson',
      patientMRN: 'MRN001235',
      age: '32',
      gender: 'Female',
      diagnosis: 'Acute Bronchitis',
      medications: [
        { name: 'Amoxicillin', dosage: '500mg', frequency: 'Three times daily', duration: '7 days' },
        { name: 'Dextromethorphan', dosage: '10mg', frequency: 'As needed', duration: '7 days' }
      ],
      prescribedBy: 'Dr. Michael Chen',
      date: '2024-12-27',
      status: 'active',
      notes: 'Follow up if symptoms persist after 5 days'
    },
    {
      id: 'RX003',
      patientName: 'Michael Brown',
      patientMRN: 'MRN001236',
      age: '58',
      gender: 'Male',
      diagnosis: 'Gastroesophageal Reflux Disease',
      medications: [
        { name: 'Omeprazole', dosage: '20mg', frequency: 'Once daily', duration: '60 days' }
      ],
      prescribedBy: 'Dr. Sarah Williams',
      date: '2024-12-20',
      status: 'completed',
      notes: 'Completed treatment successfully'
    },
    {
      id: 'RX004',
      patientName: 'Emily Davis',
      patientMRN: 'MRN001237',
      age: '27',
      gender: 'Female',
      diagnosis: 'Migraine',
      medications: [
        { name: 'Sumatriptan', dosage: '50mg', frequency: 'As needed', duration: '30 days' }
      ],
      prescribedBy: 'Dr. James Rodriguez',
      date: '2024-12-15',
      status: 'cancelled',
      notes: 'Patient switched to alternative treatment'
    },
    {
      id: 'RX005',
      patientName: 'Robert Wilson',
      patientMRN: 'MRN001238',
      age: '51',
      gender: 'Male',
      diagnosis: 'Hyperlipidemia',
      medications: [
        { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily at bedtime', duration: '90 days' }
      ],
      prescribedBy: 'Dr. Sarah Williams',
      date: '2024-12-26',
      status: 'active',
      notes: 'Monitor liver function tests in 3 months'
    }
]

const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock size={16} />;
      case 'completed':
        return <CheckCircle size={16} />;
      case 'cancelled':
        return <XCircle size={16} />;
      default:
        return null;
    }
  };


const ConsultantMedication = () => {

  const [prescriptions, setPrescriptions] = useState<Prescription[]>(examplePrescriptions)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>("all");
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [showDetails, setShowDetails] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const navigate = useNavigate()

  const filteredPrescriptions = useMemo(() => {
    return prescriptions.filter(rx => {
    const matchesSearch = rx.patientName.toLowerCase().includes(searchTerm.toLowerCase())
        || rx.patientMRN.toLowerCase().includes(searchTerm.toLowerCase())
        || rx.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || rx.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
  }, [searchTerm, statusFilter])

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this prescription')) {
      setPrescriptions(prev => prev.filter(rx => rx.id !== id));
      setShowDetails(false)
    }
  };

  const handleStatusChange = (id: string, newStatus: 'active' | 'completed' | 'cancelled') => {
    setPrescriptions(prev => 
      prev.map(rx => rx.id === id ? { ...rx, status: newStatus } : rx)
    );
    if (selectedPrescription?.id === id) {
      setSelectedPrescription(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

    const stats = {
    total: prescriptions.length,
    active: prescriptions.filter(rx => rx.status === 'active').length,
    completed: prescriptions.filter(rx => rx.status === 'completed').length,
    cancelled: prescriptions.filter(rx => rx.status === 'cancelled').length
  };


  return (
    <div className="h-full">
      <div className="flex flex-col gap-4 px-2 py-2 sm:px-4 overflow-auto">
        {/* Header */}
        <div className="flex flex-col bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Prescription Management</h1>
              <p className="text-gray-600">View and manage all patient prescriptions</p>
            </div>
            <Button onClick={() => navigate(`new`)}>
              <Plus size={20} />
              New Prescription
            </Button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600 font-medium">Total Prescriptions</p>
              <p className="text-3xl font-bold text-blue-800">{stats.total}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-600 font-medium">Active</p>
              <p className="text-3xl font-bold text-green-800">{stats.active}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-600 font-medium">Completed</p>
              <p className="text-3xl font-bold text-purple-800">{stats.completed}</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
              <p className="text-sm text-red-600 font-medium">Cancelled</p>
              <p className="text-3xl font-bold text-red-800">{stats.cancelled}</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by patient name, MRN, prescription ID, or diagnosis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
            >
              <Filter size={20} />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
              <div className="flex gap-2">
                {['all', 'active', 'completed', 'cancelled'].map(status => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status as any)}
                    className={`px-4 py-2 rounded-lg transition ${
                      statusFilter === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Prescriptions List */}
        <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">RX ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Patient</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Diagnosis</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Medications</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPrescriptions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      <FileText size={48} className="mx-auto mb-2 opacity-50" />
                      <p>No prescriptions found</p>
                    </td>
                  </tr>
                ) : (
                  filteredPrescriptions.map(rx => (
                    <tr 
                      key={rx.id} 
                      onClick={() => {
                        setSelectedPrescription(rx);
                        setShowDetails(true);
                      }}
                      className="hover:bg-blue-50 transition cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <span className="font-semibold text-blue-600">{rx.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-800">{rx.patientName}</p>
                          <p className="text-sm text-gray-500">{rx.patientMRN}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700 max-w-xs truncate">{rx.diagnosis}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">
                          {rx.medications.length}&nbsp;medication{rx.medications.length !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700">{rx.date}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(rx.status)}`}>
                          {getStatusIcon(rx.status)}
                          {rx.status.charAt(0).toUpperCase() + rx.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPrescription(rx);
                              setShowDetails(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded transition"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="p-2 text-green-600 hover:bg-green-100 rounded transition"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(rx.id);
                            }}
                            className="p-2 text-red-600 hover:bg-red-100 rounded transition"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-main to-main-light text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">Prescription Details</h3>
                  <p className="text-blue-100">ID: {selectedPrescription.id}</p>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded transition"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6">
              {/* Patient Information */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <User className="text-blue-600" size={20} />
                  Patient Information
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-blue-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-semibold text-gray-800">{selectedPrescription.patientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">MRN</p>
                    <p className="font-semibold text-gray-800">{selectedPrescription.patientMRN}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Age</p>
                    <p className="font-semibold text-gray-800">{selectedPrescription.age} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Gender</p>
                    <p className="font-semibold text-gray-800">{selectedPrescription.gender}</p>
                  </div>
                </div>
              </div>

              {/* Prescription Information */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FileText className="text-blue-600" size={20} />
                  Prescription Information
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Diagnosis</p>
                    <p className="font-medium text-gray-800">{selectedPrescription.diagnosis}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Prescribed By</p>
                      <p className="font-medium text-gray-800">{selectedPrescription.prescribedBy}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-medium text-gray-800">{selectedPrescription.date}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Status</p>
                    <div className="flex gap-2">
                      {['active', 'completed', 'cancelled'].map(status => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(selectedPrescription.id, status as any)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            selectedPrescription.status === status
                              ? getStatusColor(status)
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Medications */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Calendar className="text-blue-600" size={20} />
                  Medications
                </h4>
                <div className="space-y-3">
                  {selectedPrescription.medications.map((med, index) => (
                    <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                      <p className="font-semibold text-gray-800 mb-2">{med.name}</p>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Dosage</p>
                          <p className="font-medium text-gray-800">{med.dosage}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Frequency</p>
                          <p className="font-medium text-gray-800">{med.frequency}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Duration</p>
                          <p className="font-medium text-gray-800">{med.duration}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedPrescription.notes && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Additional Notes</h4>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-gray-800">{selectedPrescription.notes}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3">
              <button
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Download PDF
              </button>
              <button
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
              >
                <Edit size={18} />
                Edit Prescription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ConsultantMedication