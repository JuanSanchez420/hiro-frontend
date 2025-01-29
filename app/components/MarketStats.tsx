import { MarketData } from "../types"

const Item = ({ name, stat }: { name: string, stat: string }) => {
    return <div key={name} className="overflow-hidden rounded-lg bg-white p-2">
        <dt className="truncate text-sm font-medium">{name}</dt>
        <dd className="mt-1 text-lg font-semibold tracking-tight text-gray-900">{stat}</dd>
    </div>
}

export default function MarketStats({ market }: { market: MarketData }) {
    return (
        <div>
            <dl className="grid grid-cols-2 gap-1 sm:grid-cols-3">
                <Item name="EMA (200)" stat={market.trend} />
                <Item name="RSI (14)" stat={market.rsi.toString()} />
                <Item name="ATR (14)" stat={market.atr.toString()} />
                <Item name="Percentage Change" stat={`${market.change24h}%`} />
                <Item name="Donchian Channel (30)" stat={market.donchian} />
            </dl>
        </div>
    )
}