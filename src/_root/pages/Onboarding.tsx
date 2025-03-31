import MedicalCategoryCard from '@/components/MedicalCategoryCard';
import { Button } from '@/components/ui/button';
import { useUserContext } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useGetSupportedMedicalCategories } from '@/lib/react-query/queriiesAndMutation';
import { MedicalCategory } from '@/types';
import React, { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export enum SelectAction {
    UNSELECT = "UNSELECT",
    SELECT = "SELECT"
}


const Onboarding = () => {

    const { mutateAsync: getMedicalCategories, isPending: isLoadingMedicalCategories } = useGetSupportedMedicalCategories();
    const { userContext } = useUserContext();
    const [userType, setUserType] = useState('');
    const [specialties, setSpecialties] = useState<MedicalCategory[]>([])
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [selectedInterests, setSelectedInterests] = useState([]);
    const {toast} = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        setUserType('CONSULTANT' /*userContext.userType*/);
        console.log(userType)
        // const fetchCategoryData = async () => {
        //   const result = await getMedicalCategories();
        //   setSpecialties(result.data.categories);
        // }
        // fetchCategoryData();
      }, []);
    const handleSelectedSpecialtyChange = (specialty: string, action: SelectAction) => {
        console.log(action)
        if (action === SelectAction.SELECT) {
            setSelectedSpecialty(specialty);
        } else {
            setSelectedSpecialty('');
        }
    }
    const handleSelectedInterestsChange = (interest: string, action: SelectAction) => {
        console.log(action)
        if (action === SelectAction.SELECT) {
            if (!selectedInterests.includes(interest)) {
                setSelectedInterests(prev => [...prev, interest]);
                console.log(selectedInterests);
            }
        } else {
            setSelectedInterests(prev => prev.filter(item => item !== interest));
        }
    }
    const getStateInfo = () => {
        console.log(`specialty ${selectedSpecialty}`);
        console.log(`interests ${selectedInterests}`);
    }
    const handleNext = () => {

        if (selectedInterests.length > 0 || selectedSpecialty.length > 0) {
            // submit the data
            navigate('/overview');
            return toast({title: 'Thanks for helping us serve you better'})
        } else {
            return toast({title: 'Please choose one', variant: 'destructive'});
        }
    }
    const userIsConsultant = userType === 'CONSULTANT';
    return (
        <>
            <main className=''>
                <div className='h1-bold'>
                    <header className='text-center'>Onboarding</header>
                    <p>{userContext.userType == 'CONSULTANT' ? '' : ''}</p>
                    <section className=' px-10 py-10 '>
                        <div className={'flex flex-row flex-wrap justify-left gap-4'}>
                            {
                                ['Dentist','Gynecologist', 'Psychiatry','Opthalmology','Surgery'].map((categoryName, index) => (
                                <MedicalCategoryCard
                                key={categoryName}
                                categoryName={categoryName}
                                categoryDescription='A very important person fidof df dofidfoi i fdofidofiekjflsk ekf lkaej afeldkslkdnsk '
                                selectActionHandler={userType ==='CONSULTANT'? handleSelectedSpecialtyChange: handleSelectedInterestsChange}
                                disabled={userIsConsultant && selectedSpecialty && selectedSpecialty !== categoryName}
                                />
                            ))
                            }
                        </div>
                    </section>
                    <Button className='tracking-normal shad-button_primary' onClick={handleNext}>
                        Next 
                    </Button>
                    <hr></hr>
                    <Button className='shad-button_primary' onClick={getStateInfo}>GetInfo</Button>
                </div>
            </main>
        </>
    )
}

export default Onboarding