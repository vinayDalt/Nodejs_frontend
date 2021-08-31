//creating server
const express = require('express');

//----------for Cirrus hosting----------------
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
// const PORT = process.env.PORT || 4200;
const app = express();

app.use(morgan(':remote-addr :remote-user :method :url :status :res[content-length] bytes -- :response-time ms'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, 'public')));

// app.get('*', (_, res) => res.redirect('/'));

// app.listen(PORT, () => console.log('Server Started on Port:' + PORT));

//----------for W3 SSO-----------
var session = require('express-session');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var fs = require('fs');

//for lodash(_) function
var _ = require('lodash');


// read settings.js
var settings = require('./settings.js');

app.use(cookieParser());
app.use(session({ resave: 'true', saveUninitialized: 'true', secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

//for Admin role, getting the Bluegroup list of user
passport.serializeUser(function(user, done) {
    
    //Get the userId Bluegroup
    let userGroups = user['_json'].blueGroups;

    //Get the BlueGroups that the application uses
    let appGroups = settings.appAccess.split(",");

    //Get the common BlueGroup of above two
    user['_json'].blueGroups = _.intersection(userGroups, appGroups);
    console.log("User Bluegroups:" + user['_json'].blueGroups)
    done(null, user);

});


passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

//strategy defined for OIDC
var OpenIDConnectStrategy = require('passport-ci-oidc').IDaaSOIDCStrategy;
var Strategy = new OpenIDConnectStrategy({
        discoveryURL: settings.discovery_url,
        clientID: settings.client_id,
        scope: 'email',
        response_type: 'code',
        clientSecret: settings.client_secret,
        callbackURL: settings.callback_url,
        skipUserProfile: true},
        function (iss, sub, profile, accessToken, refreshToken, params, done) {
                process.nextTick(function () {
                        profile.accessToken = accessToken;
                        profile.refreshToken = refreshToken;
                        done(null, profile);
                })
        }
)


passport.use(Strategy); 

    
        app.get('/login', passport.authenticate('openidconnect', { state: Math.random().toString(36).substr(2, 10) }));

        // app.get('/feedback', passport.authenticate('oidc', { state: Math.random().toString(36).substr(2, 10) }));

        app.get('/auth/sso/callback', function (req, res, next) {
        var redirect_url = req.session.originalUrl;
        passport.authenticate('openidconnect', {
                successRedirect: redirect_url,
                failureRedirect: '/failure'
        })(req, res, next);
});

// failure page
        app.get('/failure', function(req, res) {
        res.send('login failed'); 
        });

function ensureAuthenticated(req, res, next) {
        if (!req.isAuthenticated()) {
                req.session.originalUrl = req.originalUrl;
                res.redirect('/login');
        } else {
                console.log(JSON.stringify(req.user.displayName));
                return next();
        }
}

app.use("*",ensureAuthenticated);

// add API here app.get() and use req.user.<desired_info>
app.get('/api/getUserName', function (req, res) {
        res.json(req.user.displayName);
        // res.JSON.stringify(req.user.displayName);
    });

    //for Bluepage API, we are fetching user email
    app.get('/api/getUserEmail', function (req, res) {
        res.json(req.user.id);
    });

    //for different roles access, using this api
app.get('/api/getUser', function (req, res) {
        res.json(req.user);
        
});

app.use(express.static(path.join(__dirname, 'public')));

// app.get('/feedback', ensureAuthenticated, (_, res) => res.redirect('/#/feedback'));


  


        app.get('/logout', function (req, res) {
                req.session.destroy();
                req.logout();

        // var html = '<div style="visibility:hidden">';
        // html += '<iframe height="0" width="0" src="https://idaas.iam.ibm.com/pkmslogout"></iframe>';
	// html += '<iframe height="0" width="0" src="https://' + settings.hostname + '/pkmslogout"></iframe></div>';
        // html += 'Logout complete. <br><a href="/">home</>';
        // res.send(html);
                res.redirect('/');
        });


var https = require('https');
var https_port = settings.local_port || 4200;

var http = require('http');
var http_port = process.env.PORT || 4200; //IBM Cloud set the PORT value

if (settings.local) {
        https.createServer({
                key: fs.readFileSync('certificates/key.pem'),
                cert: fs.readFileSync('certificates/cert.pem')
        }, app).listen(https_port);

        console.log("server starting on https://localhost:" + https_port);

}
else {
   app.listen(http_port, function() {
     console.log("server starting on http://localhost:" + http_port );
   });
}






