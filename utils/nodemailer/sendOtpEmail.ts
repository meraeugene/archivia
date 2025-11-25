import { transporter } from "./transporter";

export async function sendOtpEmail(otp: string, email: string) {
  const subject = "Reset Your Password - Archivia";

  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${subject}</title>
  </head>
  <body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#fafafa;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;border:1px solid #e5e5e5;">
          
               <!-- Header -->
            <tr>
              <td style="background: #000000; padding: 32px 40px; text-align: center;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
                  <tr>
                  <td>
                    <img 
                      src="https://res.cloudinary.com/dhv8m7hau/image/upload/v1761307366/nborvww6hh8xlbcnhrar.png" 
                      alt="Archivia Logo" 
                      style="display: block; width: auto; height: 48px; max-width: 100%;"
                    />
                  </td>
                  </tr>
                </table>
                <p style="color: #999999; margin: 0; font-size: 13px; letter-spacing: 0.3px;">Digital Thesis Archive</p>
              </td>
            </tr>

          <!-- Tag -->
          <tr>
            <td style="padding:35px;">
              <div style="display:inline-block;background:#fff;border:2px solid #000;border-radius:6px;padding:6px 16px;">
                <span style="color:#000;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Password Reset OTP</span>
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:0 40px 40px 40px;">
              <p style="font-size:16px;margin:0 0 16px 0;">
                You requested to reset your password. Use the OTP below to continue:
              </p>

              <div style="background:#fafafa;border:1px solid #e5e5e5;border-radius:8px;padding:24px;margin-bottom:24px;text-align:center;">
                <p style="font-size:28px;font-weight:bold;letter-spacing:2px;margin:0;">${otp}</p>
              </div>

              <p style="font-size:14px;color:#737373;">
                This OTP is valid for <strong>10 minutes</strong>. If you did not request a password reset, please ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#fafafa;padding:20px;text-align:center;border-top:1px solid #e5e5e5;color:#888;font-size:13px;">
              This is an automated message from Archivia.
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </body>
  </html>
  `;

  try {
    await transporter.sendMail({
      from: `"Archivia" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code - Archivia",
      html,
    });

    return { success: true, message: "OTP sent successfully!" };
  } catch (err) {
    console.error("Failed to send OTP:", err);
    return {
      success: false,
      error: "Failed to send OTP. Please try again later.",
    };
  }
}
