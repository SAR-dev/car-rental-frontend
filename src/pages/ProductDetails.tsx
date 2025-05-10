import { useEffect, useState } from 'react';
import NavLayout from '../layouts/NavLayout'
import { useParams } from 'react-router';
import { pb } from '../contexts/PocketContext';
import { Collections } from '../types/pocketbase';
import NotFoundError from '../components/NotFoundError';
import DataFetchError from '../components/DataFetchError';
import { TexpandProductDetailsResType } from '../types/result';
import { Img } from 'react-image';
import parse from 'html-react-parser';
import { useCartStore } from '../stores/cartStore';
import toast from 'react-hot-toast';
import { formatPrice } from '../helpers';

function ProductDetails() {
    const { id } = useParams();
    const [isloading, setIsloading] = useState(true)
    const { addProduct } = useCartStore()

    const [data, setData] = useState<TexpandProductDetailsResType | null>(null)
    const [notFound, setNotFound] = useState(false)
    const [fetchError, setFetchError] = useState(false)

    const [activeImageIndex, setActiveImageIndex] = useState(0)


    useEffect(() => {
        if (!id || id.length == 0) return;
        pb
            .collection(Collections.Products)
            .getOne(id, {
                expand: "images"
            })
            .then(res => {
                setData(res as unknown as TexpandProductDetailsResType)
            })
            .catch(err => {
                if (err.status == 404) {
                    setNotFound(true)
                    return;
                }
                setFetchError(err.status != 0)
            })
            .finally(() => setIsloading(false))
    }, [id])

    const handleAddProduct = () => {
        if (!data) return;
        addProduct(data.id)
        toast.success("Product added to cart")
    }

    if (notFound) return (
        <NavLayout>
            <NotFoundError />
        </NavLayout>
    )

    if (fetchError) return (
        <NavLayout>
            <DataFetchError />
        </NavLayout>
    )

    if (!data || isloading) return (
        <NavLayout>
            <div className="h-screen w-full"></div>
        </NavLayout>
    )

    return (
        <NavLayout>
            <div className='py-16 px-10 container mx-auto'>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="w-full h-fit sticky top-0">
                        <div className="w-full p-5 bg-base-200 border border-base-content/15 rounded flex flex-col gap-5">
                            <div className="bg-base-200 rounded-lg w-full h-[35rem] flex items-center justify-center">
                                <Img
                                    className='object-cover h-full w-full rounded'
                                    src={`${import.meta.env.VITE_API_URL}/api/files/images/${data.expand.images[activeImageIndex].id}/${data.expand.images[activeImageIndex].file}`}
                                    loader={<div className="h-full w-full rounded bg-base-100" />}
                                    unloader={<div className="h-full w-full rounded bg-base-100 flex justify-center items-center font-semibold text-base-content/50">Not Found</div>}
                                />
                            </div>
                            <div className="flex gap-3 justify-between">
                                {data.expand.images.map((img, i) => (
                                    <button
                                        className='h-20 w-full p-2 rounded bg-base-100 border border-base-content/15 hover:shadow hover:ring-2 hover:ring-primary ring-offset-4 cursor-pointer'
                                        onClick={() => setActiveImageIndex(i)}
                                        key={i}
                                    >
                                        <Img
                                            className='object-cover h-full w-full rounded'
                                            src={`${import.meta.env.VITE_API_URL}/api/files/images/${img.id}/${img.file}`}
                                            loader={<div className="h-full w-full rounded bg-base-100" />}
                                            unloader={<div className="h-full w-full rounded bg-base-100 flex justify-center items-center font-semibold text-base-content/50">Not Found</div>}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-10">
                        <div className='text-4xl font-semibold poppins-bold'>{data.title}</div>
                        <div className="text-blue-700 font-bold text-3xl">CHF ${formatPrice(data.price)}</div>
                        <button className="btn btn-primary" onClick={handleAddProduct}>Ajouter au panier</button>
                        <article className="prose text-base-content max-w-[150ch]">
                            {parse(data.description)}
                        </article>
                    </div>
                </div>
            </div>
        </NavLayout>
    )
}

export default ProductDetails