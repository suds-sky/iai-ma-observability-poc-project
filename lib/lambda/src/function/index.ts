import {request} from 'graphql-request'
import * as console from "console";

const API_ENDPOINT = process.env.API_ENDPOINT as string

const query = `
    query getItem {
        getItem(id: "1") {
            id
            value
        }
    }
`

export const handler = async () => {
    const response = await request(API_ENDPOINT, query, {}, {
        "x-api-key": process.env.API_KEY as string,
    });
    console.log(response);
    return response;
};
