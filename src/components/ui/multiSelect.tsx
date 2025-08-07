"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "./label"
import { Card } from "./card"


interface MultiSelectProps{
    categories: string[],
    handleCategoriesChangeFunction: (value: string[]) => void
}

export function MultiSelect({categories, handleCategoriesChangeFunction}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState<string[]>([])

    const handleSetValue = (val: string) => {
        if (value.includes(val)) {
            value.splice(value.indexOf(val), 1);
            setValue(value.filter(item => item != val));
        } else {
            setValue(prevValue => [...prevValue, val]);
        }
    }

    React.useEffect(() => 
        handleCategoriesChangeFunction(value), [value])

    return (
        <div className="flex flex-col gap-1 mt-1">
        <Label>Choose Area of Interest</Label>
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Card
                    role="combobox"
                    aria-expanded={open}
                    className="text-sm w-auto justify-between shadow-none">
                    <div className="flex gap-2 justify-start p-1 capitalize max-w-[300px] flex-wrap">
                        {
                            value?.length ? value.map((val, i) => (
                                <div key={i} className="px-2 py-1 rounded-xl border bg-slate-200 text-xs font-medium">
                                    {categories?.find((prop) => prop === val).toLowerCase()}
                                </div>
                            )) : "Select categories of interest"
                        }
                    </div>

                </Card>
            </PopoverTrigger>
            <PopoverContent className="max-w-[300px] p-0">
                <Command>
                    <CommandInput placeholder="Search category..." />
                    <CommandEmpty>No such Category</CommandEmpty>
                    <CommandList>
                        <CommandGroup>
                            {
                                categories.map((prop,i) => (
                                    <CommandItem
                                        key={i}
                                        value={prop}
                                        onSelect={() => handleSetValue(prop)} 
                                        className="capitalize">
                                        <Check className={cn("mr-2 h-4 w-4",
                                            value.includes(prop) ? "opacity-100" : "opacity-0")} />
                                        {prop.toLowerCase()}

                                    </CommandItem>
                                ))
                            }
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
        </div>
    )
}