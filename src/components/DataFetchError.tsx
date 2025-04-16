import { Link } from "react-router"

const DataFetchError = () => {
    return (
        <section className="bg-error/20">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl">
                        ERROR
                    </h1>
                    <p className="mb-4 text-3xl tracking-tight font-bold opacity-50 md:text-4xl">
                        Data fetch error occured.
                    </p>
                    <p className="mb-4 text-lg font-light opacity-80">
                        Sorry, we can't fetch required data. Please try again later.
                    </p>
                    <Link to="/" className="btn my-4">
                        Back to Homepage
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default DataFetchError