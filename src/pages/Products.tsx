import { useEffect, useState } from 'react';
import NavLayout from '../layouts/NavLayout'
import { ProductList } from '../types/result'
import { api, formatPrice } from '../helpers'
import { Img } from 'react-image'
import { Link } from 'react-router'
import { useCartStore } from '../stores/cartStore'
import toast from 'react-hot-toast'

function Products() {
    const [products, setProducts] = useState<ProductList[]>([])
    const { addProduct } = useCartStore()
    
    useEffect(() => {
        api
            .get("/api/products")
            .then(res => setProducts(res.data.productList as unknown as ProductList[]))
    }, [])

    const handleAddProduct = (id: string) => {
        addProduct(id)
        toast.success("Product added to cart")
    }

    return (
        <NavLayout>
            <div className='py-16 px-10 container mx-auto'>
                <div className="text-xl font-semibold">Our Products, Your Choice</div>
                <div className="grid grid-cols-2 gap-5 my-10">
                    {products.map((data, i) => (
                        <div className="border border-base-200 shadow rounded-lg p-5 flex gap-8" key={i}>
                            <div className='h-64 w-64 flex-shrink-0'>
                                <Img
                                    className='h-64 w-full object-cover rounded'
                                    src={`${import.meta.env.VITE_API_URL}${data.image}`}
                                    loader={<div className="h-64 w-full rounded bg-base-100" />}
                                    unloader={<div className="h-64 w-full rounded bg-base-100 flex justify-center items-center font-semibold text-base-content/50">Not Found</div>}
                                />
                            </div>
                            <div className='flex flex-col justify-between'>
                                <div>
                                    <Link to={`/products/${data.id}`} className="font-semibold text-xl hover:text-info">{data.title}</Link>
                                    <div className="mt-3 line-clamp-3">{data.summary}</div>
                                    <div className="text-blue-700 font-bold mt-2 text-xl">CHF ${formatPrice(data.price)}</div>
                                </div>
                                <button className="btn btn-primary" onClick={() => handleAddProduct(data.id)}>Add to Cart</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </NavLayout>
    )
}

export default Products