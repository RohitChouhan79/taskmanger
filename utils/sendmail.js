const nodemailer=require("nodemailer")

exports.sendmail=function sendmailhandler(email, user,req, res) {
    const token = Math.floor(1000 + Math.random() * 9000);
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: "rohitbanna101@gmail.com",
        pass: "luav lryv poxu bcht",
      },
    });
    // receiver mailing info
    const mailOptions = {
      from: "Devloper_pvt.limited<rohitbanna101@gmail.com>",
      to: email,
      subject: "Testing Mail Service",
      // text: req.body.message,
      html: `<h1>Your OTP iS ${token} </h1>`,
    };
  
    transport.sendMail(mailOptions, async (err, info) => {
      if (err) return res.send(err);
      // console.log(info);
      user.token = token;
      await user.save();
      res.render("otp", { admin: user, email: user.email });
      // console.log(info);
  
    });
  }

