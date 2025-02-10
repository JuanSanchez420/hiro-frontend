const truncateAddress = (address: `0x${string}`) => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 5)}...${address.slice(-5)}`;
}

export default truncateAddress;