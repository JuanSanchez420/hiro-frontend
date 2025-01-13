import Button from "./Button"


const TransactionParams = ({name, params}: {name: string, params: string[]}) => {
    return (
        <div className="w-full">
            <div className="w-full rounded bg-gray-200 p-2">
                <div className="uppercase">{name}</div>
                {params.map((param, index) => (
                    <div key={`fn-param-${index}`} className="flex justify-between">
                        {param}
                    </div>))}
            </div>
            <div className="flex justify-evenly w-full my-5">
                <Button>CONFIRM</Button>
                <Button>CANCEL</Button>
            </div>
        </div>)

}

export default TransactionParams