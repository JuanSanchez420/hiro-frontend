

const Button = ({ children }: { children: React.ReactNode }) => {
    return (
        <button type="button" className="rounded-md px-5 bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            {children}
        </button>
    )
}

export default Button