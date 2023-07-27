
import { ENV } from "@env";

console.log('ENV_TYPE', ENV);
console.log(process.env);

export interface Env {
    Type: 'Test' | 'Dev'
}

export const Environment: Env = {
    Type: ENV
}