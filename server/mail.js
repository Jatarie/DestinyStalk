const nodemailer = require('nodemailer');

function email(title, body) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'matthew.e.j.smyth@gmail.com',
            pass: 'pmjsfrwmkvaxwnkb'
        }
    });
    var mailOptions = {
        from: 'matthew.e.j.smyth@gmail.com',
        to: 'matthew.e.j.smyth@gmail.com',
        subject: title,
        text: body
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

module.exports = email;