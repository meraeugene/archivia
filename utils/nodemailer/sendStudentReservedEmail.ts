import { transporter } from "../transporter";

interface SendStudentReturnedEmailOptions {
  to: string;
  adviserName: string;
  thesisTitle: string;
  thesisAbstract: string;
}

export async function sendStudentReservedEmail({
  to,
  adviserName,
  thesisTitle,
  thesisAbstract,
}: SendStudentReturnedEmailOptions) {
  const subject = "Thesis Request Reserved - Archivia";

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
              <td style="padding: 35px;">
                <div style="display: inline-block; background: #ffffff; border: 2px solid #000000; border-radius: 6px; padding: 6px 16px;">
                  <span style="color: #000000; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Request Reserved</span>
                </div>
              </td>
            </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 0 40px 40px 40px;">
              <p style="font-size:16px;margin:0 0 16px 0;">
               Your request has been marked as reserved. Please wait for further announcements from <strong>${adviserName}</strong>. A possible referral may be made upon the completion of the deliberation process.
              </p>

               <div style="background: #fafafa; border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                  <p style="color: #000000; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 12px 0;">Research Topic</p>
                  <p style="color: #404040; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">${thesisTitle}</p>

                  <p style="color: #000000; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 12px 0;">Research Overview</p>
                  <p style="color: #404040; font-size: 15px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${thesisAbstract}</p>
            </div>


              <div style="text-align:center;">
                <a href="https://archivia-official.vercel.app/my-requests" style="display:inline-block;background:#000;color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;font-weight:600;font-size:15px;">
                  View Request
                </a>
              </div>
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
  </html>`;

  try {
    await transporter.sendMail({
      from: `"Archivia" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`✓ Return email sent successfully to ${to}`);
    return { success: true };
  } catch (error) {
    console.error("✗ Failed to send return email:", error);
    return { success: false, error: "Failed to send return email." };
  }
}
