import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Briefcase, GraduationCap, Award, Lock, Bell, Shield, Camera, Save, X, Check, Eye, EyeOff, DoorOpen } from 'lucide-react';
import { ConsultantNotificationSetting, useNotificationSettings } from '@/hooks/useNotificationSettings';
import { ConsultantProfileData, ModifyingConsultantProfileData, useConsultantProfile } from '@/hooks/useProfile';
import { useLogout } from '@/lib/react-query/generalQueriesAndMutation';
import MultiSelect from '../ui/MultiSelect';
import { ConsultantEducation } from '@/types';
import SecurityAndPrivacy from '../shared/SecurityAndPrivacy';
import { useSecuritySetting } from '@/hooks/useSecuritySetting';
import InitialsOrAvartar from '../shared/InitialsOrAvartar';
import ProfilePictureModal from '../shared/ProfilePictureModal';

const ConsultantProfile = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const { mutateAsync: logout, isPending: isLogginOut } = useLogout();

    const handleLogout = async () => {
        await logout();
        window.location.pathname = '/sign-in'
    }

    const {
        handleNotificationChange,
        handleSaveNotificationSetting,
        notificationSettings,
        notificationSettingsHasBeenModified,
    } = useNotificationSettings()
    const consultantNotificationSettings = notificationSettings as ConsultantNotificationSetting

    const {
        handleCancelEdit,
        handleInputChange,
        handleSaveProfile,
        handleStartEdit,
        isEditing,
        showSuccessMessage,
        profileData,
        handleEducationChange,
        handleLanguagesChange
    } = useConsultantProfile();

    console.log(profileData?.languages)

    const {
        handleSettingChange,
        securitySettings
    } = useSecuritySetting()



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
                                    { id: 'professional', label: 'Professional Details', icon: Briefcase },
                                    { id: 'notifications', label: 'Notifications', icon: Bell },
                                    { id: 'security', label: 'Security & Privacy', icon: Shield }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === tab.id
                                            ? 'bg-blue-50 text-main font-medium'
                                            : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <tab.icon className="w-5 h-5" />
                                        <span className="text-sm">{tab.label}</span>
                                    </button>
                                ))}
                                <button
                                    onClick={handleLogout}
                                    className='w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-gray-700 hover:bg-gray-50'>
                                    <DoorOpen />
                                    <span className='text-sm'>Logout</span>
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Profile Information Tab */}
                        {activeTab === 'profile' && (
                            !profileData ? <p>Couldn't retrieve profile data</p> :
                                <ProfileInformation
                                    handleCancelEdit={handleCancelEdit}
                                    handleInputChange={handleInputChange}
                                    handleSaveProfile={handleSaveProfile}
                                    handleStartEdit={handleStartEdit}
                                    isEditing={isEditing}
                                    profileData={profileData}
                                />
                        )}

                        {/* Professional Details Tab */}
                        {activeTab === 'professional' && (
                            !profileData ? <p>Profile data is undefined</p> :
                                <ProfessionalInformation
                                    handleCancelEdit={handleCancelEdit}
                                    handleEducationChange={handleEducationChange}
                                    handleInputChange={handleInputChange}
                                    handleLanguagesChange={handleLanguagesChange}
                                    handleSaveProfile={handleSaveProfile}
                                    isEditing={isEditing}
                                    profileData={profileData}
                                />
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <NotificationPreference 
                                consultantNotificationSettings={consultantNotificationSettings}
                                handleNotificationChange={handleNotificationChange}
                                handleSaveNotificationSetting={handleSaveNotificationSetting}
                                notificationSettingsHasBeenModified={notificationSettingsHasBeenModified}
                            />
                        )}
                        {/* Privacy Settings */}
                        {activeTab === 'security' && (
                            <SecurityAndPrivacy
                                handleSettingChange={handleSettingChange}
                                securitySettings={securitySettings}
                            />
                        )

                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

interface ProfileInformationProps {
    profileData: ConsultantProfileData,
    isEditing: boolean
    handleStartEdit: () => void
    handleCancelEdit: () => void
    handleSaveProfile: () => void
    handleInputChange: (field: keyof ModifyingConsultantProfileData, value: string) => void
}
const ProfileInformation: React.FC<ProfileInformationProps> = (
    {
        handleCancelEdit,
        handleInputChange,
        handleSaveProfile,
        handleStartEdit,
        isEditing,
        profileData
    }
) => {
    const [imageUpdateModalOpen, setImageUpdateModalOpen] = useState(false)
    return (
        <div className="bg-white rounded-lg shadow-sm">
            {/* Profile Header */}
            <div className="p-6 border-b">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            {/* <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="w-12 h-12 text-main" />
                            </div> */}
                            <InitialsOrAvartar name={`${profileData?.lastName} ${profileData?.firstName}`} avatarUrl={profileData?.profileImgUrl} height='90' width='90'/>
                            <button
                                disabled= {!isEditing}
                                onClick={() => setImageUpdateModalOpen(true)}
                                className="absolute bottom-0 right-0 bg-main-light disabled:bg-gray-600 disabled:hover:bg-gray-600 text-white p-2 rounded-full hover:bg-main transition-colors">
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                                Dr. {profileData?.firstName} {profileData?.lastName}
                            </h2>
                            <p className="text-gray-600 capitalize">{profileData?.specialty}</p>
                            <p className="text-sm text-gray-500">{profileData?.hospital}</p>
                        </div>
                    </div>
                    {!isEditing ? (
                        <button
                            onClick={() => handleStartEdit()}
                            className="px-4 py-2 bg-main-light text-white rounded-lg hover:bg-main transition-colors"
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
                                className="px-4 py-2 bg-main-light text-white rounded-lg hover:bg-main transition-colors flex items-center gap-2"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-light focus:border-main-light outline-none disabled:bg-gray-50 disabled:text-gray-500"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-light focus:border-main-light outline-none disabled:bg-gray-50 disabled:text-gray-500"
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
                            disabled={true}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-light focus:border-main-light outline-none disabled:bg-gray-50 disabled:text-gray-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Phone className="w-4 h-4 inline mr-1" />
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            value={profileData?.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-light focus:border-main-light outline-none disabled:bg-gray-50 disabled:text-gray-500"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-light focus:border-main-light outline-none disabled:bg-gray-50 disabled:text-gray-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Gender
                        </label>
                        <select
                            value={profileData?.gender}
                            disabled={true}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-light focus:border-main-light outline-none disabled:bg-gray-50 disabled:text-gray-500"
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <MapPin className="w-4 h-4 inline mr-1" />
                            Street Address
                        </label>
                        <input
                            type="text"
                            value={profileData?.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-light focus:border-main-light outline-none disabled:bg-gray-50 disabled:text-gray-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                            type="text"
                            value={profileData?.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-light focus:border-main-light outline-none disabled:bg-gray-50 disabled:text-gray-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                        <input
                            type="text"
                            value={profileData?.state}
                            onChange={(e) => handleInputChange('state', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-light focus:border-main-light outline-none disabled:bg-gray-50 disabled:text-gray-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                        <input
                            type="text"
                            value={profileData?.zipCode}
                            onChange={(e) => handleInputChange('zipCode', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-light focus:border-main-light outline-none disabled:bg-gray-50 disabled:text-gray-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                        <input
                            type="text"
                            value={profileData?.country}
                            onChange={(e) => handleInputChange('country', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-light focus:border-main-light outline-none disabled:bg-gray-50 disabled:text-gray-500"
                        />
                    </div>
                </div>
            </div>
            {imageUpdateModalOpen && <ProfilePictureModal
                        setImageUpdateModalOpen={setImageUpdateModalOpen}
                        handleSetProfileImgPicture={(url) => { handleInputChange('profileImgUrl', url) }} />}
        </div>
    )
}

interface ProfessionalInformationProps {
    profileData: ConsultantProfileData,
    isEditing: boolean
    handleCancelEdit: () => void
    handleSaveProfile: () => void
    handleInputChange: (field: keyof ModifyingConsultantProfileData, value: string) => void
    handleEducationChange: (field: keyof ConsultantEducation, value: unknown) => void
    handleLanguagesChange: (languages: string[]) => void
}

const ProfessionalInformation = (
    {
        handleCancelEdit,
        handleInputChange,
        handleSaveProfile,
        isEditing,
        profileData,
        handleEducationChange,
        handleLanguagesChange
    }: ProfessionalInformationProps
) => (
    <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Professional Information</h3>

        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Briefcase className="w-4 h-4 inline mr-1" />
                        Specialty
                    </label>
                    <input
                        type="text"
                        value={profileData?.specialty}
                        onChange={(e) => handleInputChange('specialty', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-light focus:border-main-light outline-none disabled:bg-gray-50 disabled:text-gray-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sub-Specialty
                    </label>
                    <input
                        type="text"
                        value={profileData?.subSpecialty}
                        onChange={(e) => handleInputChange('subSpecialty', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-light focus:border-main-light outline-none disabled:bg-gray-50 disabled:text-gray-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Medical License Number
                    </label>
                    <input
                        type="text"
                        value={profileData?.licenseNumber}
                        onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-light focus:border-main-light outline-none disabled:bg-gray-50 disabled:text-gray-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Years of Experience
                    </label>
                    <input
                        type="number"
                        value={profileData?.yearsOfExperience}
                        onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-light focus:border-main-light outline-none disabled:bg-gray-50 disabled:text-gray-500"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <GraduationCap className="w-4 h-4 inline mr-1" />
                        Education
                    </label>
                    <div className='flex gap-2'>
                        <input
                            type="number"
                            placeholder='year'
                            value={profileData?.education?.year}
                            onChange={(e) => handleEducationChange('year', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-light focus:border-main-light outline-none disabled:bg-gray-50 disabled:text-gray-500"
                        />
                        <input
                            type="text"
                            placeholder='institution'
                            value={profileData?.education?.institution}
                            onChange={(e) => handleEducationChange('institution', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-light focus:border-main-light outline-none disabled:bg-gray-50 disabled:text-gray-500"
                        /><input
                            type="text"
                            placeholder='degree'
                            value={profileData?.education?.degree}
                            onChange={(e) => handleEducationChange('degree', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-light focus:border-main-light outline-none disabled:bg-gray-50 disabled:text-gray-500"
                        />
                    </div>

                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Award className="w-4 h-4 inline mr-1" />
                        Board Certification
                    </label>
                    <input
                        type="text"
                        value={profileData?.boardCertification}
                        onChange={(e) => handleInputChange('boardCertification', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-light focus:border-main-light outline-none disabled:bg-gray-50 disabled:text-gray-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hospital/Clinic
                    </label>
                    <input
                        type="text"
                        value={profileData?.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-light focus:border-main-light outline-none disabled:bg-gray-50 disabled:text-gray-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department
                    </label>
                    <input
                        type="text"
                        value={profileData?.department}
                        disabled={true}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-light focus:border-main-light outline-none disabled:bg-gray-50 disabled:text-gray-500"
                    />
                </div>

                <div className=''>
                    <label>Languages</label>
                    <MultiSelect disabled={!isEditing} elements={['English', 'French', 'Spanish']} handleElementsChange={handleLanguagesChange} selectedElements={profileData?.languages ?? []} placeholder='Select Languages' />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Professional Bio
                    </label>
                    <textarea
                        value={profileData?.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        disabled={!isEditing}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-light focus:border-main-light outline-none disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                    />
                </div>
            </div>

            {isEditing && (
                <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveProfile}
                        className="px-4 py-2 bg-main-light text-white rounded-lg hover:bg-main transition-colors flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>
            )}
        </div>
    </div>
);


interface NotificationPreferenceProps {
    handleNotificationChange: (value: keyof ConsultantNotificationSetting) => void
    consultantNotificationSettings: ConsultantNotificationSetting
    notificationSettingsHasBeenModified: () => boolean
    handleSaveNotificationSetting: () => void
}

const NotificationPreference = (
    {
        handleNotificationChange,
        handleSaveNotificationSetting,
        notificationSettingsHasBeenModified,
        consultantNotificationSettings
    }: NotificationPreferenceProps
) => (
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
                            onClick={() => handleNotificationChange(setting.key as keyof ConsultantNotificationSetting)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${consultantNotificationSettings[setting.key as keyof ConsultantNotificationSetting] ? 'bg-main-light' : 'bg-gray-300'}`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${consultantNotificationSettings[setting.key as keyof ConsultantNotificationSetting] ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                ))}
            </div>
            <div className="flex justify-end pt-4 border-t">
                <button
                    disabled={!notificationSettingsHasBeenModified}
                    onClick={handleSaveNotificationSetting}
                    className="px-4 py-2 bg-main-light text-white rounded-lg hover:bg-main transition-colors flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Notification Preference
                </button>
            </div>

        </div>
    </div>
)

export default ConsultantProfile