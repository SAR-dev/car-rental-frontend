/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Authorigins = "_authOrigins",
	Externalauths = "_externalAuths",
	Mfas = "_mfas",
	Otps = "_otps",
	Superusers = "_superusers",
	Agencies = "agencies",
	Features = "features",
	Images = "images",
	Products = "products",
	Reservations = "reservations",
	Users = "users",
	VehicleOptions = "vehicleOptions",
	VehiclePackages = "vehiclePackages",
	VehicleTypes = "vehicleTypes",
	Vehicles = "vehicles",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AuthoriginsRecord = {
	collectionRef: string
	created?: IsoDateString
	fingerprint: string
	id: string
	recordRef: string
	updated?: IsoDateString
}

export type ExternalauthsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	provider: string
	providerId: string
	recordRef: string
	updated?: IsoDateString
}

export type MfasRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	method: string
	recordRef: string
	updated?: IsoDateString
}

export type OtpsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	password: string
	recordRef: string
	sentTo?: string
	updated?: IsoDateString
}

export type SuperusersRecord = {
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

export type AgenciesRecord = {
	created?: IsoDateString
	details?: HTMLString
	id: string
	name?: string
	updated?: IsoDateString
}

export type FeaturesRecord = {
	created?: IsoDateString
	id: string
	title?: string
	updated?: IsoDateString
}

export type ImagesRecord = {
	created?: IsoDateString
	file: string
	id: string
	updated?: IsoDateString
}

export type ProductsRecord = {
	created?: IsoDateString
	description: HTMLString
	id: string
	images?: RecordIdString[]
	price?: number
	summary: string
	title: string
	updated?: IsoDateString
}

export enum ReservationsStatusOptions {
	"ONGOING" = "ONGOING",
	"CONFIRMED" = "CONFIRMED",
}
export type ReservationsRecord = {
	agency?: RecordIdString
	created?: IsoDateString
	endAt?: IsoDateString
	id: string
	price?: number
	products?: RecordIdString[]
	startAt?: IsoDateString
	status?: ReservationsStatusOptions
	updated?: IsoDateString
	user?: RecordIdString
	vehicle?: RecordIdString
}

export type UsersRecord = {
	address?: string
	avatar?: string
	contactNo?: string
	created?: IsoDateString
	dateOfBirth: IsoDateString
	driverLicenseNo: string
	driverLicensePlace?: string
	email: string
	emailVisibility?: boolean
	firstName: string
	id: string
	lastName: string
	password: string
	postCode?: string
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

export type VehicleOptionsRecord = {
	created?: IsoDateString
	id: string
	price?: number
	subtitle: string
	title: string
	updated?: IsoDateString
}

export type VehiclePackagesRecord = {
	basePrice?: number
	created?: IsoDateString
	id: string
	minKmLimit?: number
	pricePerExtraKm?: number
	title?: string
	updated?: IsoDateString
	vehicle: RecordIdString
}

export type VehicleTypesRecord = {
	created?: IsoDateString
	id: string
	title?: string
	updated?: IsoDateString
}

export enum VehiclesTransmissionTypeOptions {
	"MANUAL" = "MANUAL",
	"AUTOMATIC" = "AUTOMATIC",
}

export enum VehiclesFuelTypeOptions {
	"PETROL" = "PETROL",
	"DIESEL" = "DIESEL",
	"ELECTRIC" = "ELECTRIC",
	"HYBRID" = "HYBRID",
	"CNG" = "CNG",
	"LPG" = "LPG",
	"HYDROGEN" = "HYDROGEN",
	"ETHANOL" = "ETHANOL",
	"BIODIESEL" = "BIODIESEL",
	"METHANOL" = "METHANOL",
	"PROPANE" = "PROPANE",
}
export type VehiclesRecord = {
	agencies?: RecordIdString[]
	created?: IsoDateString
	externalHeight?: string
	featuresExcluded?: RecordIdString[]
	featuresIncluded?: RecordIdString[]
	fuelType?: VehiclesFuelTypeOptions
	id: string
	images?: RecordIdString[]
	licenceType?: string
	loadDimensions?: string
	model?: string
	noOfDoors?: number
	noOfSeats?: number
	payloadWeight?: string
	title?: string
	transmissionType?: VehiclesTransmissionTypeOptions
	updated?: IsoDateString
	vehicleOptions?: RecordIdString[]
	vehicleTypes?: RecordIdString[]
}

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> & BaseSystemFields<Texpand>
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> & AuthSystemFields<Texpand>
export type AgenciesResponse<Texpand = unknown> = Required<AgenciesRecord> & BaseSystemFields<Texpand>
export type FeaturesResponse<Texpand = unknown> = Required<FeaturesRecord> & BaseSystemFields<Texpand>
export type ImagesResponse<Texpand = unknown> = Required<ImagesRecord> & BaseSystemFields<Texpand>
export type ProductsResponse<Texpand = unknown> = Required<ProductsRecord> & BaseSystemFields<Texpand>
export type ReservationsResponse<Texpand = unknown> = Required<ReservationsRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>
export type VehicleOptionsResponse<Texpand = unknown> = Required<VehicleOptionsRecord> & BaseSystemFields<Texpand>
export type VehiclePackagesResponse<Texpand = unknown> = Required<VehiclePackagesRecord> & BaseSystemFields<Texpand>
export type VehicleTypesResponse<Texpand = unknown> = Required<VehicleTypesRecord> & BaseSystemFields<Texpand>
export type VehiclesResponse<Texpand = unknown> = Required<VehiclesRecord> & BaseSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	agencies: AgenciesRecord
	features: FeaturesRecord
	images: ImagesRecord
	products: ProductsRecord
	reservations: ReservationsRecord
	users: UsersRecord
	vehicleOptions: VehicleOptionsRecord
	vehiclePackages: VehiclePackagesRecord
	vehicleTypes: VehicleTypesRecord
	vehicles: VehiclesRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	agencies: AgenciesResponse
	features: FeaturesResponse
	images: ImagesResponse
	products: ProductsResponse
	reservations: ReservationsResponse
	users: UsersResponse
	vehicleOptions: VehicleOptionsResponse
	vehiclePackages: VehiclePackagesResponse
	vehicleTypes: VehicleTypesResponse
	vehicles: VehiclesResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: '_authOrigins'): RecordService<AuthoriginsResponse>
	collection(idOrName: '_externalAuths'): RecordService<ExternalauthsResponse>
	collection(idOrName: '_mfas'): RecordService<MfasResponse>
	collection(idOrName: '_otps'): RecordService<OtpsResponse>
	collection(idOrName: '_superusers'): RecordService<SuperusersResponse>
	collection(idOrName: 'agencies'): RecordService<AgenciesResponse>
	collection(idOrName: 'features'): RecordService<FeaturesResponse>
	collection(idOrName: 'images'): RecordService<ImagesResponse>
	collection(idOrName: 'products'): RecordService<ProductsResponse>
	collection(idOrName: 'reservations'): RecordService<ReservationsResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
	collection(idOrName: 'vehicleOptions'): RecordService<VehicleOptionsResponse>
	collection(idOrName: 'vehiclePackages'): RecordService<VehiclePackagesResponse>
	collection(idOrName: 'vehicleTypes'): RecordService<VehicleTypesResponse>
	collection(idOrName: 'vehicles'): RecordService<VehiclesResponse>
}
