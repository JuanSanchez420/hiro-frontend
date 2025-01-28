'use client'

import CallToAventure from "../components/CallToAdventure";
import CombinedChart from "../components/CombinedChart";
import Message from "../components/MessageBox";
import { TokensData } from "../types";
import tokensData from "../utils/tokens.json";

const functionCall = {
    name: "getETHBalance",
    arguments: "{\"address\":\"0x1234567890000000000000000000\"}"
}

const assistantMessage = "This is an assistant message. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."

const userMessage = "this is a user prompt"

const Row = ({ children }: { children: React.ReactNode }) => {
    return (<div className="my-5">{children}</div>)
}

const Playground = () => {
    const tokens: TokensData = tokensData;

    return (
        <div className="flex flex-col">
            <Row><CallToAventure /></Row>
            <Row><Message type="user" message={userMessage} /></Row>
            <Row><Message type="assistant" message={assistantMessage} /></Row>
            <Row><Message type="function" message={JSON.stringify(functionCall)} /></Row>
            <Row>
                <div className="fairy">
                    <div className="fairy-body"></div>
                    <div className="fairy-wing left"></div>
                    <div className="fairy-wing right"></div>
                    <div className="sparkle"></div>
                    <div className="sparkle"></div>
                    <div className="sparkle"></div>
                </div>
            </Row>
            <Row>
                <CombinedChart token={tokens['WETH']} hours={168} />
            </Row>
        </div>
    );
}

export default Playground;