import { Router } from "express";
import rateLimit from "express-rate-limit";
import Enquiry from "../models/Enquiry.js";
import { sendEnquiryNotification } from "../services/enquiryMailer.js";

const router = Router();
const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many enquiries from this connection. Please try again later." },
});

const allowedServices = new Set([
  "Custom software development",
  "AI & business automation",
  "Web application development",
  "IT consulting",
  "Something else",
]);

router.post("/", enquiryLimiter, async (req, res, next) => {
  try {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const service = typeof req.body.service === "string" ? req.body.service : "";
    const message = typeof req.body.message === "string" ? req.body.message.trim() : "";

    if (!name || !email || !service || !message) {
      return res.status(400).json({ message: "Please complete all required fields." });
    }
    if (name.length > 100 || email.length > 254 || message.length > 5000) {
      return res.status(400).json({ message: "One or more fields exceed the allowed length." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }
    if (!allowedServices.has(service)) {
      return res.status(400).json({ message: "Please select a valid service." });
    }

    await Enquiry.create({ name, email, service, message });

    try {
      await sendEnquiryNotification({ name, email, service, message });
    } catch (error) {
      console.error("Enquiry saved, but notification email delivery failed:", error.message);
      return res.status(201).json({
        message:
          "Your enquiry was received, but we couldn't notify our team by email. Please contact master.inspiringminds@gmail.com if you need a timely response.",
        notificationSent: false,
      });
    }

    return res.status(201).json({
      message: "Enquiry received successfully.",
      notificationSent: true,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
