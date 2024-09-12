import Image from 'next/image'
export default function HomeMenu(){
    return(
        <section>
            <div>
                <div className='h-48 w-48 absolute'>
                <Image src={'/SideFood.jpg'} layout={'fill'} 
                objectFit={'contain'} alt ={'placeholder'}>
                </Image>
                </div>
            </div>
            <div className='text-center'>
                <h3 className='uppercase text-gray-600 font-semibold leading-4'>
                    Checkout
                </h3>
                <h2 className='text-primary font-bold text-4xl italic'>
                    Menu
                </h2>
            </div>
        </section>
    )
}