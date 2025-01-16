const formatNumber = (n: number | string): string => {
    n = Number(n);
    if (n >= 1000) return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
    if (n >= 10) return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
    if (n >= 1) return n.toLocaleString('en-US', { maximumFractionDigits: 4 });
    if (n >= 0.1) return n.toLocaleString('en-US', { maximumFractionDigits: 6 });
    if (n >= 0.001) return n.toLocaleString('en-US', { maximumFractionDigits: 10 });
    return n.toLocaleString('en-US', { maximumFractionDigits: 18 });
};

export default formatNumber