import { ChevronDownIcon } from "@heroicons/react/16/solid"
import { ChangeEventHandler } from "react";


const Select = ({ options, values, onChange }: { options: string[], values: string[], onChange: ChangeEventHandler<HTMLSelectElement> }) => {
    return (
        <div className="w-full mt-2 grid grid-cols-1">
          <select
            id="location"
            name="location"
            defaultValue="Canada"
            onChange={onChange}
            className="col-start-1 row-start-1 w-full appearance-none rounded-md py-1.5 pl-3 pr-8 text-base outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6"
          >
            {options.map((option, i) => (
                <option key={option} value={values[i]}>{option}</option>
            ))}
          </select>
          <ChevronDownIcon
            aria-hidden="true"
            className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
          />
        </div>
    )
}

export default Select;