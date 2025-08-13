import {validateToken} from "@/lib/jwt";
import {NextResponse} from "next/server";


export async function GET(request: Request) {
    const authorization = request.headers.get("Authorization");
    const jwt = authorization?.split(" ")[1]; // Extract the token from the Authorization header

    if (!jwt) {
        return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const decoded = validateToken(jwt);

    return NextResponse.json(decoded);
}