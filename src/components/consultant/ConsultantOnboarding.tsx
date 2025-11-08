import MedicalCategoryCard from '@/components/MedicalCategoryCard';
import Loader from '@/components/shared/Loader';
import { Button } from '@/components/ui/button';
import { useUserContext } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useGetSupportedMedicalCategories, useUpdateConsultantOnboardingInfo } from '@/lib/react-query/generalQueriesAndMutation';
import { MedicalCategory } from '@/types';
import React, { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export enum SelectAction {
    UNSELECT = "UNSELECT",
    SELECT = "SELECT"
}


const ConsultantOnboarding = () => {

    const { data: supportedCategories, isPending: isLoadingMedicalCategories } = useGetSupportedMedicalCategories();
    const { userContext } = useUserContext();
    const navigate = useNavigate();
    if (userContext.userStage === 'ACTIVE_USER') {
        navigate('/')
    }
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [specialties, setSpecialties] = useState<MedicalCategory[]>([])
    const { toast } = useToast();
    const { mutateAsync: updateConsultantOnboardingInfo, isPending: isUpdating, isError, error } = useUpdateConsultantOnboardingInfo()

    useEffect(() => {
        if (supportedCategories) {
            setSpecialties(supportedCategories.data);
        }
    }, [supportedCategories]);

    const handleSelectedSpecialtyChange = (specialty: string, action: SelectAction) => {
        console.log(action)
        if (action === SelectAction.SELECT) {
            setSelectedSpecialty(specialty);
        } else {
            setSelectedSpecialty('');
        }
    }
    const handleNext = async () => {

        if (selectedSpecialty.length > 0) {
            console.log(selectedSpecialty)

            await updateConsultantOnboardingInfo({
                specialty: selectedSpecialty,
                userId: userContext.user_id
            })
            if (!isUpdating) {
                if (!isError) {
                    navigate('/');
                    return toast({ title: 'Thanks for helping us serve you better' })
                }
                return toast({ title: `Onboarding Failed: ${error.message}`, variant: 'destructive' })
            }
        }
        else {
            return toast({ title: 'Please choose one', variant: 'destructive' });
        }
    }
    return (
        <>
            <main className='h-full overflow-y-auto'>
                <div className=''>
                    <header className='font-semibold text-3xl text-center'>Consultant&nbsp;Onboarding</header>
                    {isLoadingMedicalCategories ? <Loader /> :
                        <>
                            <section className=' px-10 py-10 '>
                                <div className={'flex flex-row flex-wrap justify-left gap-4'}>
                                    {
                                        specialties.map((categoryName, index) => (
                                            <MedicalCategoryCard
                                                key={index}
                                                categoryName={categoryName.name}
                                                categoryDescription={categoryName.description}
                                                selectActionHandler={handleSelectedSpecialtyChange}
                                                disabled={selectedSpecialty && selectedSpecialty !== categoryName.name}
                                            />
                                        ))
                                    }
                                </div>
                            </section>
                            <Button className='tracking-normal shad-button_primary' onClick={handleNext}>
                                {isUpdating ? <Loader /> : 'Next'}
                            </Button>
                        </>
                    }
                </div>
            </main>
        </>
    )
}

export default ConsultantOnboarding