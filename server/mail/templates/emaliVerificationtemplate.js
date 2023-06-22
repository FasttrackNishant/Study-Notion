const otpTemplate = (otp) => {
  return `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Course Registration Email Confirmation</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab&display=swap" rel="stylesheet">
        <style>
            * {
                margin: 0;
                padding: 0;
            }
    
            body {
                background-color: #fee2e2;
            }
    
            .container {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 100vh;
                max-width: 760px;
                margin: 0 auto;
                /* max-height: 600px; */
            }
    
            .logo {
    
                margin-bottom: 25px;
                max-width: 200px;
            }
    
            .message {
                font-weight: bold;
                text-align: center;
                font-size: 27px;
                font-family: 'Roboto Slab', serif;
    
    
            }
    
            .body {
                text-align: center;
                margin:20px 50px;
                font-size: 16px;
                font-family: 'Roboto Slab', serif;
    
            }
    
            .para {
                
                margin: 14px;
            }
    
    
            .highlight {
    
                font-weight: bold;
                font-size: 30px;
            }
    
            .btn {
    
                background-color: #84cc16;
                display: inline-block;
                margin: 10px;
                padding: 10px 20px;
                font-weight: bold;
                font-family: 'Roboto Slab', serif;
                border-radius: 5px;
                font-size: 16px;
                text-decoration: none;
                border: none;
                cursor: pointer;
            }
    
            .support {
                margin-top: 14px;
                font-size: 14px;
                color: #999999;
                max-width: 500px;
                text-align: center;
    
            }
        </style>
    
    </head>
    
    <body>
    
        <div class="container">
    
            <a href="#"><img class="logo" src="https://i.ibb.co/7Xyj3PC/logo.png." alt=""></a>
    
            <div class="message">OTP Verification Mail</div>
    
            <div class="body">
    
                <p class="para">Dear User, </p>
                <p class="para">
                    Thank you for registering with StudyNotion. To complete your registration, please use the following OTP (One-Time Password) to verify your account:
                </p>
    
                <p class="para highlight"> ${otp}
    
                </p>
    
                <p class="para">This OTP is valid for 5 minutes. If you did not request this verification, please disregard this email. Once your account is verified, you will have access to our platform and its features.</p>
            </div>
            <div class="support">
                <p>If you have any questions or need assistance, please feel free to reach out to us at <a
                        href="info@studynotion.com">info@studynotion.com.</a> We are here to help!</p>
            </div>
        </div>
    
    
    
    </body>
    
    </html>
`;
};

module.exports = otpTemplate;
