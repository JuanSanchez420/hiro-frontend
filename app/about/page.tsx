export default function About() {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <h1 className="font-bold mb-5">About Hiro</h1>

      <h2 className="font-semibold mb-3 mt-6">Our Mission</h2>
      <p className="mb-4">Hiro is designed to make decentralized finance accessible to everyone by providing an intuitive AI-powered interface for complex DeFi operations.</p>

      <h2 className="font-semibold mb-3 mt-6">What Makes Hiro Different</h2>
      <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
        <li><strong>Natural Language Interface:</strong> No need to understand complex DeFi terminology</li>
        <li><strong>AI-Powered Recommendations:</strong> Get personalized suggestions based on your portfolio</li>
        <li><strong>Autonomous Operations:</strong> Let Hiro manage positions on your behalf with your approval</li>
        <li><strong>Multi-Protocol Support:</strong> Interact with multiple DeFi protocols from a single interface</li>
      </ul>

      <h2 className="font-semibold mb-3 mt-6">Technology</h2>
      <p className="mb-4">Built with Next.js 15, React 19, and powered by advanced language models, Hiro combines modern web technologies with cutting-edge AI to deliver a seamless DeFi experience.</p>

      <h2 className="font-semibold mb-3 mt-6">Security</h2>
      <p className="mb-4">Your security is our priority. Hiro never has access to your private keys, and all transactions require explicit approval through your connected wallet.</p>
    </div>
  )
}
