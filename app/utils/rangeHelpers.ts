export type RangeStyle = {
    color: string;
    label: string;
    tooltip: string;
};

/**
 * Get style information based on range width percentage
 * - < 10%: Aggressive (higher APR, higher divergence loss)
 * - 10-20%: Neutral (medium APR, medium divergence loss)
 * - 21%+: Defensive (lower APR, lower divergence loss)
 */
export const getRangeStyle = (rangeWidth: number): RangeStyle => {
    if (rangeWidth < 10) {
        return {
            color: 'text-orange-600',
            label: 'Aggressive',
            tooltip: 'Higher APR, higher divergence loss.'
        };
    } else if (rangeWidth <= 20) {
        return {
            color: 'text-blue-600',
            label: 'Neutral',
            tooltip: 'Medium APR, medium divergence loss.'
        };
    } else {
        return {
            color: 'text-green-600',
            label: 'Defensive',
            tooltip: 'Lower APR, lower divergence loss.'
        };
    }
};
