import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserFormProps } from "@/types";
import { Gender } from "./Enums";
import { FormWrapper } from "./FormWrapper";
import { PhoneInput } from "react-international-phone";
import 'react-international-phone/style.css'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";


export function UserForm({ formData, handleFormDataChange }: UserFormProps) {


    return (
        <>
                <div className="flex flex-col gap-1 justify-center">

                    <div>
                        <Label>First Name</Label>
                        <Input placeholder='john' value={formData.firstName} onChange={e => handleFormDataChange("firstName", e.target.value)} />
                    </div>


                    <div>
                        <Label>Last Name</Label>
                        <Input placeholder='Doe' value={formData.lastName} onChange={e => handleFormDataChange("lastName", e.target.value)} />
                    </div>



                    <div>
                        <Label>Phone Number</Label>
                        <PhoneInput
                            defaultCountry={'us'}
                            value={formData.phoneNumber}
                            onChange={e => handleFormDataChange("phoneNumber", e)}
                            className="flex flex-row h-10 border border-slate-200 rounded-sm p-0"
                            inputClassName="border border-transparent"
                        />
                    </div>

                    <div>
                        <Label>Gender</Label>
                        <Select onValueChange={value => value === 'Male' ? handleFormDataChange('gender', Gender.MALE) : handleFormDataChange('gender', Gender.FEMALE)}>
                            <SelectTrigger>
                                <SelectValue placeholder='Select Your gender' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Male" >Male</SelectItem>
                                <SelectItem value="Female" >Female</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
        </>
    )
}