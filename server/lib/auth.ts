import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
import { oidcProvider, jwt } from "better-auth/plugins";

export const auth = betterAuth({
    database: new Database("./sqlite.db"),
    emailAndPassword: { 
        enabled: true, 
    },
    plugins: [
        jwt(),
        oidcProvider({
            loginPage: "/",
            useJWTPlugin: true,
            trustedClients: [
                {
                    clientId: "test-client-id",
                    clientSecret: "test-client-secret",
                    name: "client",
                    type: "web",
                    redirectURLs: ["http://localhost:3001/api/auth/oauth2/callback/test"],
                    disabled: false,
                    skipConsent: true,
                    metadata: { internal: true }
                }
            ]
    })]
})
