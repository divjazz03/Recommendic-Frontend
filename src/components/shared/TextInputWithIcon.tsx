import React from "react"
import { UseFormRegisterReturn } from "react-hook-form"

interface TextInputWithIconProps {
    icon: React.JSX.Element
    inputSetState?: (value: React.SetStateAction<string>) => void
    type?: string
    formRegister?: UseFormRegisterReturn
    placeholder?: string
}

const inputStyle = 'p-1 rounded-sm outline-none border-none w-full text-sm'
const TextInputWithIcon = ({
    icon,
    inputSetState,
    type = 'text',
    formRegister,
    placeholder
}: TextInputWithIconProps) => (
    <div className='w-full flex gap-1 items-center rounded-md p-1 border border-gray-300 focus:outline outline-none'>
        <div className="px-1">
            {icon}
        </div>
        {formRegister && <input
            {...formRegister}
            type={type}
            placeholder={placeholder}
            className={inputStyle} />}
        {!formRegister && inputSetState 
        && <input type={type} placeholder={placeholder} className={inputStyle}/>}
    </div>
)

export default TextInputWithIcon