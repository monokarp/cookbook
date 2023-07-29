
import { ENV } from "@env";

console.log('ENV_TYPE', ENV);
console.log(process.env);

export interface Env {
    Type: 'Test' | 'Dev' | 'Prod'
}

export const Environment: Env = {
    Type: ENV
}