import React from "react"
import { UseFormRegisterReturn } from "react-hook-form"
import { cn } from "@/lib/utils/utils"

interface InputWithIconProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon: React.JSX.Element
    divStyle?: string
    register?: UseFormRegisterReturn
}

const InputWithIcon = ({
    icon,
    divStyle,
    register,
    ...props
}: InputWithIconProps) => (
    <div className={cn("w-full focus-within:ring-2 focus-within:ring-main flex gap-1 items-center rounded-lg p-1 border overflow-hidden border-gray-300 h-10 focus:outline outline-none", divStyle)}>
        <div className="px-1">
            {icon}
        </div>
        <input {...props} {...register}/>
    </div>
)

export default InputWithIcon