import { ReactNode, useState } from 'react'
import { FaMinus, FaPlus } from 'react-icons/fa'
import classNames from 'classnames'

function CollapseForm({
    title,
    titleClass,
    defaultOpen,
    children
}: {
    title: string,
    titleClass?: string,
    defaultOpen?: boolean,
    children: ReactNode
}) {
    const [isOpen, setIsOpen] = useState(defaultOpen)

    return (
        <div className={classNames("collapse", {
            "collapse-open": isOpen,
            "collapse-close": !isOpen,
        })}>
            <div className="flex justify-between items-center p-5">
                <div className={"font-semibold " + titleClass}>
                    {title}
                </div>
                <button className='btn btn-xs btn-square text-primary' onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <FaMinus className='size-4' /> : <FaPlus className='size-4' />}
                </button>
            </div>
            <div className="collapse-content">
                {children}
            </div>
        </div>
    )
}

export default CollapseForm