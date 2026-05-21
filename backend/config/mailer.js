const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
   },
})

const sendApprovalMail = async ({ toEmail, toName, opportunityTitle, postedByName }) => {

   const mailOptions = {
      from: `"Oppurtunities" <${process.env.MAIL_USER}>`,
      to: toEmail,
      subject: `You have been accepted for "${opportunityTitle}"`,
      html: `
         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="color: #2563eb; margin-bottom: 8px;">Congratulations, ${toName}! 🎉</h2>
            <p style="color: #374151; font-size: 16px;">
               You have been <strong style="color: #16a34a;">accepted</strong> for the opportunity:
            </p>
            <div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 14px 18px; border-radius: 8px; margin: 20px 0;">
               <strong style="font-size: 17px; color: #111827;">${opportunityTitle}</strong>
               <p style="margin: 6px 0 0; color: #6b7280; font-size: 14px;">Posted by ${postedByName}</p>
            </div>
            <p style="color: #6b7280; font-size: 14px;">
               The poster will contact you soon with further details. Keep an eye on your inbox.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <p style="color: #9ca3af; font-size: 12px;">This is an automated message from Oppurtunities — Amrita Coimbatore.</p>
         </div>
      `,
   }

   await transporter.sendMail(mailOptions)
}

const sendApplicationMail = async ({ toEmail, toName, applicantName, applicantEmail, opportunityTitle }) => {

   const mailOptions = {
      from: `"Oppurtunities" <${process.env.MAIL_USER}>`,
      to: toEmail,
      subject: `New application received for "${opportunityTitle}"`,
      html: `
         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="color: #2563eb; margin-bottom: 8px;">New Application Received 📬</h2>
            <p style="color: #374151; font-size: 16px;">
               Hi <strong>${toName}</strong>, someone has applied to your opportunity:
            </p>
            <div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 14px 18px; border-radius: 8px; margin: 20px 0;">
               <strong style="font-size: 17px; color: #111827;">${opportunityTitle}</strong>
            </div>
            <p style="color: #374151; font-size: 15px; margin-bottom: 6px;">
               <strong>Applicant:</strong> ${applicantName}
            </p>
            <p style="color: #374151; font-size: 15px; margin-bottom: 24px;">
               <strong>Email:</strong> ${applicantEmail}
            </p>
            <p style="color: #6b7280; font-size: 14px;">
               Log in to the Opportunities portal to review and respond to this application.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <p style="color: #9ca3af; font-size: 12px;">This is an automated message from Oppurtunities — Amrita Coimbatore.</p>
         </div>
      `,
   }

   await transporter.sendMail(mailOptions)
}

module.exports = { sendApprovalMail, sendApplicationMail }
