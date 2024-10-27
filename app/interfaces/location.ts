export interface Location {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    lat: string;
    lon: string;
    class: string;
    type: string;
    place_rank: number;
    importance: number;
    addresstype: string;
    name: string;
    display_name: string;
    address: Address;
    boundingbox: string[];
}

export interface Address {
    town: string;
    municipality: string;
    province: string;
    "ISO3166-2-lvl4": string;
    country: string;
    country_code: string;
}