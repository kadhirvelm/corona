import { IGetCoronaData } from "../definitions/coronaData";

export const getMockCoronaDataService: IGetCoronaData = {
    getUnitedStatesData: () => {
        return new Promise(resolve => {
            resolve({
                total: 30134,
                breakdown: {
                    Alabama: 326,
                    Alaska: 537,
                    Arizona: 650,
                    Arkansas: 177,
                    California: 742,
                    Colorado: 661,
                    Connecticut: 886,
                    Delaware: 705,
                    "District Of Columbia": 141,
                    Florida: 289,
                    Georgia: 709,
                    Guam: 924,
                    Hawaii: 947,
                    Idaho: 626,
                    Illinois: 793,
                    Indiana: 639,
                    Iowa: 309,
                    Kansas: 363,
                    Kentucky: 456,
                    Louisiana: 784,
                    Maine: 279,
                    Maryland: 966,
                    Massachusetts: 503,
                    Michigan: 401,
                    Minnesota: 379,
                    Mississippi: 95,
                    Missouri: 757,
                    Montana: 79,
                    Nebraska: 584,
                    Nevada: 157,
                    "New Hampshire": 537,
                    "New Jersey": 285,
                    "New Mexico": 747,
                    "New York": 472,
                    "North Carolina": 739,
                    "North Dakota": 855,
                    Ohio: 726,
                    Oklahoma: 881,
                    Oregon: 555,
                    Pennsylvania: 972,
                    "Puerto Rico": 331,
                    "Rhode Island": 709,
                    "South Carolina": 355,
                    "South Dakota": 309,
                    Tennessee: 488,
                    Texas: 866,
                    Utah: 696,
                    Vermont: 685,
                    Virginia: 938,
                    Washington: 534,
                    "West Virginia": 959,
                    Wisconsin: 485,
                    Wyoming: 146,
                },
            });
        });
    },
    getStateData: () => {
        return new Promise(resolve => {
            resolve({
                total: 28233,
                breakdown: {
                    "Alameda County": 341,
                    "Alpine County": 259,
                    "Amador County": 76,
                    "Butte County": 263,
                    "Calaveras County": 910,
                    "Colusa County": 500,
                    "Contra Costa County": 639,
                    "Del Norte County": 130,
                    "El Dorado County": 981,
                    "Fresno County": 119,
                    "Glenn County": 425,
                    "Humboldt County": 703,
                    "Imperial County": 721,
                    "Inyo County": 805,
                    "Kern County": 108,
                    "Kings County": 493,
                    "Lake County": 15,
                    "Lassen County": 608,
                    "Los Angeles County": 801,
                    "Madera County": 508,
                    "Marin County": 819,
                    "Mariposa County": 16,
                    "Mendocino County": 380,
                    "Merced County": 767,
                    "Modoc County": 274,
                    "Mono County": 468,
                    "Monterey County": 222,
                    "Napa County": 57,
                    "Nevada County": 701,
                    "Orange County": 494,
                    "Placer County": 739,
                    "Plumas County": 989,
                    "Riverside County": 988,
                    "Sacramento County": 940,
                    "San Benito County": 280,
                    "San Bernardino County": 938,
                    "San Diego County": 934,
                    "San Francisco County": 808,
                    "San Joaquin County": 86,
                    "San Luis Obispo County": 271,
                    "San Mateo County": 665,
                    "Santa Barbara County": 92,
                    "Santa Clara County": 201,
                    "Santa Cruz County": 413,
                    "Shasta County": 316,
                    "Sierra County": 594,
                    "Siskiyou County": 485,
                    "Solano County": 639,
                    "Sonoma County": 801,
                    "Stanislaus County": 145,
                    "Sutter County": 88,
                    "Tehama County": 211,
                    "Trinity County": 630,
                    "Tulare County": 810,
                    "Tuolumne County": 101,
                    "Ventura County": 377,
                    "Yolo County": 435,
                    "Yuba County": 654,
                },
            });
        });
    },
};