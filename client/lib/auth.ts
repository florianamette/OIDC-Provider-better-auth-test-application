import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
import { genericOAuth } from "better-auth/plugins";
 
export const auth = betterAuth({
    database: new Database("./sqlite.db"),
    plugins: [ 
        genericOAuth({ 
            config: [ 
                { 
                    providerId: "test",
                    clientId: "test-client-id", 
                    clientSecret: "test-client-secret", 
                    discoveryUrl: "http://localhost:3000/api/auth/.well-known/openid-configuration",
                    scopes: ["openid", "profile", "email"],
                },
            ] 
        }) 
    ]
})
