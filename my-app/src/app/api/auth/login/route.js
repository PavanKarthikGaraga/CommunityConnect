<<<<<<< HEAD
import { connect, disconnect } from "../../../../lib/db";
import bcrypt from "bcryptjs";
import { generateAuthTokens } from "../../../../lib/jwt";
import { cookies } from "next/headers";
import mongoose from "mongoose";
=======
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/config/db';
import { User } from '@/config/schema';
import { createToken } from '@/config/jwt';
import { cookies } from 'next/headers';
>>>>>>> refs/heads/main

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

<<<<<<< HEAD
        await connect();
        const db = mongoose.connection.db; // Correctly access the raw MongoDB connection
        const collection = db.collection("users");

        const existingUser = await collection.findOne({ Username });

        if (!existingUser) {
            return Response.json({ error: "Username does not exist" }, { status: 400 });
        }
        
        const isPasswordValid = await bcrypt.compare(Password, existingUser.Password);
        console.log("isPasswordValid",isPasswordValid);
        if (!isPasswordValid) {
            return Response.json({ error: "Invalid Password" }, { status: 400 });
        }

        console.log("Username",Username,"Password",Password,"role", existingUser.role,"existingUser",existingUser);

        const { accessToken, refreshToken } = await generateAuthTokens({ 
            username: Username,
            role: existingUser.role || "user"
        });
        
        console.log("accessToken",accessToken);
        console.log("refreshToken",refreshToken);
        
        // Get cookies instance (no need for `await`)
        const cookieStore =await cookies();
        
        // Set access token cookie
        await cookieStore.set("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 // 15 seconds
        });

        // Set refresh token cookie
        await cookieStore.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 45 // 45 seconds
        });

        return Response.json({
            message: "User Successfully Logged In",
            user: {
                username: Username,
                id: existingUser._id.toString(),
                role: existingUser.role || "user"
            }
        }, { status: 200 });
        
    } catch (err) {
        console.error(err);
        return Response.json({ error: err.message }, { status: 500 });
    } finally {
        await disconnect();
    }
}
=======
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create token
    const token = await createToken({
      id: user._id,
      email: user.email,
      role: user.role
    });

    // Get cookies instance once
    const cookieStore = cookies();
    
    // Set cookie
    await cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
>>>>>>> refs/heads/main
