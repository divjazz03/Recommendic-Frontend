import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AccountFormProps } from "@/types";
import { MedicalSpecialization } from "./Enums";
import { FormWrapper } from "./FormWrapper";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multiSelect";
import { Label } from "@/components/ui/label";

export function AccountForm({
    formData,
    handleFormDataChange,
    handleTypeOfUserSelectChange,
    medicalCategories,
    handleSpecializationChangeEvent
}: AccountFormProps) {


    const categories = medicalCategories.map(category => ({
        label: category,
        value: category
    }))

    return (
        <>
            <FormWrapper title="Sign Up">

                <div className="flex flex-col justify-center">

                    <div>
                        <Label>Email</Label>
                        <Input placeholder='johndoe@gmail.com' value={formData.email} type="email" onChange={e => handleFormDataChange("email", e.target.value)} />
                    </div>

                    <div>
                        <Label>SignUp As</Label>
                        <Select value={formData.typeOfUser} onValueChange={handleTypeOfUserSelectChange}  >
                            <SelectTrigger>
                                <SelectValue placeholder='Sign up as' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Patient" >Patient</SelectItem>
                                <SelectItem value="Consultant" >Consultant</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Password</Label>
                        <Input type='password' value={formData.password} onChange={e => handleFormDataChange("password", e.target.value)} />
                    </div>

                {
                        formData.typeOfUser === 'Patient' ? (

                            <div >
                                <MultiSelect props={categories} />
                            </div>


                        ) : (

                            <div>
                                <Label>Choose Specialty</Label>
                                <Select value={formData.medicalSpecialization} onValueChange={handleSpecializationChangeEvent}  >
                                    <SelectTrigger>
                                        <SelectValue placeholder='Choose Your Specialization' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category, i) => (
                                            <SelectItem key={i} value={category.value}>{category.value}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>


                        )

                    }
                </div>
            </FormWrapper>

        </>
    )
}