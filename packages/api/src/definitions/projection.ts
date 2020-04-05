import {
    backendEndpointImplementation,
    frontendEndpointImplementation,
    IEndpointDefiniton,
    IService,
} from "../common/index";

export interface ISingleProjectionPoint {
    mean: number;
    upper: number;
    lower: number;
    date: string;
}

export interface ISingleProjectionMeasure {
    description?: string;
    peak?: string;
    peak_number?: number;
    timeseries?: ISingleProjectionPoint[];
}

export interface IIntervention {
    date: string;
    measureId: number;
    measureDescription: string;
}

export interface IProjectionPoint {
    interventions: IIntervention[];
    projections: {
        [measure: string]: ISingleProjectionMeasure;
    };
}

export enum PROJECTION {
    ALABAMA = "Alabama",
    ALASKA = "Alaska",
    ARIZONA = "Arizona",
    ARKANSAS = "Arkansas",
    CALIFORNIA = "California",
    COLORADO = "Colorado",
    CONNECTICUT = "Connecticut",
    DELAWARE = "Delaware",
    DISTRICT_OF_COLUMBIA = "District of Columbia",
    FLORIDA = "Florida",
    GEORGIA = "Georgia",
    HAWAII = "Hawaii",
    IDAHO = "Idaho",
    ILLINOIS = "Illinois",
    INDIANA = "Indiana",
    IOWA = "Iowa",
    KANSAS = "Kansas",
    KENTUCKY = "Kentucky",
    LOUISIANA = "Louisiana",
    MAINE = "Maine",
    MARYLAND = "Maryland",
    MASSACHUSETTS = "Massachusetts",
    MICHIGAN = "Michigan",
    MINNESOTA = "Minnesota",
    MISSISSIPPI = "Mississippi",
    MISSOURI = "Missouri",
    MONTANA = "Montana",
    NEBRASKA = "Nebraska",
    NEVADA = "Nevada",
    NEW_HAMPSHIRE = "New Hampshire",
    NEW_JERSEY = "New Jersey",
    NEW_MEXICO = "New Mexico",
    NEW_YORK = "New York",
    NORTH_CAROLINA = "North Carolina",
    NORTH_DAKOTA = "North Dakota",
    OHIO = "Ohio",
    OKLAHOMA = "Oklahoma",
    OREGON = "Oregon",
    PENNSYLVANIA = "Pennsylvania",
    RHODE_ISLAND = "Rhode Island",
    SOUTH_CAROLINA = "South Carolina",
    SOUTH_DAKOTA = "South Dakota",
    TENNESSEE = "Tennessee",
    TEXAS = "Texas",
    UNITED_STATES = "United States",
    UTAH = "Utah",
    VERMONT = "Vermont",
    VIRGINIA = "Virginia",
    WASHINGTON = "Washington",
    WEST_VIRGINIA = "West Virginia",
    WISCONSIN = "Wisconsin",
    WYOMING = "Wyoming",
}

/**
 * Hosts the endpoints necessary to get corona projection data.
 */
interface IProjectionEndpoints extends IService {
    getProjection: IEndpointDefiniton<PROJECTION, IProjectionPoint>;
}

export const ProjectionService: IProjectionEndpoints = {
    getProjection: {
        backend: backendEndpointImplementation<PROJECTION, IProjectionPoint>(),
        endpoint: "/projection/:name",
        frontend: frontendEndpointImplementation("/projection/:name"),
        method: "get",
    },
};
