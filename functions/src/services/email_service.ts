import * as nodemailer from "nodemailer";

const gmailAppPassword = "ztziqzrucdhztbrf";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "tauqeer123khattak@gmail.com",
    pass: gmailAppPassword,
  },
});

export async function sendEmail(errorMessage: string): Promise<boolean> {
  try {
    const info = await transporter.sendMail({
      from: "tauqeer123khattak@gmail.com",
      to: "tauqeer745@outlook.com, sagheerrajper619@gmail.com",
      subject: "Cron job failure",
      text: "Following error was thrown: \n\n" + errorMessage,
    });
    console.log("Message sent: ", info);
    return true;
  } catch (e) {
    console.log("Could not send message: ", e);
    return false;
  }
}
