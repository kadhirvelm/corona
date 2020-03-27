import { IVirusData, STATE } from "@corona/api";
import { getUSCoronaData } from "@corona/pipeline";
import { convertStateToTwoLetterCode } from "@corona/utils";

export async function getCountryCoronaData(): Promise<IVirusData> {
    return new Promise(async resolve => {
        // eslint-disable-next-line @typescript-eslint/await-thenable
        const data = await getUSCoronaData();
        resolve(data.country);
    });
}

export async function getStateCoronaData(state: STATE): Promise<IVirusData> {
    return new Promise(async resolve => {
        // eslint-disable-next-line @typescript-eslint/await-thenable
        const data = await getUSCoronaData();
        resolve(data.states[convertStateToTwoLetterCode(state)]);
    });
}
