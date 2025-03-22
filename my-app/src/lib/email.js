import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false // Only use this in development
  }
});

// Verify transporter connection
transporter.verify(function(error, success) {
  if (error) {
    console.log('SMTP Error:', error);
  } else {
    console.log('SMTP Server is ready to take our messages');
  }
});

export async function sendResetPasswordEmail(email, resetToken) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Reset Your Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Reset Your Password</h2>
        <p>You requested to reset your password. Click the button below to set a new password:</p>
        <a href="${resetUrl}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendWelcomeEmail(name, email) {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Welcome to CommunityConnect! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4F46E5; margin: 0; font-size: 28px;">Welcome to CommunityConnect!</h1>
          <p style="color: #6B7280; font-size: 16px; margin-top: 10px;">Where passion meets purpose</p>
        </div>

        <div style="background: white; border-radius: 10px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #111827; margin-top: 0;">Dear ${name},</h2>
          
          <p style="color: #4B5563; line-height: 1.6; margin-bottom: 20px;">
            We're thrilled to welcome you to the CommunityConnect family! 🎉 Your decision to join us marks the beginning of an inspiring journey where you'll make a real difference in your community.
          </p>

          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #4F46E5; margin-top: 0;">What's Next?</h3>
            <ul style="color: #4B5563; padding-left: 20px; margin: 15px 0;">
              <li style="margin-bottom: 10px;">Complete your profile to showcase your skills and interests</li>
              <li style="margin-bottom: 10px;">Browse available projects that match your passions</li>
              <li style="margin-bottom: 10px;">Connect with other volunteers and organizations</li>
              <li style="margin-bottom: 0;">Start making an impact in your community!</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
               style="background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Get Started
            </a>
          </div>

          <p style="color: #4B5563; line-height: 1.6;">
            If you have any questions or need assistance, our support team is always here to help. Just reply to this email!
          </p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
            <p style="color: #4B5563; margin-bottom: 10px;">Best regards,</p>
            <p style="color: #111827; font-weight: bold; margin-top: 0;">The CommunityConnect Team</p>
          </div>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <div style="margin-bottom: 20px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="color: #4F46E5; text-decoration: none; margin: 0 10px;">Dashboard</a>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/projects" style="color: #4F46E5; text-decoration: none; margin: 0 10px;">Projects</a>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/help" style="color: #4F46E5; text-decoration: none; margin: 0 10px;">Help Center</a>
          </div>
          <p style="color: #6B7280; font-size: 12px;">
            © ${new Date().getFullYear()} CommunityConnect. All rights reserved.
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}