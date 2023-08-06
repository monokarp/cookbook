import { ENV } from "@env";

console.log('ENV', ENV);

export interface Env {
    Type: 'Test' | 'Dev' | 'Prod'
}

export const Environment: Env = {
    Type: ENV
}