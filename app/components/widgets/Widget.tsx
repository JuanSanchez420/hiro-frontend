import TokenSwap from "./SwapWidget";
import AddLiquidityWidget from "./LiquidityWidget";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import AutonomousInstructions from "./AutonomousInstructions";
import { useGlobalContext } from "@/app/context/GlobalContext";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
import SignupWidget from "./SignupWidget";
import LendWidget from "./LendWidget";
import BorrowWidget from "./BorrowWidget";

const Widget = () => {
    const { widget, setWidget, styles } = useGlobalContext();

    const widgetComponents = {
        Swap: TokenSwap,
        Earn: AddLiquidityWidget,
        Autonomous: AutonomousInstructions,
        Deposit: Deposit,
        Withdraw: Withdraw,
        Signup: SignupWidget,
        Lend: LendWidget,
        Borrow: BorrowWidget,
    };

    const WidgetComponent = widget && widgetComponents[widget] ? widgetComponents[widget] : null;

    return (
        <Dialog open={widget !== null} onClose={() => setWidget(null)} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full justify-center text-center items-center p-0">
                    <DialogPanel
                        transition
                        className={`relative w-full mx-6 transform rounded-lg px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 ${styles.background}`}
                    >
                        {WidgetComponent && <WidgetComponent />}
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}

export default Widget;