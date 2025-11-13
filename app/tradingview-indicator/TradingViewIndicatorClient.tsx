'use client'

import { useState } from 'react'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { ChevronDownIcon, ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline'
import { useThemeContext } from '../context/GlobalContext'

export default function TradingViewIndicator() {
  const { styles, theme } = useThemeContext()
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const borderClass = theme === 'light' ? 'border-gray-300' : 'border-gray-700'
  const codeBgClass = theme === 'light' ? 'bg-gray-50' : 'bg-gray-800'

  const handleCopy = (code: string, index: number) => {
    navigator.clipboard.writeText(code)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const indicatorCode = `//@version=6
indicator("Hiro Channel", shorttitle="HC", overlay=true)

// === INPUTS ===
dc_length = input.int(30, "Length", tooltip="The bar length of the channel. Longer = less active, Shorter = more active.")
entryType = input.string("None", "System", options=["None", "Trend", "Trend - Long Only", "Volatility", "Volatility - Long Only"], tooltip="Select a system to show entries/exits & create alerts. The Trend system stays with the trade until the trend changes. Volatility tries to catch the market when it's most active. Long Only options skip the short trades.")

var showEntries = entryType != "None"
length = bar_index > dc_length ? dc_length : bar_index + 1

// === DONCHIAN CHANNEL ===
top = ta.highest(high, length)
bottom = ta.lowest(low, length)
basis = math.avg(top, bottom)

// === HIRO CHANNEL WIDTH ===
d = (ta.highest(high, length) - ta.lowest(low, length)) / 2

// === MARKET STATE ===
expansion = d == ta.highest(d, length)
expansionUp = expansion and high == top
expansionDown = expansion and low == bottom

cross = ta.cross(hl2, basis)

trend = ta.barssince(expansionUp) < ta.barssince(expansionDown)
trendStart = expansionUp or expansionDown
trendEnd = not trendStart and cross
trending = ta.barssince(trendStart) < ta.barssince(trendEnd)

trendFlip = ta.change(trend) != false
rangeStart = (trendEnd and trending[1]) or (trendFlip and trending[1])

// === DISPLAY AND ALERT LOGIC ===
trendLongEntry = trendFlip and expansionUp and (entryType == "Trend" or entryType == "Trend - Long Only")
trendShortEntry = trendFlip and expansionDown and entryType == "Trend"

volatilityExit = (entryType == "Volatility" and rangeStart) or
                 (entryType == "Volatility - Long Only" and ((trend and rangeStart) or (trending[1] and trendFlip and expansionDown)))
trendLongOnlyExit = entryType == "Trend - Long Only" and expansionDown and trendFlip

volatilityLongEntry = (entryType == "Volatility" or entryType == "Volatility - Long Only") and expansionUp and (not trending[1] or trendFlip)
volatilityShortEntry = entryType == "Volatility" and expansionDown and (not trending[1] or trendFlip)

longEntry = trendLongEntry or volatilityLongEntry
shortEntry = trendShortEntry or volatilityShortEntry
exit = volatilityExit or trendLongOnlyExit
sendAlert = longEntry or shortEntry or exit

// === DISPLAY STRATEGY ===
barcolor(trending and trend ? #2aa599 : trending and not trend ? #ee5451 : color.gray)

t = plot(top, color=color.new(#3bb3e4, 65), linewidth=2, title="Upper")
b = plot(bottom, color=color.new(#3bb3e4, 65), linewidth=2, title="Lower")
plot(basis, color=color.new(#3bb3e4, 65), linewidth=2, title="Basis")
fill(t, b, color=color.new(#3bb3e4, 90), title="Background")

// === DISPLAY ENTRIES/EXITS ===
plotshape(showEntries and longEntry, title="Long Entry", style=shape.triangleup, color=color.green, location=location.belowbar, size=size.small)
plotshape(showEntries and shortEntry, title="Short Entry", style=shape.triangledown, color=color.red, location=location.abovebar, size=size.small)
plotshape(showEntries and exit, title="Exit", style=shape.xcross, color=color.black, location=location.abovebar, size=size.small)`

  const strategyCode = `//@version=6
strategy("Hiro Channel Strategy", overlay=true, initial_capital=100000, commission_type=strategy.commission.percent, commission_value=0.01, pyramiding=0, calc_on_every_tick=false, process_orders_on_close=true, default_qty_type=strategy.percent_of_equity, default_qty_value=100)

// === INPUTS ===
dc_length = input.int(30, "Length", tooltip="The bar length of the channel. Longer = less active, Shorter = more active.")
entryType = input.string("Trend - Long Only", "System", options=["None", "Trend", "Trend - Long Only", "Volatility", "Volatility - Long Only"], tooltip="Select a system for entries/exits. The Trend system stays with the trade until the trend changes. Volatility tries to catch the market when it's most active. Long Only options skip the short trades.")
var showEntries = entryType != "None"
length = bar_index > dc_length ? dc_length : bar_index + 1

// === DONCHIAN CHANNEL ===
top = ta.highest(high, length)
bottom = ta.lowest(low, length)
basis = math.avg(top, bottom)

// === HIRO CHANNEL WIDTH ===
d = (ta.highest(high, length) - ta.lowest(low, length)) / 2

// === MARKET STATE ===
expansion = d == ta.highest(d, length)
expansionUp = expansion and high == top
expansionDown = expansion and low == bottom
cross = ta.cross(hl2, basis)
trend = ta.barssince(expansionUp) < ta.barssince(expansionDown)
trendStart = expansionUp or expansionDown
trendEnd = not trendStart and cross
trending = ta.barssince(trendStart) < ta.barssince(trendEnd)
trendFlip = ta.change(trend) != false
rangeStart = (trendEnd and trending[1]) or (trendFlip and trending[1])

// === ENTRY/EXIT LOGIC ===
trendLongEntry = trendFlip and expansionUp and (entryType == "Trend" or entryType == "Trend - Long Only")
trendShortEntry = trendFlip and expansionDown and entryType == "Trend"
volatilityExit = (entryType == "Volatility" and rangeStart) or (entryType == "Volatility - Long Only" and ((trend and rangeStart) or (trending[1] and trendFlip and expansionDown)))
trendLongOnlyExit = entryType == "Trend - Long Only" and expansionDown and trendFlip
volatilityLongEntry = (entryType == "Volatility" or entryType == "Volatility - Long Only") and expansionUp and (not trending[1] or trendFlip)
volatilityShortEntry = entryType == "Volatility" and expansionDown and (not trending[1] or trendFlip)
longEntry = trendLongEntry or volatilityLongEntry
shortEntry = trendShortEntry or volatilityShortEntry
exitSig = volatilityExit or trendLongOnlyExit

// === STRATEGY ORDERS ===
if exitSig
    strategy.close("Long")
    strategy.close("Short")
if longEntry
    if strategy.position_size < 0
        strategy.close("Short")
    strategy.entry("Long", strategy.long)
allowShorts = entryType == "Trend" or entryType == "Volatility"
if allowShorts and shortEntry
    if strategy.position_size > 0
        strategy.close("Long")
    strategy.entry("Short", strategy.short)

// === PLOTTING ===
barcolor(trending and trend ? #2aa599 : trending and not trend ? #ee5451 : color.gray)
t = plot(top, color=color.new(#3bb3e4, 65), linewidth=2, title="Upper")
b = plot(bottom, color=color.new(#3bb3e4, 65), linewidth=2, title="Lower")
plot(basis, color=color.new(#3bb3e4, 65), linewidth=2, title="Basis")
fill(t, b, color=color.new(#3bb3e4, 90), title="Background")

// === VISUAL MARKERS + ALERTS ===
plotshape(showEntries and longEntry, title="Long Entry", style=shape.triangleup, color=color.green, location=location.belowbar, size=size.small)
plotshape(showEntries and shortEntry, title="Short Entry", style=shape.triangledown, color=color.red, location=location.abovebar, size=size.small)
plotshape(showEntries and exitSig, title="Exit", style=shape.xcross, color=color.black, location=location.abovebar, size=size.small)
alertcondition(longEntry, title="HC Long Entry", message="HC Long Entry")
alertcondition(shortEntry, title="HC Short Entry", message="HC Short Entry")
alertcondition(exitSig, title="HC Exit", message="HC Exit")`

  return (
    <div className="prose dark:prose-invert max-w-none">
      <h1 className='font-bold mb-5'>Hiro Channel TradingView Indicator - FREE!</h1>

      <h2 className="font-semibold mb-3 mt-6">How to Add to TradingView:</h2>
      <ol className="list-decimal list-inside space-y-2 ml-4 mb-4">
        <li>Open TradingView and click the Pine Editor tab at the bottom</li>
        <li>Click &ldquo;New&rdquo; and select &ldquo;Blank Indicator&rdquo; or &ldquo;Blank Strategy&rdquo;</li>
        <li>Copy the code from one of the sections below</li>
        <li>Paste it into the Pine Editor, replacing all existing code</li>
        <li>Click &ldquo;Save&rdquo; and then &ldquo;Add to Chart&rdquo;</li>
      </ol>

      <div className="not-prose mt-8 space-y-4">
        {/* First Code Section */}
        <Disclosure as="div" defaultOpen={false}>
          {({ }) => (
            <>
              <DisclosureButton className={`group w-full text-left border ${borderClass} rounded-lg p-4`}>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold">Hiro Channel TradingView Indicator</span>
                  <ChevronDownIcon className="size-5 text-gray-400 group-data-[open]:rotate-180 transition-transform" />
                </div>
              </DisclosureButton>
              <DisclosurePanel
                transition
                className="overflow-hidden origin-top transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0"
              >
                <div className={`border border-t-0 ${borderClass} rounded-b-lg ${codeBgClass}`}>
                  <div className="flex justify-end p-2 border-b ${borderClass}">
                    <button
                      onClick={() => handleCopy(indicatorCode, 0)}
                      className={`${styles.buttonSm} flex items-center gap-2`}
                    >
                      {copiedIndex === 0 ? (
                        <>
                          <CheckIcon className="size-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <ClipboardDocumentIcon className="size-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="text-sm overflow-x-auto p-4">
                    <code>{indicatorCode}</code>
                  </pre>
                </div>
              </DisclosurePanel>
            </>
          )}
        </Disclosure>

        {/* Second Code Section */}
        <Disclosure as="div" defaultOpen={false}>
          {({ }) => (
            <>
              <DisclosureButton className={`group w-full text-left border ${borderClass} rounded-lg p-4`}>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold">Hiro Channel TradingView Strategy</span>
                  <ChevronDownIcon className="size-5 text-gray-400 group-data-[open]:rotate-180 transition-transform" />
                </div>
              </DisclosureButton>
              <DisclosurePanel
                transition
                className="overflow-hidden origin-top transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0"
              >
                <div className={`border border-t-0 ${borderClass} rounded-b-lg ${codeBgClass}`}>
                  <div className="flex justify-end p-2 border-b ${borderClass}">
                    <button
                      onClick={() => handleCopy(strategyCode, 1)}
                      className={`${styles.buttonSm} flex items-center gap-2`}
                    >
                      {copiedIndex === 1 ? (
                        <>
                          <CheckIcon className="size-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <ClipboardDocumentIcon className="size-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="text-sm overflow-x-auto p-4">
                    <code>{strategyCode}</code>
                  </pre>
                </div>
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  )
}
