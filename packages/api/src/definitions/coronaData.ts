import {
    backendEndpointImplementation,
    frontendEndpointImplementation,
    IEndpointDefiniton,
    IService,
} from "../common/index";

export interface IVirusData {
    total: number;
    breakdown: {
        [key: string]: number;
    };
}

export enum STATE {
    ALABAMA = "Alabama",
    ALASKA = "Alaska",
    ARIZONA = "Arizona",
    ARKANSAS = "Arkansas",
    CALIFORNIA = "California",
    COLORADO = "Colorado",
    CONNECTICUT = "Connecticut",
    DELAWARE = "Delaware",
    DISTRICT_OF_COLUMBIA = "District Of Columbia",
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
    UTAH = "Utah",
    VERMONT = "Vermont",
    VIRGINIA = "Virginia",
    WASHINGTON = "Washington",
    WEST_VIRGINIA = "West Virginia",
    WISCONSIN = "Wisconsin",
    WYOMING = "Wyoming",
}

/**
 * Hosts the endpoints necessary to retrieve corona data.
 */
interface ICoronaEndpoints extends IService {
    getUnitedStatesData: IEndpointDefiniton<{}, IVirusData>;
    getStateData: IEndpointDefiniton<STATE, IVirusData>;
}

export const CoronaService: ICoronaEndpoints = {
    getUnitedStatesData: {
        backend: backendEndpointImplementation<{}, IVirusData>(),
        endpoint: "/data/united-states/all",
        frontend: frontendEndpointImplementation("/data/united-states/all"),
        method: "get",
    },
    getStateData: {
        backend: backendEndpointImplementation<STATE, IVirusData>(),
        endpoint: "/data/united-states/:state",
        frontend: frontendEndpointImplementation("/data/united-states"),
        method: "get",
    },
};
