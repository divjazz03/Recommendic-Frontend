import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Bell,
  Shield,
  Camera,
  Save,
  Check,
  DoorOpen,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import {
  PatientNotificationSetting,
  useNotificationSettings,
} from "@/hooks/useNotificationSettings";
import { PatientProfileData, usePatientProfile } from "@/hooks/useProfile";
import { useSecuritySetting } from "@/hooks/useSecuritySetting";
import { useLogout } from "@/lib/actions/generalQueriesAndMutation";
import InitialsOrAvartar from "../shared/InitialsOrAvartar";

import { Address, LifeStyleInformation, MedicalCategory, MedicalHistory } from "@/types";

import ProfilePictureModal from "../shared/ProfilePictureModal";
import SecurityAndPrivacy from "../shared/SecurityAndPrivacy";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { MultiSelect, MultiSelectContent, MultiSelectGroup, MultiSelectItem, MultiSelectTrigger, MultiSelectValue } from "../ui/multi-select";

const PatientProfile = () => {
  const [activeTab, setActiveTab] = useState("");
  const { mutateAsync: logout } = useLogout();
  const handleLogout = async () => {
    await logout();
    window.location.pathname = "/sign-in";
  };

  const {
    handleNotificationChange,
    handleSaveNotificationSetting,
    notificationSettingsHasBeenModified,
    notificationSettings,
  } = useNotificationSettings();

  const patientNotificationSettings =
    notificationSettings as PatientNotificationSetting;

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
    medicalCategories,
    handleLifeStyleChange,
    handleMedicalHistoryChange
  } = usePatientProfile();

  const { handleSettingChange, securitySettings } = useSecuritySetting();

  if (!activeTab) {
    return (
      <ProfileNavigation
        activeTab={activeTab}
        handleLogout={handleLogout}
        setActiveTab={setActiveTab}
        profileData={profileData}
      />
    );
  }

  return (
    <div className="h-full">
      {/* Header */}
      <div className="bg-white ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-2 sm:py-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Settings & Profile
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Manage your account settings and personal information
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <Check className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-800 font-medium">
              Profile updated successfully!
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Information Tab */}
            {activeTab === "profile" && profileData && (
              <ProfileInformation
                handleAddressChange={handleAddressChange}
                handleCancelEdit={handleCancelEdit}
                handleInputChange={handleInputChange}
                handleSaveProfile={handleSaveProfile}
                handleStartEdit={handleStartEdit}
                isEditing={isEditing}
                medicalCategories={medicalCategories}
                profileData={profileData}
                selectedCategories={selectedCategories}
                handleInterestsChange={handleInterestsChange}
                setActiveTab={setActiveTab}
                handleLifeStyleChange={handleLifeStyleChange}
                handleMedicalHistoryChange={handleMedicalHistoryChange}
              />
            )}
            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <NotificationPreferences
                handleNotificationChange={handleNotificationChange}
                handleSaveNotificationSetting={handleSaveNotificationSetting}
                notificationSettingsHasBeenModified={
                  notificationSettingsHasBeenModified
                }
                patientNotificationSettings={patientNotificationSettings}
                setActiveTab={setActiveTab}
              />
            )}
            {/* Privacy Settings */}
            {activeTab === "security" && (
              <SecurityAndPrivacy
                handleSettingChange={handleSettingChange}
                securitySettings={securitySettings}
                setActiveTab={setActiveTab}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;

interface ProfileNavigationProps {
  setActiveTab: (value: React.SetStateAction<string>) => void;
  handleLogout: () => void;
  activeTab: string;
  profileData: PatientProfileData | undefined;
}
const ProfileNavigation = ({
  setActiveTab,
  activeTab,
  handleLogout,
  profileData,
}: ProfileNavigationProps) => (
  <>
    <main className="h-full p-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-6 h-full">
        <div className="flex items-center gap-4">
          <div className="relative">
            <InitialsOrAvartar
              userName={`${profileData?.lastName} ${profileData?.firstName}`}
              avatarUrl={profileData?.profileImgUrl}
              className="w-16 h-16"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {profileData?.firstName} {profileData?.lastName}
            </h2>
          </div>
        </div>
        <div className="bg-white flex-1 rounded-lg shadow-sm p-4">
          <nav className="space-y-1">
            {[
              { id: "profile", label: "Profile Information", icon: User },
              { id: "notifications", label: "Notifications", icon: Bell },
              { id: "security", label: "Security & Privacy", icon: Shield },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-sm">{tab.label}</span>
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-gray-700 hover:bg-gray-50"
            >
              <DoorOpen />
              <span className="text-sm">Logout</span>
            </button>
          </nav>
        </div>
      </div>
    </main>
  </>
);

interface ProfileInformationProps {
  profileData: PatientProfileData;
  isEditing: boolean;
  handleStartEdit: () => void;
  handleCancelEdit: () => void;
  handleSaveProfile: () => void;
  handleInputChange: (field: keyof PatientProfileData, value: string) => void;
  handleAddressChange: (field: keyof Address, value: string) => void;
  handleInterestsChange: (values: string[]) => void
  handleLifeStyleChange:(field: keyof LifeStyleInformation, value: string) => void
  handleMedicalHistoryChange:(field: keyof MedicalHistory, value: string) => void
  medicalCategories: MedicalCategory[] | undefined;
  selectedCategories: MedicalCategory[] | undefined;
  setActiveTab: (value: React.SetStateAction<string>) => void;
}

const ProfileInformation: React.FC<ProfileInformationProps> = ({
  handleStartEdit,
  profileData,
  handleAddressChange,
  handleCancelEdit,
  handleInputChange,
  handleSaveProfile,
  isEditing,
  medicalCategories,
  selectedCategories,
  handleInterestsChange,
  setActiveTab,
  handleLifeStyleChange,
  handleMedicalHistoryChange
}) => {
  const [imageUpdateModalOpen, setImageUpdateModalOpen] = useState(false);
  return (
    <>
      <div className="bg-white rounded-lg shadow-sm space-y-2">
        {/* Profile Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <div
                className="p-2 rounded-sm hover:bg-main/15"
                onClick={() => setActiveTab("")}
              >
                <ArrowLeft />
              </div>
              <div className="relative">
                <InitialsOrAvartar
                  userName={`${profileData?.lastName} ${profileData?.firstName}`}
                  avatarUrl={profileData?.profileImgUrl}
                  className="w-16 h-16"
                />
                <button
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                  disabled={!isEditing}
                  onClick={() => setImageUpdateModalOpen(true)}
                >
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
                onClick={handleStartEdit}
                className="px-2 sm:px-4 py-1 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="px-2 py-1 sm:px-4 sm:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-2 py-1 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <Input
                type="text"
                value={profileData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <Input
                type="text"
                value={profileData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email Address
              </label>
              <Input
                type="email"
                value={profileData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={true}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone Number
              </label>
              <Input
                type="tel"
                value={profileData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Type
              </label>
              <Select
                name="bloodType"
                value={profileData.bloodType}
                disabled={!isEditing}
              >
                <SelectTrigger value={profileData.bloodType} aria-placeholder={'Provide your blood type'} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 text-gray-500  focus:border-transparent">
                  {profileData.bloodType}</SelectTrigger>
                <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date of Birth
              </label>
              <Input
                type="date"
                value={profileData.dateOfBirth}
                onChange={(e) =>
                  handleInputChange("dateOfBirth", e.target.value)
                }
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <Select
                value={profileData.gender}
                onValueChange={(e) => handleInputChange("gender", e)}
                disabled={true}
              >
                <SelectTrigger className="capitalize">
                  {profileData.gender}
                </SelectTrigger>
              </Select>
            </div>
          </div>

        <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Emergency Contact Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Emergency Contact Name
          </label>
          <input
            type="text"
            name="emergencyContact"
            value={profileData.emergencyContact}
            placeholder="Full name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2  focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Emergency Contact Phone
          </label>
          <input
            type="tel"
            name="emergencyPhone"
            value={profileData.emergencyPhone}
            placeholder="+234 800 000 0000"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2  focus:border-transparent"
          />
        </div>
      </div>

          <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
            Address
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <Input
                type="text"
                value={profileData?.address?.city}
                onChange={(e) => handleAddressChange("city", e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <Input
                type="text"
                value={profileData?.address?.state}
                onChange={(e) => handleAddressChange("state", e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zip Code
              </label>
              <Input
                type="text"
                value={profileData?.address?.zipCode}
                onChange={(e) => handleAddressChange("zipCode", e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <Input
                type="text"
                value={profileData?.address?.country}
                onChange={(e) => handleAddressChange("country", e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
            Recommendation
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialization Of Interest
            </label>
            <MultiSelect defaultValues={selectedCategories?.map((v) => v.id)} onValuesChange={(e) => handleInterestsChange(e)}>
              <MultiSelectTrigger disabled={!isEditing} className="w-full h-10">
                <MultiSelectValue placeholder="Select Medical specializations of interest"/>
              </MultiSelectTrigger>
              <MultiSelectContent>
                <MultiSelectGroup>
                  {medicalCategories?.map((category) => (
                    <MultiSelectItem badgeLabel={category.name} value={category.id} key={category.id}>
                      <div className="flex w-full gap-2">
                        <p>{category.icon}</p>
                        <div className="flex flex-col justify-start">
                          <p className="text-sm sm:text-base font-semibold">{category.name}</p>
                          <p className="text-xs sm:text-sm font-light">{category.description}</p>
                        </div>
                      </div>
                  </MultiSelectItem>))}
                </MultiSelectGroup>
              </MultiSelectContent>
            </MultiSelect>
            {/* <MedicalCategorySelect
              categories={medicalCategories ?? []}
              selectedCategories={selectedCategories ?? []}
              disabled={!isEditing}
              handleInterestsChange={handleInterestsChange}
            /> */}
          </div>

          <section className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3 mt-6">
            <AlertCircle
              className="text-blue-600 flex-shrink-0 mt-1"
              size={20}
            />
            <div className="text-sm text-gray-700">
              <p className="font-medium text-gray-900 mb-1">
                Privacy & Security
              </p>
              <p>
                Your medical information is <strong>encrypted</strong> and only
                accessible by your healthcare providers. You can update this
                information anytime <strong>here</strong>.
              </p>
            </div>
          </section>

          <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
            Medical History
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor=""
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Known Allergies
              </label>
              <Textarea
                value={profileData.medicalHistory?.knownAllergies}
                onChange={(e) => handleMedicalHistoryChange('knownAllergies', e.target.value)}
                placeholder="e.g., Penicillin, Peanuts, Latex (or 'None')"
                rows={3}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label
                htmlFor=""
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Chronic Conditions
              </label>
              <Textarea
                value={profileData.medicalHistory?.chronicConditions}
                onChange={(e) => handleMedicalHistoryChange('chronicConditions', e.target.value)}
                placeholder="e.g., Diabetes, Hypertension, Asthma (or 'None')"
                rows={3}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label
                htmlFor=""
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Current Medications
              </label>
              <Textarea
                onChange={(e) => handleMedicalHistoryChange('currentMedications', e.target.value)}
                value={profileData.medicalHistory?.currentMedications}
                placeholder="List all medications you're currently taking (or 'None')"
                rows={3}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label
                htmlFor=""
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Past Surgeries
              </label>
              <Textarea
                onChange={(e) => handleMedicalHistoryChange('pastSurgries', e.target.value)}
                value={profileData.medicalHistory?.pastSurgries}
                placeholder="List any previous surgeries and approximate dates (or 'None')"
                rows={3}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label
                htmlFor=""
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Family Medical History
              </label>
              <Textarea
                value={profileData.medicalHistory?.familyMedicalHistory}
                onChange={(e) => handleMedicalHistoryChange('familyMedicalHistory', e.target.value)}
                placeholder="Notable conditions in immediate family (e.g., Heart disease, Cancer)"
                rows={3}
                disabled={!isEditing}
              />
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
            Lifestyle Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Smoking Status
              </label>
              <Select
                name="smokingStatus"
                value={profileData.lifeStyleInfo?.smokingStatus}
                onValueChange={(e) => {handleLifeStyleChange('smokingStatus', e)}}
                disabled={!isEditing}
              >
                <SelectTrigger className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2  focus:border-transparent">
                  Select Status
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never smoked</SelectItem>
                  <SelectItem value="former">Former smoker</SelectItem>
                  <SelectItem value="current">Current smoker</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alcohol Consumption
              </label>
              <Select
                name="alcoholConsumption"
                value={profileData.lifeStyleInfo?.alcoholConsumption}
                onValueChange={(e) => {handleLifeStyleChange('alcoholConsumption', e)}}
                disabled={!isEditing}
              >
                <SelectTrigger className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent">
                  Select Alcohol Consumption
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="occasional">Occasional</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="heavy">Heavy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exercise Frequency
              </label>
              <Select
                name="exerciseFrequency"
                value={profileData.lifeStyleInfo?.exerciseFrequency}
                onValueChange={(e) => {handleLifeStyleChange('exerciseFrequency', e)}}
                disabled={!isEditing}
              >
                <SelectTrigger className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent">
                  Select Exercise Frequency
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Rarely/Never</SelectItem>
                  <SelectItem value="1-2">1-2 times per week</SelectItem>
                  <SelectItem value="3-4">3-4 times per week</SelectItem>
                  <SelectItem value="5+">5+ times per week</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dietary Restrictions
              </label>
              <input
                disabled={!isEditing}
                type="text"
                name="dietaryRestrictions"
                value={profileData.lifeStyleInfo?.dietaryRestrictions}
                onChange={(e) => handleLifeStyleChange('dietaryRestrictions', e.target.value)}
                placeholder="e.g., Vegetarian, Gluten-free"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
      {imageUpdateModalOpen && (
        <ProfilePictureModal
          setImageUpdateModalOpen={setImageUpdateModalOpen}
          handleSetProfileImgPicture={(url) => {
            handleInputChange("profileImgUrl", url);
          }}
        />
      )}
    </>
  );
};

interface NotificationPreferencesProps {
  handleNotificationChange: (value: keyof PatientNotificationSetting) => void;
  patientNotificationSettings: PatientNotificationSetting;
  notificationSettingsHasBeenModified: () => boolean;
  handleSaveNotificationSetting: () => void;
  setActiveTab: (value: React.SetStateAction<string>) => void;
}

const NotificationPreferences = ({
  handleNotificationChange,
  patientNotificationSettings,
  notificationSettingsHasBeenModified,
  handleSaveNotificationSetting,
  setActiveTab,
}: NotificationPreferencesProps) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <header className="flex items-center justify-start gap-2 border-b pb-6">
      <div
        className="p-2 rounded-sm hover:bg-main/15"
        onClick={() => setActiveTab("")}
      >
        <ArrowLeft />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">
        Notification Preferences
      </h3>
    </header>

    <div className="space-y-6">
      <div className="space-y-4">
        {[
          {
            key: "emailNotificationsEnabled",
            label: "Email Notifications",
            description: "Receive notifications via email",
          },
          {
            key: "smsNotificationsEnabled",
            label: "SMS Notifications",
            description: "Receive notifications via text message",
          },
          {
            key: "appointmentRemindersEnabled",
            label: "Appointment Reminders",
            description: "Get reminders for upcoming appointments",
          },
          {
            key: "labResultUpdatesEnabled",
            label: "Lab Result Alerts",
            description: "Notify when lab results are available",
          },
          {
            key: "systemUpdatesEnabled",
            label: "System Updates",
            description: "Receive updates about system changes",
          },
          {
            key: "marketingEmailsEnabled",
            label: "Marketing Emails",
            description: "Receive promotional and marketing content",
          },
        ].map((setting) => (
          <div
            key={setting.key}
            className="flex items-center justify-between py-3 "
          >
            <div>
              <p className="font-medium text-sm sm:text-base text-gray-900">
                {setting.label}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                {setting.description}
              </p>
            </div>
            <button
              onClick={() =>
                handleNotificationChange(
                  setting.key as keyof PatientNotificationSetting
                )
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                patientNotificationSettings[
                  setting.key as keyof PatientNotificationSetting
                ]
                  ? "bg-blue-600"
                  : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  patientNotificationSettings[
                    setting.key as keyof PatientNotificationSetting
                  ]
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-end pt-4 ">
        <button
          disabled={!notificationSettingsHasBeenModified()}
          onClick={() => handleSaveNotificationSetting()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:bg-gray-400"
        >
          <Save className="w-4 h-4" />
          Save Notification Preference
        </button>
      </div>
    </div>
  </div>
);
