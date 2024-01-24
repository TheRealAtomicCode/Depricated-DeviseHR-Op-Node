import nodemailer from 'nodemailer';

export function generateVerificationCode(): string {
  return String(Math.floor(Math.random() * 900000000) + 100000000);
}

export async function sendOperatorRagistration(
  operatorId: number,
  recipient: string,
  firstName: string,
  lastName: string,
  code: string
) {
  let testAccount = await nodemailer.createTestAccount();

  try {
    let transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    let info = await transporter.sendMail({
      from: '"Qader at DeviseHR 👻" <aqbaghi@atomiccode.uk>',
      to: recipient,
      subject: 'DeviseHR Verification Code ✔',
      text: `<b>Dear ${firstName} ${lastName}, Your verification code is: ${code}</b>`,
      html: `
      <b>Dear ${firstName} ${lastName}, Your verification code is: ${code}</b>
      <p>Please follow the link bellow to register your account.</p>
      <a href="http://localhost:5000/registration/register?operatorId=${operatorId}&code=${code}">Register your account</a>
      `,
    });

    console.log('Message sent: %s', info.messageId);
    console.log(
      'Preview URL: %s',
      nodemailer.getTestMessageUrl(info)
    );
  } catch (err) {
    console.error(err);
  }
}

export async function sendUserRagistration(
  userId: number,
  recipient: string,
  firstName: string,
  lastName: string,
  code: string
) {
  let testAccount = await nodemailer.createTestAccount();

  try {
    let transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    let info = await transporter.sendMail({
      from: '"Qader at DeviseHR 👻" <aqbaghi@atomiccode.uk>',
      to: recipient,
      subject: 'DeviseHR Verification Code ✔',
      text: `<b>Dear ${firstName} ${lastName}, Your verification code is: ${code}</b>`,
      html: `
      <b>Dear ${firstName} ${lastName}, Your verification code is: ${code}</b>
      <p>Please follow the link bellow to register your account.</p>
      <a href="http://localhost:5010/registration/register?userId=${userId}&code=${code}">Register your account</a>
      `,
    });

    console.log('Message sent: %s', info.messageId);
    console.log(
      'Preview URL: %s',
      nodemailer.getTestMessageUrl(info)
    );
  } catch (err) {
    console.error(err);
  }
}

export async function sendOperatorForgetPassword(
  operatorId: number,
  recipient: string,
  firstName: string,
  lastName: string,
  code: string
) {
  let testAccount = await nodemailer.createTestAccount();

  try {
    let transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    let info = await transporter.sendMail({
      from: '"Qader at DeviseHR 👻" <aqbaghi@atomiccode.uk>',
      to: recipient,
      subject: 'DeviseHR Verification Code ✔',
      text: `<b>Dear ${firstName} ${lastName}, Your verification code is: ${code}</b>`,
      html: `
      <b>Dear ${firstName} ${lastName}, Your verification code is: ${code}</b>
      <p>Please follow the link bellow to Reset your password.</p>
      <a href="http://localhost:5000/registration/forgotten-password?operatorId=${operatorId}&code=${code}">Reset your password</a>
      `,
    });

    console.log('Message sent: %s', info.messageId);
    console.log(
      'Preview URL: %s',
      nodemailer.getTestMessageUrl(info)
    );
  } catch (err) {
    console.error(err);
  }
}

export async function sendUserForgetPassword(
  userId: number,
  recipient: string,
  firstName: string,
  lastName: string,
  code: string
) {
  let testAccount = await nodemailer.createTestAccount();

  try {
    let transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    let info = await transporter.sendMail({
      from: '"Qader at DeviseHR 👻" <aqbaghi@atomiccode.uk>',
      to: recipient,
      subject: 'DeviseHR Verification Code ✔',
      text: `<b>Dear ${firstName} ${lastName}, Your verification code is: ${code}</b>`,
      html: `
      <b>Dear ${firstName} ${lastName}, Your verification code is: ${code}</b>
      <p>Please follow the link bellow to Reset your password.</p>
      <a href="http://localhost:5010/registration/forgotten-password?userId=${userId}&code=${code}">Reset your password</a>
      `,
    });

    console.log('Message sent: %s', info.messageId);
    console.log(
      'Preview URL: %s',
      nodemailer.getTestMessageUrl(info)
    );
  } catch (err) {
    console.error(err);
  }
}
