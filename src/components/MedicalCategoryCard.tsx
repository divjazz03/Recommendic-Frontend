import { SelectAction } from '@/_root/pages/consultant/ConsultantOnboarding';
import React, { useState } from 'react'


type MedicalCategoryCardProps = {
    categoryName: string,
    categoryDescription: string,
    selectActionHandler: (value: string, action: SelectAction) => void,
    disabled: boolean
}

const MedicalCategoryCard = (props: MedicalCategoryCardProps) => {
    const [selected, setSelected] = useState(false);
    const descTruncLength = 100;
    const handleCardClick = (event: React.MouseEvent) => {
        event.preventDefault();
        const newSelectedState = !selected;
        setSelected(!selected);
        console.log(newSelectedState)
        props.selectActionHandler(props.categoryName, newSelectedState ? SelectAction.SELECT : SelectAction.UNSELECT);
    }
    return (
        <div
            className={`flex flex-col w-fit min-w-[180pekfx] max-w-[240px] py-3 px-2 gap-4 rounded-sm shadow-md hover:shadow-xl hover:duration-400 hover:transition-all cursor-pointer ${selected ? "bg-dark-2": "bg-light-5"} ${props.disabled ? 'outline-none opacity-50 cursor-not-allowed' : ''}`}
            id={props.categoryName}
            onClick={props.disabled ? () => { } : handleCardClick}>
            <div className='text-center'>
                <header className={`font-semibold text-xl font-poppins ${selected? 'text-light-5':'text-dark-5'}`}>{props.categoryName}</header>
            </div>
            <div className='text-start'>
                <p className={`text-md font-thin text-wrap ${selected? 'text-gray-300':'text-gray-700'}`}>
                    {`${props.categoryDescription.slice(0, descTruncLength)} ${props.categoryDescription.length > descTruncLength ? '...' : ''}`}
                </p>
            </div>
        </div>
    )
}
export default MedicalCategoryCard