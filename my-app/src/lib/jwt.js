import { SignJWT, jwtVerify, decodeJwt } from "jose";

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

if (!ACCESS_TOKEN || !REFRESH_TOKEN) {
  throw new Error("Access token or refresh token not found");
}

const encodeSecret = (secret) => new TextEncoder().encode(secret);

export const generateAccessToken = async (payload) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("15s")
    .sign(encodeSecret(ACCESS_TOKEN));
};

export const generateRefreshToken = async (payload) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("45s")
    .sign(encodeSecret(REFRESH_TOKEN));
};

export const verifyAccessToken = async (token, isMiddleware = false) => {
  if (isMiddleware) return decodeJwt(token);
  try {
    const { payload } = await jwtVerify(token, encodeSecret(ACCESS_TOKEN));
    return payload;
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = async (token) => {
  try {
    const { payload } = await jwtVerify(token, encodeSecret(REFRESH_TOKEN));
    return payload;
  } catch (error) {
    return null;
  }
};

export const generateAuthTokens = async (payload) => {
  console.log("ACCESS_TOKEN", ACCESS_TOKEN);
  console.log("REFRESH_TOKEN", REFRESH_TOKEN);
  
  
  return {
    accessToken,
    refreshToken
  };
};
