# Better Auth OIDC Provider & Adapter Test

This repository demonstrates testing the OIDC (OpenID Connect) provider and adapter functionality of [Better Auth](https://better-auth.com/). It consists of two applications: a server acting as an OIDC provider and a client using the OIDC adapter to authenticate.

## 🏗️ Architecture

```
┌─────────────────┐    OAuth Flow    ┌─────────────────┐
│   Client App    │ ◄──────────────► │  Server App     │
│   (Port 3001)   │                  │  (Port 3000)    │
│                 │                  │                 │
│ • Generic Oauth │                  │ • OIDC Provider │
│ • React UI      │                  │ • Auth Server   │
│                 │                  │                 │
└─────────────────┘                  └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### 1. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies  
cd ../client
npm install
```

### 2. Create Database Files

```bash
# Create server database file
cd server
touch sqlite.db

# Create client database file
cd ../client
touch sqlite.db
```

### 3. Initialize Databases

```bash
# Initialize server database
cd server
npx @better-auth/cli@latest migrate

# Initialize client database
cd ../client
npx @better-auth/cli@latest migrate
```

### 4. Start the Applications

**Terminal 1 - Start the Server (OIDC Provider):**
```bash
cd server
npm run dev
```
Server will be available at: http://localhost:3000

**Terminal 2 - Start the Client (OIDC Adapter):**
```bash
cd client
npm run dev
```
Client will be available at: http://localhost:3001

### 5. Test the OAuth Flow

1. Open http://localhost:3001 in your browser
2. Click "Sign In with Generic OAuth"
3. You'll be redirected to the server's OAuth flow
4. Create a new user or log in with existing credentials
5. After authentication, you'll be redirected back to the client
6. View both session information and user information

## 🔧 Configuration

### Server Configuration (`server/lib/auth.ts`)

The server is configured as an OIDC provider with:

```typescript
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
        })
    ]
})
```

### Client Configuration (`client/lib/auth-clients.ts`)

The client uses the OIDC adapter:

```typescript
export const authClient = createAuthClient({
    baseURL: "http://localhost:3001",
    plugins: [
        genericOAuthClient()
    ]
})
```

## 📊 What You'll See

After successful authentication, the application displays:

### 1. User Information (from Auth Server)
- Retrieved from `/api/auth/oauth2/userinfo` endpoint
- Contains detailed user profile data from the OAuth provider
- Uses Bearer token authentication

### 2. Session Information (from Client)
- Retrieved from client-side session data
- Contains authentication state, tokens, and basic user data
- Includes session token used for API calls

## 🔍 Key Features Tested

- ✅ **OIDC Provider Setup**: Server acts as OAuth 2.0/OpenID Connect provider
- ✅ **OIDC Generic OAuth Integration**: Client uses Better Auth's Generic OAuth
- ✅ **OAuth Flow**: Complete authorization code flow
- ✅ **Token Management**: Access token extraction and usage
- ✅ **User Info API**: Fetching user profile information
- ✅ **Session Management**: Client-side session handling
- ✅ **Error Handling**: Graceful error handling for failed requests

## 🛠️ Development

### Project Structure
```
test-better-auth/
├── server/                 # OIDC Provider
│   ├── app/
│   │   ├── api/auth/       # Auth API routes
│   │   └── page.tsx        # Server UI
│   ├── lib/
│   │   └── auth.ts         # Better Auth configuration
│   └── package.json
├── client/                 # Generic OAuth Client
│   ├── app/
│   │   ├── api/auth/       # Auth API routes
│   │   └── page.tsx        # Client UI
│   ├── lib/
│   │   └── auth-clients.ts # Generic OAuth client configuration
│   └── package.json
└── README.md
```

### Database
Both applications use SQLite databases:
- `server/sqlite.db` - Server's user and session data
- `client/sqlite.db` - Client's session data

## 🔐 Security Notes

- This is a **test/demo setup** with hardcoded credentials
- Client ID and secret are for testing purposes only
- CORS is configured to allow localhost communication
- In production, use proper security practices
- Debug mode is enabled for better-auth

## 🔄 Reset Databases

If you need to start fresh or troubleshoot database issues:

```bash
# Stop both applications first (Ctrl+C)

# Delete database files
rm server/sqlite.db
rm client/sqlite.db

# Recreate and initialize databases
cd server && touch sqlite.db && npx @better-auth/cli@latest migrate
cd ..
cd client && touch sqlite.db && npx @better-auth/cli@latest migrate

# Restart applications
cd ../server && npm run dev
# In another terminal: cd client && npm run dev
```

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the ports
   lsof -i :3000
   lsof -i :3001
   ```

2. **CORS Errors**
   - Ensure both servers are running
   - Check CORS configuration in `server/next.config.ts`

3. **Database Errors**
   - See the "Reset Databases" section above for complete reset instructions

4. **OAuth Callback Issues**
   - Verify redirect URL matches configuration
   - Check browser console for errors

## 📚 Resources

- [Better Auth Documentation](https://better-auth.com/docs)
- [OIDC Provider Plugin](https://better-auth.com/docs/plugins/oidc-provider)
- [Generic Oauth](https://www.better-auth.com/docs/plugins/generic-oauth)
- [OpenID Connect Specification](https://openid.net/connect/)

## 🤝 Contributing

This is a test repository for Better Auth functionality. Feel free to:
- Report issues with Better Auth OIDC features
- Suggest improvements to the test setup
- Add additional test scenarios

## 📄 License

This project is for testing purposes. Better Auth is licensed under the MIT License.
