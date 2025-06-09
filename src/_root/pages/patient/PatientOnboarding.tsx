import MedicalCategoryCard from '@/components/MedicalCategoryCard';
import Loader from '@/components/shared/Loader';
import { Button } from '@/components/ui/button';
import { useUserContext } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useGetSupportedMedicalCategories, useUpdatePatientOnboardingInfo } from '@/lib/react-query/queriiesAndMutation';
import { MedicalCategory } from '@/types';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

enum SelectAction {
    UNSELECT = "UNSELECT",
    SELECT = "SELECT"
}


const PatientOnboarding = () => {

    const { error: errorGettingSupportedCategories, data: supportedCategories, isPending: isLoadingMedicalCategories } = useGetSupportedMedicalCategories();
    const { userContext } = useUserContext();
    const [specialties, setSpecialties] = useState<MedicalCategory[]>([])
    const [selectedInterests, setSelectedInterests] = useState([]);
    const { mutateAsync: updatePatientOnboardingInfo, isPending:isUpdating } = useUpdatePatientOnboardingInfo()
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        if (supportedCategories) {
            setSpecialties(supportedCategories.data)
        }
    }, [supportedCategories]);
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
            try {
                await updatePatientOnboardingInfo({
                    interests: selectedInterests.filter(interest => interest != " "),
                    userId: userContext.user_id
                })
                navigate('/patient/overview');
                return toast({ title: 'Thanks for helping us serve you better' })
            } catch (error) {
                return toast({ title: `Onboarding Failed: ${error.message}`, variant: 'destructive' })
            }

        } else {
            return toast({ title: 'Please choose at least one', variant: 'destructive' });
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