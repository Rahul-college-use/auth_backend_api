export function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getOtpHtml(otp) {
    return `
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <h1 style="color: #333;">Your OTP Code</h1>
        <p style="font-size: 18px; color: #555;">Use the following OTP to complete your action:</p>
        <div style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #fff; font-size: 24px; border-radius: 5px; margin-top: 20px;">
            ${otp}
        </div>
        <p style="font-size: 14px; color: #999; margin-top: 20px;">This OTP is valid for 10 minutes.</p>
    </div>
    `;
}

