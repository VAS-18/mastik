import nodemailer, { Transporter } from 'nodemailer';

const transporter : Transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: Number(process.env.SMTP_PORT),
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
})

export default transporter;