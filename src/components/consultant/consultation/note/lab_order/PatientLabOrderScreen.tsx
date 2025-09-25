
import { AlertCircle, ArrowLeft, Calendar, CheckCircle, Clock, Download, FileText, Filter, Mail, Phone, Plus, Search, User } from 'lucide-react';
import React, { useMemo, useState } from 'react'

interface PatientLabOrderScreenProps {
    backToHome: () => void
}
type Priority = 'urgent' | 'routine' | 'STAT'
type Status = 'pending' | 'completed' | 'processing'
interface LabOrder {
    id: string
    testType: string
    orderDate: string
    resultDate?: string
    priority: Priority
    status: Status
    physician: string
    expectedDate: string
    department: string
    fastingRequired: boolean
    instructions: string
    results?: 'Available'
}
const statusTabs = [
    { key: 'all', label: 'All Orders' },
    { key: 'pending', label: 'Pending' },
    { key: 'processing', label: 'Processing' },
    { key: 'completed', label: 'Completed' }
]
const patient = {
    id: 'P-4521',
    name: 'Sarah Johnson',
    age: 45,
    gender: 'Female',
    dateOfBirth: '1978-03-15',
    phone: '+1 (555) 123-4567',
    email: 'sarah.johnson@email.com',
    address: '123 Main St, Springfield, IL 62701',
    allergies: ['Penicillin', 'Shellfish'],
    bloodType: 'O+'
};

const staticlabOrders: LabOrder[]= [
    {
        id: 'LO-2024-001',
        testType: 'Complete Blood Count (CBC)',
        orderDate: '2024-09-06',
        priority: 'routine',
        status: 'pending',
        physician: 'Dr. Michael Chen',
        expectedDate: '2024-09-07',
        department: 'Hematology',
        fastingRequired: false,
        instructions: 'Standard CBC with differential'
    },
    {
        id: 'LO-2024-002',
        testType: 'Lipid Panel',
        orderDate: '2024-09-05',
        priority: 'routine',
        status: 'completed',
        physician: 'Dr. Emily Rodriguez',
        expectedDate: '2024-09-06',
        department: 'Chemistry',
        fastingRequired: true,
        instructions: '12-hour fasting required',
        resultDate: '2024-09-06',
        results: 'Available'
    },
    {
        id: 'LO-2024-003',
        testType: 'Thyroid Function Tests (TSH, T3, T4)',
        orderDate: '2024-09-04',
        priority: 'urgent',
        status: 'completed',
        physician: 'Dr. James Wilson',
        expectedDate: '2024-09-05',
        department: 'Endocrinology',
        fastingRequired: false,
        instructions: 'Follow-up for thyroid medication adjustment',
        resultDate: '2024-09-05',
        results: 'Available'
    },
    {
        id: 'LO-2024-004',
        testType: 'HbA1c',
        orderDate: '2024-09-06',
        priority: 'routine',
        status: 'processing',
        physician: 'Dr. Lisa Thompson',
        expectedDate: '2024-09-07',
        department: 'Chemistry',
        fastingRequired: false,
        instructions: 'Diabetes monitoring'
    },
    {
        id: 'LO-2024-005',
        testType: 'Vitamin D (25-OH)',
        orderDate: '2024-08-30',
        priority: 'routine',
        status: 'completed',
        physician: 'Dr. Michael Chen',
        expectedDate: '2024-09-02',
        department: 'Chemistry',
        fastingRequired: false,
        instructions: 'Annual wellness check',
        resultDate: '2024-09-02',
        results: 'Available'
    }
];


