/*
Script created by Wildan F
*/
const rp = require('request-promise');
const randomstring = require('randomstring');
const inquirer = require('inquirer');
const random_ua = require('random-ua');
const delay = require('delay');
const S = require('string');

async function generateData() {
    try {
        const cURL = await rp({
            url: 'https://randomuser.me/api/?nat=us',
            method: 'GET',
            json: true
        });
        return {
            name: `${cURL.results[0].name.first} ${cURL.results[0].name.last}`,
            gender: `${cURL.results[0].gender}`,
            email: `${cURL.results[0].email.replace('@example.com', '')}`
        };
    } catch(err) {
        return err;
    }
}

async function registerBigToken(email, referral) {
    try {
        const cURL = await rp({
            url: 'https://api.bigtoken.com/signup',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'User-Agent': await random_ua.generate(),
                'Content-Type': ' application/x-www-form-urlencoded'
            },
            form: {
                email: email,
                password: "Lolipop1902@",
                referral_id: referral,
                monetize: 1
            }
        });
        return cURL;
    } catch(err) {
        return err;
    }
}

(async function() {
    const qx = await inquirer.prompt([{
        type: 'input',
        name: 'referral',
        message: 'Enter your referral',
        validate:function(data) {
            if(!data) return 'Can\'t empty';
            return true;
        }
    }])
    let i = 0;
    while(i < 100) {
        i++;
        const doGetData = await generateData();
        let emailVerified = ['creo.iotu.nctu.me', 'nasa.dmtc.edu.pl', 'derbydales.co.uk', 'aiot.vuforia.us', 'edu.creo.site', '50sale.edu.vn', 'aiot.aiphone.eu.org', 'edu.dmtc.press'];
        emailVerified = emailVerified[Math.floor(Math.random() * emailVerified.length)];
        try {
            let cURL = await rp({
                url: 'https://generator.email/email-generator',
                method: 'POST',
                headers: {
                    'User-Agent' : await random_ua.generate(),
                    'Accept' : 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language' : 'en-US,en;q=0.5',
                    'Cookie' : 'surl='+emailVerified+'/'+doGetData.email+'/; _ga=GA1.2.1971437269.1554693562; _gid=GA1.2.75263414.1554693562; _gat=1; io=TpY6L8Z9S0ZVVk92PZF4'
                }
            });
        } catch(err) {
            if(err.statusCode === 302) {
                console.log(`[!] Creating email.`);
            }
        }
        console.log(`[!] Email : ${doGetData.email}@${emailVerified}`);
        const doRegister = await registerBigToken(doGetData.email+`@${emailVerified}`, qx.referral);
        if(doRegister.indexOf('user_id') > -1 || doRegister != "") {
            console.log(`[!] Register success, sleep 30sec.`);
            await delay(30000);
            try {
                cURL = await rp({
                    url: 'https://generator.email/inbox2/',
                    method: 'POST',
                    headers: {
                        'User-Agent' : await random_ua.generate(),
                        'Accept' : 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                        'Accept-Language' : 'en-US,en;q=0.5',
                        'Cookie' : 'surl='+emailVerified+'/'+doGetData.email+'/; _ga=GA1.2.1971437269.1554693562; _gid=GA1.2.75263414.1554693562; _gat=1; io=TpY6L8Z9S0ZVVk92PZF4'
                    }
                });
                if(cURL.indexOf('verify%3Fcode%3D') > -1) {
                    const verifyCode = S(cURL).between('verify%3Fcode%3D', '%26type%3D').s;
                    try {
                        cURL = await rp({
                            url: 'https://api.bigtoken.com/signup/email-verification',
                            method: 'POST',
                            headers: {
                                'User-Agent' : await random_ua.generate(),
                                'Accept' : 'application/json'
                            },
                            form: {
                                email: `${doGetData.email}@${emailVerified}`,
                                verification_code: `${verifyCode}`
                            }
                        });
                        if(cURL.indexOf('"reward":true') > -1) {
                            console.log(`[>] Success!\n`);
                        } else {
                            console.log(`[!] Manual verification.`);
                        }
                    } catch(err) {
                        console.log(`[!] Failed to fetch signup email verification.`);
                    }
                } else {
                    console.log(`[?] Failed to get url.`);
                }
            } catch(err) {
                console.log(`[!] Failed to get inbox.`);
            }
        } else {
            console.log(`[?] Failed to register. ${doGetData.email}@${emailVerified}`);
        }
    }
})();