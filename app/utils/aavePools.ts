

export const pools: Record<string, string> = {
    WETH: "0xD4a0e0b9149BCee3C920d2E00b5dE09138fd8bb7",
    CBETH: "0xcf3D55c10DB69f28fD1A75Bd73f3D8A2d9c595ad",
    USDBC: "0x0a1d576f3eFeF75b330424287a95A366e8281D54",
    // WSTETH: "0x99CBC45ea5bb7eF3a5BC08FB1B7E56bB2442Ef0D",
    USDC: "0x4e65fE4DbA92790696d040ac24Aa414708F5c0AB",
    // WEETH: "0x7C307e128efA31F540F2E2d976C995E0B65F51F6",
    CBBTC: "0xBdb9300b7CDE636d9cD4AFF00f6F009fFBBc8EE6",
} as const

export const getAavePool = (symbol: string): `0x${string}` | undefined => {
    if (!pools[symbol]) {
        return undefined
    }
    return pools[symbol] as `0x${string}`
}