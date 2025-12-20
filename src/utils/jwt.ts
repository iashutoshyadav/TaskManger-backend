import jwt, { JwtPayload as DefaultJwtPayload } from "jsonwebtoken";
import { env } from "../config/env";

export interface JwtPayload extends DefaultJwtPayload {
    userId: string;
}
export const signToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, env.jwtSecret, {
        expiresIn: "7d",
        algorithm: "HS256",
    });
};
export const verifyToken = (token: string): JwtPayload => {
    try {
        return jwt.verify(token, env.jwtSecret) as JwtPayload;
    } catch {
        throw new Error("Invalid or expired token");
    }
};
