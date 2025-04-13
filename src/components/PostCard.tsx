import classNames from "classnames"

function PostCard({ reverse }: { reverse?: boolean }) {
    return (
        <div className="grid grid-cols-2 w-full gap-10">
            <div className={classNames("relative h-[30rem] w-full", {
                "order-last": reverse
            })}>
                <div className={classNames("absolute rounded-lg bg-primary h-64 w-64 bottom-0 -m-4 z-[-1]", {
                    "left-0": !reverse,
                    "right-0": reverse
                })} />
                <img
                    className="h-[30rem] w-full object-cover rounded-lg"
                    src="https://i.abcnewsfe.com/a/f43853f3-9eaf-4048-9ae7-757332c5787e/mclaren-1-ht-gmh-240412_1712928561648_hpMain_16x9.jpg" alt=""
                />
            </div>
            <div className="flex flex-col justify-between">
                <div className="text-5xl font-semibold tracking-tight">
                    Flexible rental services for all your needs
                </div>
                <div className="flex flex-col gap-10">
                    <div>
                        Patrick Location stands out with its flexible car and utility vehicle rental services. Whether you need a rental for a day or a month, we offer packages tailored to your specific needs. Our rental solutions are ideal for moving, or for weekend getaways.
                        Patrick Location stands out with its flexible car and utility vehicle rental services. Whether you need a rental for a day or a month, we offer packages tailored to your specific needs. Our rental solutions are ideal for moving, or for weekend getaways.
                        Patrick Location stands out with its flexible car and utility vehicle rental services. Whether you need a rental for a day or a month, we offer packages tailored to your specific needs. Our rental solutions are ideal for moving, or for weekend getaways.
                    </div>
                    <div>
                        <button className="btn btn-primary btn-lg text-white w-24">
                            Book
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostCard