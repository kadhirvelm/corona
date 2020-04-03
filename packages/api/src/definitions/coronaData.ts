import {
    backendEndpointImplementation,
    frontendEndpointImplementation,
    IEndpointDefiniton,
    IService,
} from "../common/index";

export interface ICoronaDatapointTimeseriesDatapoint {
    cases?: number;
    deaths?: number;
    recovered?: number;
    active?: number;
    growthFactor?: number;
}

export interface ICoronaDataPoint {
    activeCases?: number;
    county?: string;
    deaths?: number;
    fipsCode: string;
    lastUpdated?: Date;
    recovered?: number;
    state?: string;
    totalCases: number;
    population?: number;
    timeseries?: {
        [date: string]: ICoronaDatapointTimeseriesDatapoint;
    };
}

export interface ICoronaBreakdown {
    description: string;
    totalData?: ICoronaDataPoint;
    breakdown: {
        [fipsCode: string]: ICoronaDataPoint;
    };
}

export enum STATE {
    ALABAMA = "Alabama",
    ALASKA = "Alaska",
    AMERICAN_SAMAO = "American Samoa",
    ARIZONA = "Arizona",
    ARKANSAS = "Arkansas",
    CALIFORNIA = "California",
    COLORADO = "Colorado",
    CONNECTICUT = "Connecticut",
    DELAWARE = "Delaware",
    FLORIDA = "Florida",
    GEORGIA = "Georgia",
    GUAM = "Guam",
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
    NORTHERN_MARINA_ISLANDS = "Northern Mariana Islands",
    OHIO = "Ohio",
    OKLAHOMA = "Oklahoma",
    OREGON = "Oregon",
    PENNSYLVANIA = "Pennsylvania",
    PUERTO_RICO = "Puerto Rico",
    RHODE_ISLAND = "Rhode Island",
    SOUTH_CAROLINA = "South Carolina",
    SOUTH_DAKOTA = "South Dakota",
    TENNESSEE = "Tennessee",
    TEXAS = "Texas",
    UNITED_STATES_VIRGIN_ISLANDS = "United States Virgin Islands",
    UTAH = "Utah",
    VERMONT = "Vermont",
    VIRGINIA = "Virginia",
    WASHINGTON = "Washington",
    WASHINGTON_DC = "Washington, D.C.",
    WEST_VIRGINIA = "West Virginia",
    WISCONSIN = "Wisconsin",
    WYOMING = "Wyoming",
}

/**
 * Hosts the endpoints necessary to retrieve corona data.
 */
interface ICoronaEndpoints extends IService {
    getUnitedStatesData: IEndpointDefiniton<{}, ICoronaBreakdown>;
    getStateData: IEndpointDefiniton<STATE, ICoronaBreakdown>;
}

export const CoronaService: ICoronaEndpoints = {
    getUnitedStatesData: {
        backend: backendEndpointImplementation<{}, ICoronaBreakdown>(),
        endpoint: "/data/united-states/all",
        frontend: frontendEndpointImplementation("/data/united-states/all"),
        method: "get",
    },
    getStateData: {
        backend: backendEndpointImplementation<STATE, ICoronaBreakdown>(),
        endpoint: "/data/united-states/:state",
        frontend: frontendEndpointImplementation("/data/united-states"),
        method: "get",
    },
};
