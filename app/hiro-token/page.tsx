import BackButton from "../components/BackButton";


type RowProps = {
    label: string;
    value: string;
    isGray: boolean;
  };
  
  const Row: React.FC<RowProps> = ({ label, value, isGray }) => {
    return (
      <div className={`${isGray ? `bg-gray-50` : `bg-white`} px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3`}>
        <dt className="text-sm/6 font-medium text-gray-900 uppercase">{label}</dt>
        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{value}</dd>
      </div>
    );
  }


export default function Token() {

    return (
        <div>
            <div className="px-4 sm:px-0">
                <h3 className="text-base/7 font-semibold text-gray-900">HIRO Token</h3>
                <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">Tokenomics and other details.</p>
            </div>
            <div className="mt-6 border-t border-gray-100">
                <dl className="divide-y divide-gray-100">
                    <Row label="name" value="Hiro Token" isGray={true} />
                    <Row label="symbol" value="HIRO" isGray={false} />
                    <Row label="total supply" value="1 billion, fixed supply" isGray={true} />
                    <Row label="contract address" value="TBD" isGray={true} />
                    <Row label="decimals" value="18" isGray={false} />
                    <Row label="chain" value="Base" isGray={true} />
                    <Row label="type" value="standard ERC20" isGray={false} />
                    <Row label="distribution" value="50% team, 50% public sale" isGray={true} />
                </dl>
            </div>
            <BackButton />
        </div>
    )
}