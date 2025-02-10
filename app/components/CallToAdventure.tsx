import Image from 'next/image'
import TypingEffect from './TypingEffect'

const CallToAventure = () => {
    return (
        <div>
            <div className="flex flex-col">
                <div className='mx-auto h-20 pb-5'>
                    <span className='font-bold text-3xl uppercase w-80 block'><TypingEffect lines={["It's dangerous to go alone. Take this."]} speed={100} /></span>
                </div>
                <div className="flex justify-evenly">
                    <div className="text-5xl"><Image src="/images/fire.gif" height={50} width={50} alt="fire"/></div>
                    <div><Image src="/images/hiro.png" height={50} width={50} alt="hiro" /></div>
                    <div className="text-5xl"><Image src="/images/fire.gif" height={50} width={50} alt="fire"/></div>
                </div>
            </div>
            <div className="flex mt-10">
                <div className="mx-auto hover:cursor-pointer animate-bounce">
                    <Image src="/images/wooden-sword.gif" width={14} height={32} alt="magical sword"/>
                </div>
            </div>

        </div>

    )
}

export default CallToAventure