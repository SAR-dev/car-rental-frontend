import { Link } from "react-router"

const NotFoundError = () => {
    return (
        <section className="bg-error/20">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl">
                        404
                    </h1>
                    <p className="mb-4 text-3xl tracking-tight font-bold opacity-50 md:text-4xl">
                        Something's missing.
                    </p>
                    <p className="mb-4 text-lg font-light opacity-80">
                        Sorry, we can't find that page. You'll find lots to explore on the home
                        page.
                    </p>
                    <Link to="/" className="btn my-4">
                        Back to Homepage
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default NotFoundError