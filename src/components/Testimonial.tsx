import { FaStar } from 'react-icons/fa'

function Testimonial() {
    return (
        <div className="carousel-item h-64 rounded bg-primary w-1/3 text-white p-5">
            <div className="flex flex-col justify-between h-full">
                <div className="grid grid-cols-1">
                    <div className="text-xl font-semibold">Sarah R</div>
                    <div>Patrick Japan Client</div>
                </div>
                <div className="grid grid-cols-1 gap-3">
                    <div className="flex gap-2">
                        {[...Array(5)].map((_, i) => <FaStar className="size-5" key={i} />)}
                    </div>
                    <div>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Molestiae quasi eligendi aspernatur necessitatibus quaerat voluptate voluptatem assumenda sint.</div>
                </div>
            </div>
        </div>
    )
}

export default Testimonial