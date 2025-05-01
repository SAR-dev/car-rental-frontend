import { AgenciesResponse, FeaturesResponse, ImagesResponse, ProductsResponse, VehicleOptionsResponse, VehiclesResponse } from "./pocketbase";

export interface VehicleList {
    id: string
    fuelType: string
    image: string
    minPrice: number
    model: string
    noOfDoors: number
    noOfSeats: number
    title: string
    transmissionType: string
}

export interface ProductList {
    id: string
    title: string
    image: string
    price: number
    summary: string
}

export type TexpandVehicleDetailsResType = VehiclesResponse & {
    expand: {
        images: ImagesResponse[]
        featuresIncluded: FeaturesResponse[]
        featuresExcluded: FeaturesResponse[]
        agencies: AgenciesResponse[]
        vehicleOptions: VehicleOptionsResponse[]
    };
};

export type TexpandProductDetailsResType = ProductsResponse & {
    expand: {
        images: ImagesResponse[]
    };
};

export type TexpandVehicleDetailsShortResType = VehiclesResponse & {
    expand: {
        agencies: AgenciesResponse[]
        vehicleOptions: VehicleOptionsResponse[]
    };
};