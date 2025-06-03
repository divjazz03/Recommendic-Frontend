import MedicalCategoryCard from '@/components/MedicalCategoryCard';
import Loader from '@/components/shared/Loader';
import { Button } from '@/components/ui/button';
import { useUserContext } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useGetSupportedMedicalCategories, useUpdateConsultantOnboardingInfo } from '@/lib/react-query/queriiesAndMutation';
import { MedicalCategory } from '@/types';
import React, { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export enum SelectAction {
    UNSELECT = "UNSELECT",
    SELECT = "SELECT"
}


const ConsultantOnboarding = () => {

    const { data:supportedCategories, isPending: isLoadingMedicalCategories } = useGetSupportedMedicalCategories();
    const { userContext } = useUserContext();
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [specialties, setSpecialties] = useState<MedicalCategory[]>([])
    const {toast} = useToast();
    const navigate = useNavigate();
    const {mutateAsync:updateConsultantOnboardingInfo, isPending: isUpdating} = useUpdateConsultantOnboardingInfo()

    useEffect(() => {
        if(supportedCategories) {
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
    const handleNext = () => {

        if (selectedSpecialty.length > 0) {
            console.log(selectedSpecialty)
            try {
                const {} = updateConsultantOnboardingInfo({
                    specialty: selectedSpecialty,
                    userId: userContext.user_id
                })
                navigate('/consultant/overview');
                return toast({ title: 'Thanks for helping us serve you better' })
            } catch (error) {
                return toast({ title: `Onboarding Failed: ${error.message}`, variant: 'destructive' })
            }
        } else {
            return toast({title: 'Please choose one', variant: 'destructive'});
        }
    }
    return (
        <>
            <main className=''>
                <div className='h1-bold'>
                    <header className='text-center'>Consultant&nbsp;Onboarding</header>
                    <section className=' px-10 py-10 '>
                        <div className={'flex flex-row flex-wrap justify-left gap-4'}>
                            {
                                ['Dentist','Gynecologist', 'Psychiatry','Opthalmology','Surgery'].map((categoryName, index) => (
                                <MedicalCategoryCard
                                key={index}
                                categoryName={categoryName}
                                categoryDescription='A very important person fidof df dofidfoi i fdofidofiekjflsk ekf lkaej afeldkslkdnsk '
                                selectActionHandler={handleSelectedSpecialtyChange}
                                disabled={selectedSpecialty && selectedSpecialty !== categoryName}
                                />
                            ))
                            }
                        </div>
                    </section>
                    <Button className='tracking-normal shad-button_primary' onClick={handleNext}>
                        {isUpdating? <Loader/> :'Next'} 
                    </Button>
                </div>
            </main>
        </>
    )
}

export default ConsultantOnboarding