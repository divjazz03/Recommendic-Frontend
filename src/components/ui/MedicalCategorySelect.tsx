import { MedicalCategory } from '@/types'
import React, { useEffect, useState } from 'react'


interface MedicalCategorySelectProps{
    categories: MedicalCategory[],
    selectedCategories: MedicalCategory[],
    disabled?: boolean,
    handleInterestsChange: (interests: string[]) => void
}

const MedicalCategorySelect: React.FC<MedicalCategorySelectProps> = ({
    categories,
    selectedCategories,
    disabled = true,
    handleInterestsChange
}) => {
    const [selected, setSelected] = useState<MedicalCategory[]>([]);
    const [search, setSearch] = useState("")
    const [open, setOpen] = useState(false)

    const toggleSelect = (category: MedicalCategory) => {
        setSelected(prev =>
            prev.some((c) => c.name === category.name)
                ? prev.filter((c) => c.name !== category.name)
                : [...prev, category]
        );
    };
    useEffect(() => {
        if(selected) {
            handleInterestsChange(selected.map(selected => selected.name))
        }
    }, [selected])

    useEffect(() => {
        setSelected(selectedCategories);
    }, [selectedCategories])

    const filtered = categories ? categories.filter((cat) =>
        cat.name.toLowerCase().includes(search.toLowerCase())
    ): [];

    return (
        <div className="w-full mx-auto">
            {/* Selected preview */}
            <div className="flex flex-wrap gap-2 mb-2">
                { selected.map((cat) => (
                    <span
                        key={cat.name}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                        {cat.name}
                        <button
                            onClick={() => toggleSelect(cat)}
                            className="text-blue-500 hover:text-blue-700 disabled:cursor-not-allowed"
                            disabled={disabled}
                        >
                            ✕
                        </button>
                    </span>
                ))}
            </div>

            {/* Dropdown */}
            <div className="relative">
                <button
                    onClick={() => setOpen(!open)}
                    disabled={disabled}
                    className="w-full border rounded-lg px-4 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    {selected.length > 0
                        ? `${selected.length} selected`
                        : "Select medical categories..."}
                </button>

                {open && !disabled && (
                    <div className="absolute mt-1 w-full bg-white border rounded-lg shadow-lg z-10">
                        {/* Search bar */}
                        <div className="p-2 border-b">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search..."
                                className="w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                            />
                        </div>

                        {/* Category list */}
                        <ul className="max-h-60 overflow-y-auto">
                            {filtered.length > 0 ? (
                                filtered.map((cat) => (
                                    <li
                                        key={cat.name}
                                        onClick={() => toggleSelect(cat)}
                                        className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${selected?.some((c) => c.name === cat.name)
                                                ? "bg-blue-100"
                                                : ""
                                            }`}
                                    >
                                        <div className="font-medium">{cat.name}</div>
                                        <div className="text-sm text-gray-500">
                                            {cat.description}
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <li className="p-4 text-gray-500 text-sm">No results found</li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MedicalCategorySelect