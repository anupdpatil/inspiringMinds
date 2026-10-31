import nodemailer from "nodemailer";

const notificationRecipient =
  process.env.ENQUIRY_NOTIFICATION_TO || "master.inspiringminds@gmail.com";

export async function sendEnquiryNotification({ name, email, service, message }) {
  const { SMTP_USER: user, SMTP_PASS: pass } = process.env;
  if (!user || !pass) {
    throw new Error("SMTP_USER and SMTP_PASS must be configured to send enquiry notifications.");
  }

  const port = Number(process.env.SMTP_PORT || 465);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("SMTP_PORT must be a valid port number.");
  }

  const secureValue = process.env.SMTP_SECURE?.toLowerCase();
  if (secureValue && secureValue !== "true" && secureValue !== "false") {
    throw new Error("SMTP_SECURE must be set to true or false.");
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure: secureValue ? secureValue === "true" : port === 465,
    auth: { user, pass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });

  await transporter.sendMail({
    from: { name: "Inspiring Minds Website", address: user },
    to: notificationRecipient,
    replyTo: email,
    subject: "New website enquiry",
    text: [
      "A new enquiry was submitted through the Inspiring Minds website.",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Service: ${service}`,
      "",
      "Message:",
      message,
    ].join("\n"),
  });
}
