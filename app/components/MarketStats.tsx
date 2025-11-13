import { useThemeContext } from "../context/GlobalContext"
import { MarketData } from "../types"

const Item = ({ name, stat, extraCss }: { name: string, stat: string, extraCss?: string }) => {
    const { styles } = useThemeContext()
    const base = `font-semibold tracking-tight ${styles.text}`
    const css = extraCss ? `${base} ${extraCss}` : base;

    return <div key={name} className="overflow-hidden rounded-lg p-2">
        <dt className={`truncate text-sm font-medium ${styles.text}`}>{name}</dt>
        <dd className={css}>{stat}</dd>
    </div>
}

export default function MarketStats({ market }: { market: MarketData }) {
    const color = Number(market.change24h) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
    const trendColor = market.hiro.trend === 'uptrend' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
    const trendEmoji = market.hiro.trend === 'uptrend' ? '📈' : '📉';
    const marketStateEmoji = market.hiro.marketState === 'trending' ? '🎯' : '↔️';

    return (
        <div>
            <dl className="grid grid-cols-2 gap-1">
                <Item name="24h Change" stat={`${market.change24h}%`} extraCss={color} />
                <Item name="Trend" stat={`${trendEmoji} ${market.hiro.trend}`} extraCss={trendColor} />
                <Item name="Market State" stat={`${marketStateEmoji} ${market.hiro.marketState}`} />
                <Item name="Position" stat={market.hiro.position} extraCss="col-span-2" />
            </dl>
        </div>
    )
}
