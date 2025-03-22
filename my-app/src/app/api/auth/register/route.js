import { connect, disconnect } from "@/lib/db"; // Adjust path as needed
import bcrypt from "bcryptjs";
import { User } from "@/models/User";

export async function POST(request) {
  try {
    const { Username, Password } = await request.json();

    await connect(); 
    const existingUser = await User.findOne({ Username });

    if (existingUser) {
      return Response.json({ error: "Username already exists" }, { status: 400 });
    }

    const hashPassword = await bcrypt.hash(Password, 10);

    const newUser = new User({
      Username,
      Password: hashPassword,
      role: "user", 
    });

    await newUser.save(); 

    return Response.json({ message: "User Successfully Registered" }, { status: 200 });

  } catch (err) {
    console.error(err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });

  } finally {
    await disconnect(); 
  }
}
