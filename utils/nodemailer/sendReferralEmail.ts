import { transporter } from "../transporter";

interface SendReferralEmailOptions {
  toAdviser: string;
  toStudent: string;
  studentName: string;
  thesisTitle: string;
  thesisAbstract: string;
  referredBy: string;
  refferedTo: string;
}

export async function sendReferralEmail({
  toAdviser,
  toStudent,
  studentName,
  thesisTitle,
  thesisAbstract,
  referredBy,
  refferedTo,
}: SendReferralEmailOptions) {
  const subject = `Thesis Request Referral - Archivia`;

  // helper function to generate customized HTML
  const generateEmailHTML = (isForAdviser: boolean) => {
    const heading = isForAdviser
      ? "A thesis request has been referred to you"
      : "Your thesis request has been referred to another adviser";

    const message = isForAdviser
      ? `<strong>${studentName}</strong>’s thesis request was referred to you by <strong>${referredBy}</strong>.`
      : `Your thesis request has been referred by <strong>${referredBy}</strong> to ${refferedTo} for further review.`;

    const buttonText = isForAdviser
      ? "View Referral in Archivia"
      : "View Your Request in Archivia";

    const buttonLink = isForAdviser
      ? "https://archivia-official.vercel.app/advisory-requests"
      : "https://archivia-official.vercel.app/my-requests";

    // const buttonLink = isForAdviser
    //   ? "http://localhost:3000/advisory-requests"
    //   : "http://localhost:3000/my-requests";

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${subject}</title>
    </head>
    <body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',Arial,sans-serif;background-color:#fafafa;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fafafa;padding:40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;border:1px solid #e5e5e5;">
              <tr>
                <td style="background:#000000;padding:32px 40px;text-align:center;">
                  <img src="https://res.cloudinary.com/dhv8m7hau/image/upload/v1761307366/nborvww6hh8xlbcnhrar.png" alt="Archivia Logo" style="display:block;width:auto;height:48px;max-width:100%;" />
                  <p style="color:#999999;margin:0;font-size:13px;letter-spacing:0.3px;">Digital Thesis Archive</p>
                </td>
              </tr>

              <tr>
                <td style="padding:35px;">
                  <div style="display:inline-block;background:#ffffff;border:2px solid #000000;border-radius:6px;padding:6px 16px;">
                    <span style="color:#000000;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Referral Notice</span>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding:0 40px 40px 40px;">
                  <h2 style="color:#000000;margin:0 0 24px 0;font-size:26px;font-weight:700;line-height:1.2;">${heading}</h2>
                  <p style="color:#171717;font-size:16px;line-height:1.6;margin:0 0 24px 0;">${message}</p>

                  <div style="background:#fafafa;border:1px solid #e5e5e5;border-radius:8px;padding:24px;margin-bottom:24px;">
                    <p style="color:#000000;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 12px 0;">Research Topic</p>
                    <p style="color:#404040;font-size:15px;line-height:1.6;margin:0 0 20px 0;">${thesisTitle}</p>

                    <p style="color:#000000;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 12px 0;">Research Overview</p>
                    <p style="color:#404040;font-size:15px;line-height:1.6;margin:0;white-space:pre-wrap;">${thesisAbstract}</p>
                  </div>

                  <div style="text-align:center;margin:0 0 32px 0;">
                    <a href="${buttonLink}" style="display:inline-block;background:#000000;color:#ffffff;text-decoration:none;padding:16px 48px;border-radius:8px;font-weight:600;font-size:15px;letter-spacing:0.3px;">
                      ${buttonText}
                    </a>
                  </div>

                  <div style="height:1px;background:#e5e5e5;margin:40px 0;"></div>

                  <p style="color:#737373;font-size:14px;line-height:1.6;margin:0;">
                    Questions? Contact <a href="mailto:archivia.capstone@gmail.com" style="color:#000000;text-decoration:none;font-weight:600;">archivia.capstone@gmail.com</a>
                  </p>
                </td>
              </tr>

              <tr>
                <td style="background:#fafafa;padding:32px 40px;text-align:center;border-top:1px solid #e5e5e5;">
                  <p style="color:#737373;font-size:13px;line-height:1.5;margin:0 0 8px 0;">This is an automated message from Archivia</p>
                  <p style="color:#a3a3a3;font-size:12px;line-height:1.5;margin:0;">© ${new Date().getFullYear()} Archivia. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>`;
  };

  try {
    await Promise.all([
      transporter.sendMail({
        from: `"Archivia" <${process.env.EMAIL_USER}>`,
        to: toAdviser,
        subject,
        html: generateEmailHTML(true),
      }),
      transporter.sendMail({
        from: `"Archivia" <${process.env.EMAIL_USER}>`,
        to: toStudent,
        subject: `Your thesis request has been referred - Archivia`,
        html: generateEmailHTML(false),
      }),
    ]);

    console.log(
      `✓ Referral emails sent successfully to ${toAdviser} and ${toStudent}`
    );
    return { success: true, message: "Referral emails sent successfully." };
  } catch (error) {
    console.error("✗ Failed to send referral emails:", error);
    return { success: false, error: "Failed to send referral notifications." };
  }
}
