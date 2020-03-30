import Express from "express";
import { PORT } from "../constants";

type IMethods = "get" | "post" | "put" | "delete";

type IBackendEndpointResponse<T, E> = (payload: T, response: Express.Response) => Promise<E>;
type IBackendEndpointDefinition<T, E> = (
    payload: T,
    response: Express.Response,
    getData: IBackendEndpointResponse<T, E>,
) => void;

type IFrontendEndpointDefintion<Payload, Response> = (payload: Payload) => Promise<Response>;

export interface IEndpointDefiniton<Payload extends {}, Response extends {}> {
    backend: IBackendEndpointDefinition<Payload, Response>;
    endpoint: string;
    frontend: IFrontendEndpointDefintion<Payload, Response>;
    method: IMethods;
}

export interface IService {
    [key: string]: IEndpointDefiniton<any, any>;
}

export function backendEndpointImplementation<Payload, Response>() {
    return async (
        payload: Payload,
        response: Express.Response,
        getData: IBackendEndpointResponse<Payload, Response>,
    ) => {
        try {
            const data = await getData(payload, response);
            response.status(200).send(data);
        } catch (error) {
            response.status(500).send({ error });
        }
    };
}

const origin = process.env.NODE_ENV === "production" ? process.env.PRODUCTION_HOST : "localhost";

export function frontendEndpointImplementation<Payload, Response>(
    endpoint: string,
    method: IMethods = "get",
): IFrontendEndpointDefintion<Payload, Response> {
    return async (payload: Payload) => {
        let rawResponse: globalThis.Response;

        if (method === "get") {
            const stringPayload: string = typeof payload !== "string" ? "" : `/${payload}`;
            rawResponse = await fetch(`http://${origin}:${PORT}${endpoint}${stringPayload}`, {
                method,
            });
        } else {
            rawResponse = await fetch(`http://${origin}:${PORT}${endpoint}`, {
                body: JSON.stringify(payload),
                method: method.toUpperCase(),
            });
        }

        return (await rawResponse.json()) as Response;
    };
}
