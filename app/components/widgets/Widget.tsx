import { useMessagesContext } from "@/app/context/Context";
import TokenSwap from "./SwapWidget";
import AddLiquidityWidget from "./AddLiquidityWidget";
import Portfolio from "../Portfolio";

const Widget = () => {
    const { widget } = useMessagesContext();

    return (widget.name === 'Cancel' ? null : widget.value === "swap" ?
        <TokenSwap /> : widget.value === 'earn' ?
            <AddLiquidityWidget /> :
            widget.value === 'suggest' ?
                <Portfolio /> :
                <div>
                    {widget.name}
                </div>
    )
}

export default Widget;