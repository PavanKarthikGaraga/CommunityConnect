import { SignJWT, jwtVerify, decodeJwt } from "jose";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN;

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error("Access token or refresh token not found");
}

const encodeSecret = (secret) => new TextEncoder().encode(secret);

export const generateAccessToken = async (payload) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("15s")
    .sign(encodeSecret(ACCESS_TOKEN_SECRET));
};

export const generateRefreshToken = async (payload) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("45s")
    .sign(encodeSecret(REFRESH_TOKEN_SECRET));
};

export const verifyAccessToken = async (token, isMiddleware = false) => {
  if (isMiddleware) return decodeJwt(token);
  return jwtVerify(token, encodeSecret(ACCESS_TOKEN_SECRET));
};

export const verifyRefreshToken = async (token) => {
  return jwtVerify(token, encodeSecret(REFRESH_TOKEN_SECRET));
};

export const generateAuthTokens = async (payload) => {
  return {
    accessToken: await generateAccessToken(payload),
    refreshToken: await generateRefreshToken(payload),
  };
};
