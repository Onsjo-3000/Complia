import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: parseInt(process.env.SMTP_PORT || "587"),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface MatchDigestItem {
  lawTitle: string;
  lawDesignation: string;
  clientName: string;
  recommendation: string;
  matchReason: string;
}

export async function sendMatchDigest(
  to: string,
  firmName: string,
  matches: MatchDigestItem[]
) {
  if (!process.env.SMTP_USER) {
    console.log("[EMAIL] Ingen SMTP konfigurerad. E-post loggas till konsol:");
    console.log(`[EMAIL] Till: ${to}`);
    console.log(`[EMAIL] Ämne: Nya lagmatchningar för ${firmName}`);
    console.log(`[EMAIL] Matchningar:`, matches);
    return;
  }

  const matchRows = matches
    .map(
      (m) => `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${m.lawDesignation}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${m.lawTitle}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${m.clientName}</td>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>${m.recommendation}</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${m.matchReason}</td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="font-family: sans-serif; max-width: 800px; margin: 0 auto;">
      <h2 style="color: #1e40af;">Complia - Nya matchningar</h2>
      <p>Hej ${firmName},</p>
      <p>Vi har hittat <strong>${matches.length}</strong> nya matchningar mellan nyligen publicerade lagar och era kunder:</p>
      <table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
        <thead>
          <tr style="background: #1e40af; color: white;">
            <th style="padding: 8px; text-align: left;">Beteckning</th>
            <th style="padding: 8px; text-align: left;">Lag</th>
            <th style="padding: 8px; text-align: left;">Kund</th>
            <th style="padding: 8px; text-align: left;">Rekommendation</th>
            <th style="padding: 8px; text-align: left;">Orsak</th>
          </tr>
        </thead>
        <tbody>
          ${matchRows}
        </tbody>
      </table>
      <p>Logga in på <a href="${process.env.NEXTAUTH_URL}">Complia</a> för att hantera matchningarna.</p>
      <p style="color: #666; font-size: 12px;">Detta är ett automatiskt meddelande från Complia.</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || "noreply@complia.se",
    to,
    subject: `Complia: ${matches.length} nya matchningar`,
    html,
  });
}
