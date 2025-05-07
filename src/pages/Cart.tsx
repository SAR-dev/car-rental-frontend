import { useEffect, useMemo, useState } from 'react';
import NavLayout from '../layouts/NavLayout'
import { ProductList } from '../types/result';
import { Img } from 'react-image';
import { api } from '../helpers';
import { Link } from 'react-router';
import { useCartStore } from '../stores/cartStore';
import toast from 'react-hot-toast';

function Cart() {
    const [products, setProducts] = useState<ProductList[]>([])
    const { removeProduct, products: productList } = useCartStore()

    useEffect(() => {
        api
            .get("/api/cart-products", {
                params: {
                    productIds: productList.join(",")
                }
            })
            .then(res => setProducts(res.data.productList as unknown as ProductList[]))
    }, [])

    const handleRemoveProduct = (id: string) => {
        removeProduct(id)
        toast.success("Product removed from cart")
    }

    const productCount = useMemo(() => {
        return productList.reduce((acc: { [key: string]: number }, id: string) => {
            acc[id] = (acc[id] || 0) + 1;
            return acc;
        }, {});
    }, [productList]);

    return (
        <NavLayout>
            <div className='py-16 px-10 max-w-6xl mx-auto'>
                <div className="text-3xl font-semibold poppins-bold">Your Cart</div>
                <div className='text-center'>{productList.length} products in cart</div>
                <div className="grid grid-cols-1 gap-5 my-10">
                    {products.map((data) => {
                        const count = productCount[data.id] || 0;

                        return [...Array(count)].map((_, i) => (
                            <div className="border border-base-200 shadow rounded-lg p-5 flex lg:flex-row flex-col gap-8" key={`${data.id}-${i}`}>
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
                                        <div className="mt-3 line-clamp-5">{data.summary}</div>
                                    </div>
                                    <button className="btn btn-primary mt-5" onClick={() => handleRemoveProduct(data.id)}>Remove from Cart</button>
                                </div>
                            </div>
                        ));
                    })}
                </div>
            </div>
        </NavLayout>
    )
}

export default Cart