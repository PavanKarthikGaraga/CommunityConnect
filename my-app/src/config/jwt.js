import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function createToken(user) {
  return await new SignJWT({
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    profileImage: user.profileImage
  })
  .setProtectedHeader({ alg: 'HS256' })
  .setExpirationTime('7d')
  .sign(JWT_SECRET);
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export async function createVerificationToken(email) {
  const token = await jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });
  return token;
}
export async function verifyVerificationToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    console.error('Verification token verification error:', error);
    return null;
  }
}