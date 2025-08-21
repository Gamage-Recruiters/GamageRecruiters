function setEmailBody(clientName, clientSubject, clientMassage, companyNumber, websiteLink) {

  return `
  <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; 
                line-height: 1.6; color: #333; border: 1px solid #ddd; border-radius: 8px; background: #f9f9f9;">
      
      <h2 style="color: #007bff; text-align: center;">Thank You for Contacting Us!</h2>

      <p><strong>Dear ${clientName},</strong></p>
      <p>We have received your message and will get back to you soon.</p>
      
      <div style="background: #fff; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff;">
        <p><strong>Your Inquiry:</strong></p>
        <p><strong>Subject:</strong> ${clientSubject}</p>
        <p><strong>Message:</strong> ${clientMassage}</p>
      </div>

      <p style="margin-top: 15px;">If it's urgent, feel free to contact us at 
        <a href="tel:${companyNumber}" style="color: #007bff; text-decoration: none; font-weight: bold;">
          ${companyNumber}
        </a>.
      </p>

      <p style="text-align: center; margin-top: 20px;">
        <strong>Gamage Recruiters</strong><br>
        <a href="${websiteLink}" style="color: #007bff; text-decoration: none;">gamagerecruiters.lk</a>
      </p>
    </div>

  `
}

module.exports = setEmailBody;