const getStatusIcon = (status: string) => {
    switch (status) {
        case 'pending':
            return <Clock className="w-4 h-4 text-yellow-500" />;
        case 'processing':
            return <AlertCircle className="w-4 h-4 text-blue-500" />;
        case 'completed':
            return <CheckCircle className="w-4 h-4 text-green-500" />;
        default:
            return <Clock className="w-4 h-4 text-gray-500" />;
    }
};

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'STAT':
            return 'bg-red-100 text-red-800';
        case 'urgent':
            return 'bg-orange-100 text-orange-800';
        case 'routine':
            return 'bg-blue-100 text-blue-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const PatientLabOrderScreen: React.FC<PatientLabOrderScreenProps> = ({ backToHome }) => {

    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [labOrders, setLabOrders] = useState<LabOrder[]>(staticlabOrders);


    const filteredOrders = useMemo(() => labOrders.filter(order => {
        const matchesTab = activeTab === 'all' || order.status === activeTab;
        const matchesSearch = order.testType.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.physician.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    }), [activeTab,searchQuery]);

    const tabCounts = {
        all: labOrders.length,
        pending: labOrders.filter(o => o.status === 'pending').length,
        processing: labOrders.filter(o => o.status === 'processing').length,
        completed: labOrders.filter(o => o.status === 'completed').length
    };

    return (
        <div className='h-full overflow-auto scrollbar-hide lg:min-w-[60em] lg:max-w-[60em]'>
            {/* Header */}
            <div className="bg-white shadow-sm border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 ">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => backToHome()}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Lab Orders</h1>
                                <p className="text-sm text-gray-600 mt-1">Patient: {patient.name} (ID: {patient.id})</p>
                            </div>
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                            <Plus className="w-4 h-4" />
                            New Lab Order
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col py-6">
                {/* Patient Information Card */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h2>
                    <div className="grid grid-cols-1 gap-6">
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">{patient.name}</h3>
                                <p className="text-sm text-gray-600">ID: {patient.id}</p>
                                <p className="text-sm text-gray-600">{patient.age} years old, {patient.gender}</p>
                                <p className="text-sm text-gray-600">DOB: {patient.dateOfBirth}</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Phone className="w-4 h-4" />
                                    {patient.phone}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Mail className="w-4 h-4" />
                                    {patient.email}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">Medical Information</h4>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-600">Blood Type: <span className="font-medium">{patient.bloodType}</span></p>
                                <p className="text-sm text-gray-600">Allergies: <span className="font-medium text-red-600">{patient.allergies.join(', ')}</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search by test type, order ID, or physician..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <Filter className="w-4 h-4" />
                            Filters
                        </button>
                    </div>
                </div>

                {/* Status Tabs */}
                <div className="bg-white rounded-lg shadow-sm mb-6 ">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6 overflow-x-auto scrollbar-hide">
                            {statusTabs.map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.key
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {tab.label}
                                    <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                                        {tabCounts[tab.key as keyof typeof tabCounts]}
                                    </span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Lab Orders List */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="table-auto">
                            <thead className="bg-gray-50 border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                                        Order Details
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                                        Test Information
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                                        Physician
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                                        Priority
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs  text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-4 w-full">
                                            <div className="text-sm font-medium text-gray-900 lg:text-nowrap">{order.id}</div>
                                            <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                <Calendar className="w-3 h-3" />
                                                Ordered: {order.orderDate}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{order.testType}</div>
                                                <div className="text-sm text-gray-500">{order.department}</div>
                                                {order.fastingRequired && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 mt-1">
                                                        Fasting Required
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{order.physician}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getPriorityColor(order.priority)}`}>
                                                {order.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(order.status)}
                                                <span className="text-sm text-gray-900 capitalize">{order.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {order.status === 'completed' ? `Completed: ${order.resultDate}` : `Expected: ${order.expectedDate}`}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {order.status === 'completed' && order.results && (
                                                    <button className="text-green-600 hover:text-green-800 transition-colors">
                                                        <Download className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button className="text-blue-600 hover:text-blue-800 transition-colors">
                                                    <FileText className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredOrders.length === 0 && (
                        <div className="text-center py-12">
                            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-sm font-medium text-gray-900 mb-2">No lab orders found</h3>
                            <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
                        </div>
                    )}
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Clock className="h-8 w-8 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                                <p className="text-2xl font-bold text-gray-900">{tabCounts.pending}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <AlertCircle className="h-8 w-8 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Processing</p>
                                <p className="text-2xl font-bold text-gray-900">{tabCounts.processing}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Completed</p>
                                <p className="text-2xl font-bold text-gray-900">{tabCounts.completed}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <FileText className="h-8 w-8 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                                <p className="text-2xl font-bold text-gray-900">{tabCounts.all}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PatientLabOrderScreen