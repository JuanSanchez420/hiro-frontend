export default function FAQ() {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <h1 className="font-bold mb-5">Frequently Asked Questions</h1>

      <h2 className="font-semibold mb-3 mt-6">What is Hiro?</h2>
      <p className="mb-4">Hiro is an AI agent that simplifies crypto interactions and DeFi operations.</p>

      <h2 className="font-semibold mb-3 mt-6">How do I get started?</h2>
      <p className="mb-4">Connect your wallet using the &ldquo;Connect Wallet&rdquo; button in the top navigation.</p>

      <h2 className="font-semibold mb-3 mt-6">What networks does Hiro support?</h2>
      <p className="mb-4">Currently, Hiro supports Ethereum and compatible networks.</p>

      <h2 className="font-semibold mb-3 mt-6">Is my wallet secure?</h2>
      <p className="mb-4">Hiro never has access to your private keys. All transactions require your explicit approval through your connected wallet.</p>

      <h2 className="font-semibold mb-3 mt-6">What DeFi protocols does Hiro integrate with?</h2>
      <p className="mb-4">Hiro integrates with major DeFi protocols including Aave for lending/borrowing and Uniswap for liquidity provision.</p>
    </div>
  )
}
