function LocationCard() {
    return (
        <div className="p-5 bg-white text-black rounded-lg">
            <div className="grid grid-cols-2">
                <div className="font-semibold text-lg mb-5">Bussigny Lausanne</div>
                <div className="font-semibold text-lg mb-5">Opening Hours</div>
                <div className="flex flex-col gap-.5">
                    <div>Boulevard de l'Arc-en-ciel 42</div>
                    <div>1030 Bussigny-près-Lausanne</div>
                    <div className="h-5" />
                    <div>Tel : +41 (21) 706 59 59</div>
                    <div>Fax : +41 (21) 706 59 58</div>
                    <div>bussigny@patricklocation.ch</div>
                </div>
                <div className="flex flex-col gap-1">
                    <div>Monday - Friday: 8000 to 1730</div>
                    <div>Saturday: 8000 to 1130</div>
                    <div>Sunday: Close</div>
                </div>
            </div>
        </div>
    )
}

export default LocationCard