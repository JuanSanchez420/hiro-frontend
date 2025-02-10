import { ChevronDownIcon } from '@heroicons/react/24/outline';
import React, { useState, useRef, useEffect } from 'react';

interface Option {
    label: string;
    value: string;
}

interface SearchableSelectProps {
    options: Option[];
    value: Option | null;
    onChange: (option: Option) => void;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ options, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (option: Option) => {
        onChange(option);
        setIsOpen(false);
        setSearchTerm('');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block" ref={containerRef}>
            <div
                className="rounded px-4 py-2 cursor-pointer text-sm text-gray-500 flex"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className='text-sm'>{value ? value.label : 'Select...'}</div>
                <ChevronDownIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 ml-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                />
            </div>
            {isOpen && (
                <div className="absolute -ml-10 mt-1 bg-white text-sm border border-gray-300 rounded shadow-lg z-10">
                    <input
                        type="text"
                        className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                    <ul className="max-h-40 overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map(option => (
                                <li
                                    key={option.value}
                                    className="px-4 py-2 hover:bg-emerald-500 text-gray-500 rounded hover:text-white cursor-pointer"
                                    onClick={() => handleSelect(option)}
                                >
                                    {option.label}
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-2 text-gray-500">No results found</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchableSelect;