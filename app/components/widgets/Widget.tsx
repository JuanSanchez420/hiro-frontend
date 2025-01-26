import { useMessagesContext } from "@/app/context/Context";
import TokenSwap from "./SwapWidget";
import AddLiquidityWidget from "./AddLiquidityWidget";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { widgetOptions } from "./widgetOptions";
import AutonomousInstructions from "./AutonomousInstructions";

const Widget = () => {
    const { widget, setWidget } = useMessagesContext();

    return (
        <Dialog open={widget?.name !== 'Cancel'} onClose={()=>setWidget(widgetOptions[widgetOptions.length-1])} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                    >
                        {widget.name === 'Cancel' ? null : widget.value === "swap" ?
                            <TokenSwap /> : widget.value === 'earn' ?
                                <AddLiquidityWidget /> :
                                    widget.value === 'instructions' ?
                                    <AutonomousInstructions /> :
                                    <div>
                                        {widget.name}
                                    </div>}
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}

export default Widget;