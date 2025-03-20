import { useGlobalContext } from "../context/GlobalContext"
import { MarketData } from "../types"

const Item = ({ name, stat, extraCss }: { name: string, stat: string, extraCss?: string }) => {
    const { styles } = useGlobalContext()
    const base = `font-semibold tracking-tight ${styles.text}`
    const css = extraCss ? `${base} ${extraCss}` : base;

    return <div key={name} className="overflow-hidden rounded-lg p-2">
        <dt className={`truncate text-sm font-medium ${styles.text}`}>{name}</dt>
        <dd className={css}>{stat}</dd>
    </div>
}

export default function MarketStats({ market }: { market: MarketData }) {
    const color = Number(market.change24h) >= 0 ? 'text-green-500' : 'text-red-500';
    return (
        <div>
            <dl className="grid grid-cols-2 gap-1">
                <Item name="EMA (200)" stat={market.trend} />
                <Item name="RSI (14)" stat={market.rsi.toString()} />
                <Item name="ATR (14)" stat={market.atr.toString()} />
                <Item name="Percentage Change" stat={`${market.change24h}%`} extraCss={color} />
                <Item name="Donchian Channel (30)" stat={market.donchian} />
            </dl>
        </div>
    )
}