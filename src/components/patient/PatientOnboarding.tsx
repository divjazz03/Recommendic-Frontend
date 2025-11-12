import MedicalCategoryCard from '@/components/MedicalCategoryCard';
import Loader from '@/components/shared/Loader';
import { Button } from '@/components/ui/button';
import { useUserContext } from '@/context/AuthContext';
import { useGetSupportedMedicalCategories, useUpdatePatientOnboardingInfo } from '@/lib/react-query/generalQueriesAndMutation';
import { MedicalCategory } from '@/types';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

enum SelectAction {
    UNSELECT = "UNSELECT",
    SELECT = "SELECT"
}


const PatientOnboarding = () => {

    const { error: errorGettingSupportedCategories, data: supportedCategories, isPending: isLoadingMedicalCategories } = useGetSupportedMedicalCategories();
    const navigate = useNavigate();
    const { userContext } = useUserContext();
    if (userContext.userStage === 'ACTIVE_USER') {
        navigate('/')
    }
    const [specialties, setSpecialties] = useState<MedicalCategory[]>([])
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const { mutateAsync: updatePatientOnboardingInfo, isPending:isUpdating, isError, error } = useUpdatePatientOnboardingInfo()

    useEffect(() => {
        if (supportedCategories) {
            setSpecialties(supportedCategories.data)
        }
    }, [supportedCategories?.data]);
    const handleSelectedInterestsChange = (interest: string, action: SelectAction) => {
        if (action === SelectAction.SELECT) {
            if (!selectedInterests.includes(interest)) {
                setSelectedInterests(prev => [...prev, interest]);
            }
        } else {
            setSelectedInterests(prev => prev.filter(item => item !== interest));
        }
    }
    const handleNext = async () => {

        if (selectedInterests.length > 0) {
            console.log(selectedInterests)
                await updatePatientOnboardingInfo({
                    interests: selectedInterests.filter(interest => interest != " "),
                    userId: userContext.user_id
                })
                if (!isUpdating) {
                    if (!isError) {
                        navigate('/');
                        return toast('Thanks for helping us serve you better')
                    }
                    return toast.error(`Onboarding Failed: ${error.message}`)
                }
            }

    else {
            return toast.error('Please choose at least one option');
        }
    }
    return (
        <>
            <main className=''>
                {
                    isLoadingMedicalCategories ? <Loader /> :
                        errorGettingSupportedCategories ? <p className='h1-bold'>Couldn't retrieve at this moment</p> :
                            <div className='h1-bold'>
                                <header className='text-center'>Patient&nbsp;Onboarding</header>

                                <section className=' px-10 py-10 '>
                                    <div className={'flex flex-row flex-wrap justify-left gap-4'}>
                                        {
                                            specialties.map((categoryName, index) => (
                                                <MedicalCategoryCard
                                                    key={index}
                                                    categoryName={categoryName.name}
                                                    categoryDescription={categoryName.description}
                                                    selectActionHandler={handleSelectedInterestsChange}
                                                    disabled={false}
                                                />
                                            ))
                                        }
                                    </div>
                                </section>
                                <Button className='tracking-normal shad-button_primary' onClick={handleNext}>
                                    {isUpdating? <Loader/>: 'Next'}
                                </Button>
                            </div>
                }

            </main>
        </>
    )
}

export default PatientOnboarding