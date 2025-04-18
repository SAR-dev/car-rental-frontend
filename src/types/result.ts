import { FeaturesResponse, ImagesResponse, VehiclesResponse } from "./pocketbase";

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

export type TexpandVehicleDetailsResType = VehiclesResponse & {
    expand: {
        images: ImagesResponse[]
        featuresIncluded: FeaturesResponse[]
        featuresExcluded: FeaturesResponse[]
    };
};