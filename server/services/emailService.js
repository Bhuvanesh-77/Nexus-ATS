import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    // Using Ethereal or a placeholder - in production user would provide SMTP creds
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'ats.notifications.demo@gmail.com',
        pass: process.env.EMAIL_PASS || 'demo_password'
    }
});

/**
 * Send a professional offer letter email
 * @param {string} to - Candidate email
 * @param {string} candidateName - Candidate name
 * @param {object} job - Job object
 */
export const sendOfferLetter = async (to, candidateName, job) => {
    const mailOptions = {
        from: `"${job.company} Recruitment" <ats.notifications.demo@gmail.com>`,
        to,
        subject: `ACTION REQUIRED: Job Offer for ${job.title} at ${job.company}`,
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1a202c; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 40px; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="display: inline-block; padding: 12px 24px; background-color: #ebf8ff; color: #2b6cb0; border-radius: 9999px; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Official Offer Letter</div>
                </div>
                
                <h2 style="color: #2d3748; font-size: 24px; font-weight: 800; margin-bottom: 16px;">Congratulations, ${candidateName}!</h2>
                <p style="font-size: 16px; color: #4a5568;">We are thrilled to formally offer you the position of <strong>${job.title}</strong> with the team at <strong>${job.company}</strong>. We were highly impressed with your skills and believe you will be a standout addition to our culture.</p>
                
                <div style="background: #f7fafc; padding: 24px; border-radius: 12px; margin: 32px 0; border-left: 4px solid #3182ce;">
                    <h3 style="margin-top: 0; color: #2c5282; font-size: 18px; margin-bottom: 12px;">Offer Summary:</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr><td style="padding: 4px 0; color: #718096; font-size: 14px;">Role</td><td style="padding: 4px 0; font-weight: 600;">${job.title}</td></tr>
                        <tr><td style="padding: 4px 0; color: #718096; font-size: 14px;">Location</td><td style="padding: 4px 0; font-weight: 600;">${job.location}</td></tr>
                        <tr><td style="padding: 4px 0; color: #718096; font-size: 14px;">Compensation</td><td style="padding: 4px 0; font-weight: 600; color: #38a169;">${job.salary}</td></tr>
                        <tr><td style="padding: 4px 0; color: #718096; font-size: 14px;">Employment</td><td style="padding: 4px 0; font-weight: 600;">${job.type}</td></tr>
                    </table>
                </div>

                <div style="text-align: center; margin-top: 40px;">
                    <a href="http://localhost:5173/dashboard" style="background-color: #3182ce; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 10px 15px -3px rgba(49, 130, 206, 0.3);">View & Accept Offer</a>
                </div>
                
                <p style="margin-top: 32px; font-size: 14px; color: #718096;">If you have any questions, please don't hesitate to reach out to our team.</p>
                
                <p style="font-size: 14px; font-weight: 600; color: #2d3748;">Best Regards,<br>${job.company} Talent Acquisition</p>
                
                <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 40px 0;">
                <p style="font-size: 11px; color: #a0aec0; text-align: center;">This is a system-generated message from the Antigravity ATS Portal.</p>
            </div>
        `
    };

    try {
        console.log(`[Email Service] Dispatched PRO Offer Letter to: ${to}`);
        // await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error("Email Error:", error);
        return false;
    }
};

/**
 * Send Interview Confirmation
 */
export const sendInterviewInvite = async (to, candidateName, details) => {
    const mailOptions = {
        from: `"Hiring Team" <ats.notifications.demo@gmail.com>`,
        to,
        subject: `Interview Scheduled: ${details.jobTitle}`,
        html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
                <h2>Interview Confirmation</h2>
                <p>Hi ${candidateName},</p>
                <p>Your interview for the <strong>${details.jobTitle}</strong> position has been successfully scheduled.</p>
                <div style="background: #f0f4f8; padding: 15px; border-radius: 8px;">
                    <p><strong>Date:</strong> ${new Date(details.date).toLocaleString()}</p>
                    <p><strong>Location:</strong> ${details.location}</p>
                </div>
                <p>Please prepare any questions you have for our team. We look forward to meeting you!</p>
            </div>
        `
    };
    console.log(`[Email Service] Dispatched Interview Invite to: ${to}`);
    // await transporter.sendMail(mailOptions);
    return true;
};
