import Image from "next/image"
import Right from "@/components/icons/Right"

export default function Hero(){
    return(
        <section className='hero'>
            <div classname='py-12'>
                <h1 className='text-4xl font-semibold leading-relaxed'>
                    Everything is better with&nbsp;
                    <span className='text-primary'>Hunan Express</span>
                </h1>
                <p className='my-6 text-gray-500'>
                    Order your favorite chinese food here!
                </p>
                <div className='flex gap-4 text-sm'>
                    <button className='bg-primary flex items-center gap-2 text-white text-sm px-4 py-2 rounded-full'>
                        Order Now!
                        <Right />
                    </button>
                    <button className='py-2 flex gap-2 text-gray-600'>
                        Learn More
                        <Right />
                    </button>
                </div>
            </div>
            <div className='relative'>
                <Image src={'/HunanExpress.jpeg'} layout={'fill'}
                objectFit={'contain'} alt={'Chinese Restaurant'} />
            </div>
        </section>
    )
}