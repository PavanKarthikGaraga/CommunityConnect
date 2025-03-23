import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import { User } from '@/config/schema';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { sendNGOVerificationEmail } from '@/lib/email';

// Helper function to create verification token
const createVerificationToken = (userId) => {
  return jwt.sign(
    { userId, purpose: 'email-verification' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const sendVerificationEmail = async (email, name, token) => {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`;
  
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Verify Your NGO Account - CommunityConnect',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h1 style="color: #2d3748; text-align: center;">Welcome to CommunityConnect!</h1>
        <h2 style="color: #4a5568;">Hello ${name},</h2>
        <p style="color: #4a5568; font-size: 16px; line-height: 1.5;">
          Thank you for registering your NGO with CommunityConnect. To complete your registration and start using our platform, please verify your email address.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #4299e1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Verify Email Address
          </a>
        </div>
        <p style="color: #718096; font-size: 14px;">
          This verification link will expire in 24 hours. If you did not create this account, please ignore this email.
        </p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    
    console.log('Attempting to register organization with data:', {
      ...body,
      password: '[REDACTED]'
    });

    // Check if user exists
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    // Prepare organization data
    const organizationData = {
      name: body.organizationName,
      website: body.website,
      verificationStatus: 'Pending',
      type: body.role, // 'NGO' or 'Government'
      department: body.role === 'Government' ? (body.department || 'General') : undefined
    };

    // Prepare user data
    const userData = {
      name: body.organizationName,
      email: body.email,
      password: hashedPassword,
      role: body.role,
      representativeName: body.representativeName,
      status: 'Pending',
      isEmailVerified: false,
      organization: organizationData
    };

    console.log('Creating user with data:', {
      ...userData,
      password: '[REDACTED]'
    });

    // Create new user
    const user = await User.create(userData);

    // Create verification token
    const verificationToken = jwt.sign(
      { userId: user._id, purpose: 'email-verification' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Create session token
    const sessionToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set session cookie
    const cookieStore = cookies();
    cookieStore.set('token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    // Send verification email using the imported function
    await sendNGOVerificationEmail(
      body.organizationName,
      body.email,
      verificationToken,
      body.representativeName
    );

    return NextResponse.json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.'
    });

  } catch (error) {
    console.error('NGO Registration Error:', {
      message: error.message,
      name: error.name,
      code: error.code,
      errors: error.errors
    });
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: messages.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Registration failed. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
} 