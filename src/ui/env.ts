export interface Env {
    Type: "Test" | "Dev" | "Prod";
    ClientID: string;
}

const env = process.env.EXPO_PUBLIC_ENV;

console.log("ENV", env);

export const Environment: Env = {
    Type: (env ?? "Dev") as Env["Type"],
    ClientID: process.env.EXPO_PUBLIC_CLIENT_ID ?? "",
};
