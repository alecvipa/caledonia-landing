require('dotenv').config();

// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
const nodemailer = require("nodemailer");
const email = process.env.email;
const superSecretPwd = process.env.superSecretPwd;
const tokenFb = process.env.tokenAccesoFB

// Create an instance of the express app.
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static("public"));

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
var PORT = process.env.PORT || 3000;

// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Redirect to https://xyncs.com
const targetBaseUrl = 'https://www.dfelitecoach.com/home';


// Routes
app.get('/', function (req, res) {
    res.redirect(targetBaseUrl);
    // res.render('home');

});

// Routes
app.get('/home', function (req, res) {
    // res.redirect(targetBaseUrl);
    res.render('home');

});

// Routes
app.get('/', function (req, res) {
    // res.redirect(targetBaseUrl);
    res.render('home');

});
app.get('/privacy-policy', function (req, res) {
    // res.redirect(targetBaseUrl);
    res.render('privacy-policy');

});
app.get('/terms', function (req, res) {
    // res.redirect(targetBaseUrl);
    res.render('terms');

});
// app.get('/inicio', function (req, res) {
//     // res.redirect(targetBaseUrl);
//     res.render('inicio');


// app.get('/:params?', function (req, res) {
//     var params = req.params.params;
//     res.render(params);
// })

// Nodemailer route — DF Elite Coach (Video Gate)
app.post("/api/video-lead", function (request, response) {
    const name = (request.body.name || "").trim();
    const userEmail = (request.body.email || "").trim();
    const phone = (request.body.phone || "").trim();

    if (!name || !userEmail || !phone) {
        return response.status(400).json({ ok: false, message: "Nom, e-mail et téléphone requis." });
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        secure: false,
        port: 25,
        auth: {
            user: email,
            pass: superSecretPwd
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const htmlBody = `
        <div style="font-family: Arial, sans-serif; color: #111111; line-height: 1.6;">
            <h2 style="margin-bottom: 12px;">Nouveau prospect — Présentation vidéo DF Elite Coach</h2>
            <p><strong>Nom :</strong> ${name}</p>
            <p><strong>E-mail :</strong> <a href="mailto:${userEmail}">${userEmail}</a></p>
            <p><strong>Téléphone :</strong> <a href="tel:${phone}">${phone}</a></p>
            <p style="color: #666666; font-size: 13px; margin-top: 16px;">
                Ce contact a renseigné ses coordonnées pour accéder à la vidéo de présentation sur le site DF Elite Coach.
            </p>
        </div>
    `;

    const mail = {
        from: `"DF Elite Coach" <${email}>`,
        to: "dimitri@dfelitecoach.com",
        replyTo: userEmail,
        subject: `Nouveau prospect vidéo — ${name}`,
        html: htmlBody
    };

    transporter.sendMail(mail, function (err, info) {
        if (err) {
            console.log(err);
            return response.status(500).json({ ok: false, message: "Erreur lors de l'envoi." });
        } else {
            console.log("DF Elite Coach video lead sent!");
            return response.status(200).json({ ok: true });
        }
    });
});



// Start our server so that it can begin listening to client requests.
app.listen(PORT, function () {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
});