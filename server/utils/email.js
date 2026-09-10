// import dotenv from 'dotenv'
// dotent.config();
// import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//          user: process.env.EMAIL_USER,
//          pass: process.env.EMAIL_PASS
//     }
// });

// export const sendOtpEmail = async(email,otp.type )=>{
//     try {
//         const mailOption ={
//         from:  process.env.EMAIL_USER,
//         to: email,
//         subject: 'Your OTP Code',
//         text: `Your OTP Code is:${otp}` 
//     };
//     await transporter.sendMail(mailOptions);
//     console.log(`OTP email sent to ${email} for ${type}`);
//     } catch (error) {
//         console.log(`Errot sending OTP email to ${email} for ${type}:`,error);
//     }
// };


import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

// Optional: verify SMTP connection when the server starts
transporter.verify((error) => {
  if (error) {
    console.error("❌ Email transporter error:", error.message);
  } else {
    console.log("✅ Email transporter is ready");
  }
});

export const sendBookingEmail = async ({
  email,
  name,
  bookingId,
  eventName,
  eventDate,
  eventTime,
  location,
  quantity = 1,
}) => {
  try {
    const mailOptions = {
      from: `"Your App" <${EMAIL_USER}>`,
      to: email,
      subject: `Booking Confirmed - ${eventName}`,

      text: `
Hello ${name || "there"},

Your booking has been confirmed!

Event: ${eventName}
Date: ${eventDate}
Time: ${eventTime}
Location: ${location}
Tickets: ${quantity}
Booking ID: ${bookingId}

Thank you for booking with us.
      `.trim(),

      html: 
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
            <title>Booking Confirmation</title>
          </head>

          <body style="
            margin:0;
            padding:0;
            background:#f4f6f8;
            font-family:Arial,sans-serif;
          ">
            <div style="
              max-width:520px;
              margin:40px auto;
              background:#ffffff;
              border-radius:12px;
              padding:30px;
              box-shadow:0 4px 15px rgba(0,0,0,0.08);
            ">

              <h2 style="
                margin-top:0;
                color:#222;
                text-align:center;
              ">
                🎉 Booking Confirmed
              </h2>

              <p style="
                color:#555;
                font-size:16px;
                line-height:1.6;
              ">
                Hello ${name || "there"},
              </p>

              <p style="
                color:#555;
                font-size:16px;
                line-height:1.6;
              ">
                Your booking has been successfully confirmed.
              </p>

              <div style="
                margin:25px 0;
                padding:20px;
                background:#f8f9fa;
                border-radius:8px;
              ">
                <p style="margin:8px 0;color:#555;">
                  <strong>Event:</strong> ${eventName}
                </p>

                <p style="margin:8px 0;color:#555;">
                  <strong>Date:</strong> ${eventDate}
                </p>

                <p style="margin:8px 0;color:#555;">
                  <strong>Time:</strong> ${eventTime}
                </p>

                <p style="margin:8px 0;color:#555;">
                  <strong>Location:</strong> ${location}
                </p>

                <p style="margin:8px 0;color:#555;">
                  <strong>Tickets:</strong> ${quantity}
                </p>
              </div>

              <div style="
                margin:25px 0;
                padding:15px;
                background:#f1f3f5;
                border-radius:8px;
                text-align:center;
              ">
                <p style="
                  margin:0 0 8px;
                  color:#777;
                  font-size:13px;
                ">
                  Booking ID
                </p>

                <strong style="
                  font-size:18px;
                  color:#111;
                ">
                  ${bookingId}
                </strong>
              </div>

              <p style="
                color:#777;
                font-size:14px;
                line-height:1.5;
              ">
                Please keep this email for your records.
              </p>

              <p style="
                color:#999;
                font-size:12px;
                text-align:center;
                margin-top:30px;
              ">
                Thank you for booking with us!
              </p>

            </div>
          </body>
        </html>
      ,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(
      `✅ Booking confirmation email sent to ${email}`
    );

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error(
      `❌ Error sending booking confirmation email to ${email}:`,
      error.message
    );

    return {
      success: false,
      error: error.message,
    };
  }
};







export const sendOtpEmail = async (email, otp, type = "verification") => {
  try {
    const mailOptions = {
      from: `"Your App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your ${type} OTP Code`,
      text: `Your OTP code is ${otp}. It will expire soon. Do not share this code with anyone.`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Your OTP Code</title>
          </head>

          <body style="
            margin: 0;
            padding: 0;
            background-color: #f4f6f8;
            font-family: Arial, sans-serif;
          ">
            <div style="
              max-width: 500px;
              margin: 40px auto;
              background: #ffffff;
              border-radius: 12px;
              padding: 30px;
              box-shadow: 0 4px 15px rgba(0,0,0,0.08);
            ">

              <h2 style="
                margin-top: 0;
                color: #222;
                text-align: center;
              ">
                Your OTP Code
              </h2>

              <p style="
                color: #555;
                font-size: 16px;
                line-height: 1.6;
              ">
                Hello,
              </p>

              <p style="
                color: #555;
                font-size: 16px;
                line-height: 1.6;
              ">
                Use the following OTP to complete your
                <strong>${type}</strong>:
              </p>

              <div style="
                margin: 25px 0;
                padding: 18px;
                background: #f1f3f5;
                border-radius: 8px;
                text-align: center;
              ">
                <span style="
                  font-size: 32px;
                  font-weight: bold;
                  letter-spacing: 8px;
                  color: #111;
                ">
                  ${otp}
                </span>
              </div>

              <p style="
                color: #777;
                font-size: 14px;
                line-height: 1.5;
              ">
                This OTP is valid for a limited time. For your security,
                never share this code with anyone.
              </p>

              <p style="
                color: #999;
                font-size: 12px;
                text-align: center;
                margin-top: 30px;
              ">
                If you didn't request this code, you can safely ignore
                this email.
              </p>

            </div>
          </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`✅ ${type} OTP email sent to ${email}`);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error(
      `❌ Error sending ${type} OTP email to ${email}:`,
      error.message
    );

    return {
      success: false,
      error: error.message,
    };
  }
};







