import { ENV, CLIENT_ID } from "@env";

console.log('ENV', ENV);

export interface Env {
    Type: 'Test' | 'Dev' | 'Prod';
    ClientID: string;
}

export const Environment: Env = {
    Type: ENV,
    ClientID: CLIENT_ID,
}