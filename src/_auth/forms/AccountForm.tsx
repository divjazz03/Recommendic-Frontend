import { Input } from "@/components/ui/input";
import { AccountFormProps } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export function AccountForm({
    formData,
    handleFormDataChange,
    handleTypeOfUserSelectChange,
    form
}: AccountFormProps) {

    return (
        <>

            <div className="flex flex-col gap-3 justify-center">
                <div>
                    <header className="h3-bold text-center">Account Information</header>
                </div>

                <FormField
                    control={form.control}
                    name="email"
                    render={() => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...form.register("email")} placeholder='johndoe@gmail.com' value={formData.email} type="email" onChange={e => handleFormDataChange("email", e.target.value)} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}>

                </FormField>

                <FormField
                    control={form.control}
                    name="typeOfUser"
                    render={() => (
                        <FormItem>
                            <FormLabel>Signup As</FormLabel>
                            <FormControl>
                                <Select {...form.register("typeOfUser")} value={formData.typeOfUser} onValueChange={handleTypeOfUserSelectChange}  >
                                    <SelectTrigger>
                                        <SelectValue placeholder='Sign up as' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Patient" >Patient</SelectItem>
                                        <SelectItem value="Consultant" >Consultant</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}>

                </FormField>
                <FormField
                    control={form.control}
                    name="password"
                    render={() => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                            <Input {...form.register("password")} type='password' value={formData.password} onChange={e => handleFormDataChange("password", e.target.value)} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}>

                </FormField>
            </div>
        </>
    )
}