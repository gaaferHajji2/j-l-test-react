import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "react-feather";

interface Props {
    autoSlide?: boolean;
    slideInterval?: number;
    children: React.ReactElement[];
}

const Carousel = ({ autoSlide = false, slideInterval = 1000, children }: Props) => {

    const [index, setIndex] = useState<number>(0);

    const prev = () => setIndex(index => index === 0 ? children.length - 1 : index - 1 );

    const next = () => setIndex(index => index === children.length - 1 ? 0 : index + 1);


    useEffect(()=>{
        if(autoSlide == false) return;

        const t1 = setInterval(next, slideInterval);

        return () => clearInterval(t1);
    }, [])

    return (
        <div className='overflow-hidden relative'>
            <div className='flex transition-transform ease-out duration-500' 
                style={{ transform: `translateX(-${index * 100}%)`}}>
                {children}
            </div>

            <div className='absolute inset-0 flex items-center justify-between p-4'>
                <button className="p-1 rounded-full shadow 
                    bg-white/80 text-gray-800 hover:bg-white transition-colors">
                    <ChevronLeft size={40} onClick={prev} />
                </button>

                <button className="p-1 rounded-full shadow bg-white/80 
                    text-gray-800 hover:bg-white transition-colors">
                    <ChevronRight size={40} onClick={next} />
                </button>
            </div>
            

            <div className="absolute bottom-4 left-0 right-0">

                <div className="flex justify-center items-center gap-2">
                    { children.map((_, i) => 
                        <div key={i} 
                            className=
                            {`transition-all w-3 h-3 bg-white rounded-full ${index === i ? 'p-2' : 'bg-opacity-50'}`} 
                        />)
                    }
                </div>

            </div>

        </div>
    )
}

export default Carousel