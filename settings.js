exports.client_id = "YjJlNGEwNzMtNjYzZS00";
exports.client_secret = "ODU3NjkwNGMtMDQzOC00";

//Bluegroups names for Admin
exports.appAccess = "test-INPS-admin";

// exports.adminAccess = "test-INPS-admin"; 



exports.discovery_url="https://preprod.login.w3.ibm.com/oidc/endpoint/default/.well-known/openid-configuration";

//when running on Cirrus
exports.callback_url="https://inps-test-ui.wdc1a.ciocloud.nonprod.intranet.ibm.com/auth/sso/callback"
exports.hostname = "https://inps-test-ui.wdc1a.ciocloud.nonprod.intranet.ibm.com";

//when running on localhost, un-comment below two lines and set exports.local=true;
// exports.callback_url="https://localhost:4200/auth/sso/callback"
// exports.hostname = "https://localhost:4200";

// true for local, false for Cloud 
exports.local = false;

// exports.local_port = "4200";





//for different environments, define below and create all environment file in "local" folder

// var ssoLocal = require('./local/sso-local-test.json')

// if(process.env.APP_ENV != "test"){
//     exports.appAccess = ssoLocal.appAccess;
//     exports.client_id = ssoLocal.client_id;
//     exports.client_secret = ssoLocal.client_secret;
//     exports.callback_url = ssoLocal.callback_url;
//     exports.discovery_url = ssoLocal.discovery_url;
//     exports.hostname = ssoLocal.hostname;
// }
// else{
//     exports.appAccess = process.env.appAccess;
//     exports.client_id = process.env.client_id;
//     exports.client_secret = process.env.client_secret;
//     exports.callback_url = process.env.callback_url;
//     exports.discovery_url = process.env.discovery_url;
//     exports.hostname = process.env.hostname;
// }
