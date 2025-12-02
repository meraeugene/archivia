import { transporter } from "./transporter";

interface SendAuthorizeUploadOptions {
  to: string;
  studentName: string;
  thesisTitle: string;
  message?: string; // optional note from adviser/admin
}

/**
 * Sends a thesis upload authorization notification email to the student.
 * Clean black & white minimalist design with Archivia branding.
 */
export async function sendAuthorizeUploadEmail({
  to,
  studentName,
  thesisTitle,
  message,
}: SendAuthorizeUploadOptions) {
  const subject = `Upload Authorized - Archivia`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; background-color: #fafafa;">
      
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fafafa; padding: 40px 20px;">
        <tr>
          <td align="center">

            <!-- Email Container -->
            <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e5e5;">
              

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

              <!-- Status Indicator -->
              <tr>
                <td style="padding: 0 40px; padding-top: 40px;">
                  <div style="display: inline-block; background: #000000; border-radius: 6px; padding: 6px 16px;">
                    <span style="color: #ffffff; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                      ✓ Authorized
                    </span>
                  </div>
                </td>
              </tr>

              <!-- Main Content -->
              <tr>
                <td style="padding: 24px 40px 40px 40px;">
                  
                  <!-- Title -->
                  <h2 style="color: #000000; margin: 0 0 24px 0; font-size: 28px; font-weight: 700; line-height: 1.2; letter-spacing: -0.5px;">
                    You are authorized to publish your thesis
                  </h2>

                  <!-- Message -->
                  <p style="color: #171717; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                    Hello ${studentName}, your thesis <strong>"${thesisTitle}"</strong> has been authorized for publication on Archivia.
                  </p>

                  ${
                    message
                      ? `
                  <!-- Optional Message Box -->
                  <div style="background: #fafafa; border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px; margin: 0 0 24px 0;">
                    <p style="color: #000000; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 12px 0;">Message</p>
                    <p style="color: #404040; font-size: 15px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
                  </div>
                  `
                      : ""
                  }

                  <!-- CTA Button -->
                  <div style="text-align: center; margin: 0 0 32px 0;">
                    <a href="https://archivia-official.vercel.app" style="display: inline-block; background: #000000; color: #ffffff; text-decoration: none; padding: 16px 48px; border-radius: 8px; font-weight: 600; font-size: 15px; letter-spacing: 0.3px;">
                      View Your Publication
                    </a>
                  </div>

                  <!-- Divider -->
                  <div style="height: 1px; background: #e5e5e5; margin: 40px 0;"></div>

                  <!-- Support -->
                  <p style="color: #737373; font-size: 14px; line-height: 1.6; margin: 0; text-align: center;">
                    Questions? Contact your adviser or reach out to <a href="mailto:capstone.archivia@gmail.com" style="color: #000000; text-decoration: none; font-weight: 600;">capstone.archivia@gmail.com</a>
                  </p>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background: #fafafa; padding: 32px 40px; text-align: center; border-top: 1px solid #e5e5e5;">
                  <p style="color: #737373; font-size: 13px; line-height: 1.5; margin: 0 0 8px 0;">
                    This is an automated message from Archivia
                  </p>
                  <p style="color: #a3a3a3; font-size: 12px; line-height: 1.5; margin: 0;">
                    © ${new Date().getFullYear()} Archivia. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"Archivia" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`✓ Email sent successfully to ${to}`);
    return { success: true, message: "Email sent successfully." };
  } catch (error) {
    console.error("✗ Failed to send email:", error);
    return { success: false, error: "Failed to send email notification." };
  }
}
