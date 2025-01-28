'use client'

interface FAQ {
    question: string;
    answer: string;
}

export default function FAQ() {

    const faqs: FAQ[] = [{
        question: "Why launch on Base chain?",
        answer: "Base has many advantages over other chains. It's an L2, so it's cheap. It's EVM compatible, so it's easy to deploy on. It's also fast, with 2 second block times. And perhaps most importantly, it has excellent integration with Coinbase. Users can buy crypto on Coinbase and transfer on-chain to use dapps in a few minutes. The Coinbase team is supportive of base chain and the total transactions and volume is skyrocketing! Base chain has a bright future."
    }, {
        question: "Why launch a token?",
        answer: "Part bootstrapping costs, part advertising, part community growth. Creation of an agent and autonomous action will require the token. The token will be used to pay for AI inference costs."
    }, {
        question: "What are the tokenomics?",
        answer: "A fixed supply of 1 billion tokens. No inflation or staking, just a simple token. The token will be used to pay for creating agents and autonomous actions. Running autonomously once a day = $, once every few minutes = $$$$."
    }, {
        question: "What is the token distribution?",
        answer: "50% team, 50% public."
    }, {
        question: "What is the tech stack?",
        answer: "NextJS, TailwindCSS, Node, Solidity, Foundry, Wagmi/Viem, Express, MongoDB."
    }, {
        question: "What protocols are you using?",
        answer: "Aerodrome.finance for swaps and liquidity, Aave for borrowing/lending. Rock-solid protocols with many options and liquidity. More protocols will be added in the future."
    }, {
        question: "Are you moving to other chains?",
        answer: "Eventually."
    }, {
        question:"How does autonomous action work?",
        answer: "Give Hiro instructions either in the chat box or using the Autonomous Instructions tool. Hiro will run these instructions every hour. Be specific about tokens and amounts. Hiro will clarify if anything is unclear."
    }
]


    return (
        <div>
            <h1 className="font-bold mb-5">FAQ (Frequently Asked Questions)</h1>
            <div>
                {faqs.map((faq, index) => (
                    <div key={index} className="py-5">
                        <h2 className="italic font-bold mb-3">{faq.question}</h2>
                        <p>{faq.answer}</p>
                    </div>
                ))}
            </div>
        </div>)
}