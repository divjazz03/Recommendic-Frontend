import React, { useState } from 'react';
import { User, Mail, Phone,  Calendar, Bell, Shield, Camera, Save, Check} from 'lucide-react';
import MedicalCategorySelect from '../ui/MedicalCategorySelect';
import { PatientNotificationSetting, useNotificationSettings } from '@/hooks/useNotificationSettings';
import { usePatientProfile } from '@/hooks/useProfile';
import { useSecuritySetting } from '@/hooks/useSecuritySetting';


const PatientProfile = () => {
    const [activeTab, setActiveTab] = useState('profile');
    
    const {
        handleNotificationChange,
        handleSaveNotificationSetting,
        notificationSettingsHasBeenModified,
        notificationSettings
    } = useNotificationSettings();

    const patientNotificationSettings = notificationSettings as PatientNotificationSetting

    const {
        handleAddressChange,
        handleCancelEdit,
        handleInputChange,
        handleInterestsChange,
        handleSaveProfile,
        handleStartEdit,
        isEditing,
        selectedCategories,
        showSuccessMessage,
        profileData,
        medicalCategories
    } = usePatientProfile()

    const {
        handleSettingChange,
        securitySettings
    } = useSecuritySetting();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-4">
                        <h1 className="text-2xl font-bold text-gray-900">Settings & Profile</h1>
                        <p className="text-sm text-gray-600 mt-1">Manage your account settings and personal information</p>
                    </div>
                </div>
            </div>

            {/* Success Message */}
            {showSuccessMessage && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-600" />
                        <p className="text-sm text-green-800 font-medium">Profile updated successfully!</p>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <nav className="space-y-1">
                                {[
                                    { id: 'profile', label: 'Profile Information', icon: User },
                                    { id: 'notifications', label: 'Notifications', icon: Bell },
                                    { id: 'security', label: 'Security & Privacy', icon: Shield }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === tab.id
                                            ? 'bg-blue-50 text-blue-700 font-medium'
                                            : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <tab.icon className="w-5 h-5" />
                                        <span className="text-sm">{tab.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Profile Information Tab */}
                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-lg shadow-sm">
                                {/* Profile Header */}
                                <div className="p-6 border-b">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <User className="w-12 h-12 text-blue-600" />
                                                </div>
                                                <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                                                    <Camera className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-900">
                                                    {profileData?.firstName} {profileData?.lastName}
                                                </h2>
                                            </div>
                                        </div>
                                        {!isEditing ? (
                                            <button
                                                onClick={() => handleStartEdit()}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                Edit Profile
                                            </button>
                                        ) : (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleSaveProfile}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    Save Changes
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Profile Form */}
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData?.firstName}
                                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                                disabled={!isEditing}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData?.lastName}
                                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                                disabled={!isEditing}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Mail className="w-4 h-4 inline mr-1" />
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                value={profileData?.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                disabled={!isEditing}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Phone className="w-4 h-4 inline mr-1" />
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                value={profileData?.phoneNumber}
                                                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                                disabled={!isEditing}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Calendar className="w-4 h-4 inline mr-1" />
                                                Date of Birth
                                            </label>
                                            <input
                                                type="date"
                                                value={profileData?.dateOfBirth}
                                                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                                disabled={!isEditing}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Gender
                                            </label>
                                            <select
                                                value={profileData?.gender}
                                                onChange={(e) => handleInputChange('gender', e.target.value)}
                                                disabled={!isEditing}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                                            >
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Address</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                            <input
                                                type="text"
                                                value={profileData?.address?.city}
                                                onChange={(e) => handleAddressChange('city', e.target.value)}
                                                disabled={!isEditing}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                            <input
                                                type="text"
                                                value={profileData?.address?.state}
                                                onChange={(e) => handleAddressChange('state', e.target.value)}
                                                disabled={!isEditing}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                                            <input
                                                type="text"
                                                value={profileData?.address?.zipCode}
                                                onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                                                disabled={!isEditing}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                                            <input
                                                type="text"
                                                value={profileData?.address?.country}
                                                onChange={(e) => handleAddressChange('country', e.target.value)}
                                                disabled={!isEditing}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                                            />
                                        </div>

                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Address</h3>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>Specialization Of Interest</label>
                                        <MedicalCategorySelect categories={medicalCategories} selectedCategories={selectedCategories} disabled={!isEditing} handleInterestsChange={handleInterestsChange} />
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h3>

                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        {[
                                            { key: 'emailNotificationsEnabled', label: 'Email Notifications', description: 'Receive notifications via email' },
                                            { key: 'smsNotificationsEnabled', label: 'SMS Notifications', description: 'Receive notifications via text message' },
                                            { key: 'appointmentRemindersEnabled', label: 'Appointment Reminders', description: 'Get reminders for upcoming appointments' },
                                            { key: 'labResultUpdatesEnabled', label: 'Lab Result Alerts', description: 'Notify when lab results are available' },
                                            { key: 'systemUpdatesEnabled', label: 'System Updates', description: 'Receive updates about system changes' },
                                            { key: 'marketingEmailsEnabled', label: 'Marketing Emails', description: 'Receive promotional and marketing content' }
                                        ].map((setting) => (

                                            <div key={setting.key} className="flex items-center justify-between py-3 border-b last:border-b-0">
                                                <div>
                                                    <p className="font-medium text-gray-900">{setting.label}</p>
                                                    <p className="text-sm text-gray-500">{setting.description}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleNotificationChange(setting.key as keyof PatientNotificationSetting)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${patientNotificationSettings[setting.key as keyof PatientNotificationSetting] ? 'bg-blue-600' : 'bg-gray-300'}`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${patientNotificationSettings[setting.key as keyof PatientNotificationSetting] ? 'translate-x-6' : 'translate-x-1'}`} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-end pt-4 border-t">
                                        <button
                                            disabled = {!notificationSettingsHasBeenModified()}
                                            onClick={() => handleSaveNotificationSetting()}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:bg-gray-400">
                                            <Save className="w-4 h-4" />
                                            Save Notification Preference
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Privacy Settings */}
                        {activeTab === 'security' && (
                            <div className='bg-white p-6 rounded-lg'>
                                <h2 className='font-medium text-lg text-gray-900 mb-6'>Security & Privacy</h2>
                                <div>
                                    <h3 className='font-medium text-gray-900 mb-4'>Security Settings</h3>
                                    <div className='flex flex-col gap-3 border-b mb-6'>
                                        <div>
                                            <label className="block font-medium text-gray-900 mb-2">
                                                Session Timeout
                                            </label>
                                            <select
                                                value={securitySettings.sessionTimeoutMin}
                                                onChange={(e) => handleSettingChange('sessionTimeoutMin', e.target.value)}
                                                className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            >
                                                <option value={15}>15 minutes</option>
                                                <option value={30}>30 minutes</option>
                                                <option value={60}>1 hour</option>
                                                <option value={120}>2 hours</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center justify-between py-3 ">
                                            <div>
                                                <p className="font-medium text-gray-900">Multi-Factor Authentication</p>
                                                <p className="text-sm text-gray-500">Enable multi factor authentication</p>
                                            </div>
                                            <button
                                                onClick={() => handleSettingChange('multiFactorAuthEnabled', !securitySettings['multiFactorAuthEnabled'])}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${securitySettings['multiFactorAuthEnabled'] ? 'bg-blue-600' : 'bg-gray-300'}`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${securitySettings['multiFactorAuthEnabled'] ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                        </div>
                                        {/* Active Sessions */}
                                        <div className="pb-6">
                                            <h4 className=" text-gray-900 mb-4">Active Sessions</h4>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                    <div>
                                                        <p className="font-medium text-gray-900">Current Session</p>
                                                        <p className="text-sm text-gray-600">Chrome on Windows • Ibadan, Nigeria</p>
                                                        <p className="text-xs text-gray-500 mt-1">Active now</p>
                                                    </div>
                                                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                                        Active
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                    <div>
                                                        <p className="font-medium text-gray-900">Mobile Device</p>
                                                        <p className="text-sm text-gray-600">Safari on iPhone • Lagos, Nigeria</p>
                                                        <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                                                    </div>
                                                    <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                                                        Revoke
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>


                                <h4 className="font-medium text-gray-900 mb-4">Privacy Settings</h4>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900">Profile Visibility</p>
                                            <p className="text-sm text-gray-500">Control who can see your profile information</p>
                                        </div>
                                        <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                                            <option>Everyone</option>
                                            <option>Staff Only</option>
                                            <option>Private</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900">Activity Status</p>
                                            <p className="text-sm text-gray-500">Show when you're online</p>
                                        </div>
                                        <button
                                            onClick={() => handleSettingChange('loginAlertsEnabled', !securitySettings['loginAlertsEnabled'])}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors ${securitySettings['loginAlertsEnabled'] ? 'bg-blue-600' : 'bg-gray-300'}`}>
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${securitySettings['loginAlertsEnabled'] ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4 border-t">
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                                        <Save className="w-4 h-4" />
                                        Save Security Settings
                                    </button>
                                </div>
                            </div>
                        )

                        }

                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientProfile