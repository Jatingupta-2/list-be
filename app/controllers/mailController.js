"use strict";
const nodemailer = require("nodemailer");
const shortid= require('shortid')
const mongooose= require('mongoose')
const userModel= mongooose.model('User')
const passwordLib= require('./../libs/generatePasswordLib')
const check= require('./../libs/checkLib')
const response = require('./../libs/responseLib')

// async..await is not allowed in global scope, must use a wrapper
let sendmail=(req,res)=>{
  let email= req.body.email
  let newPassword= shortid.generate();

  userModel.update({ 'email': req.body.email },{'password':passwordLib.hashPassword(newPassword)})
        .select('-__v -_id')
        
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'Mail Controller: getSingleUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                res.send(apiResponse)
            }
            else if (check.isEmpty(result)) {
                logger.error(err.message, 'Mail Controller: getSingleUser', 10)
                let apiResponse = response.generate(true, 'No user found', 500, null)
                res.send(apiResponse)
            }
            else {
                

                async function main(){

  
                    // create reusable transporter object using the default SMTP transport
                    let transporter = nodemailer.createTransport({
                      service:'gmail' ,// true for 465, false for other ports
                      tls: { rejectUnauthorized: false },
                      auth: {
                        user: 'noreplyjatingupta@gmail.com', // generated ethereal user
                        pass: 'Jatin@123' // generated ethereal password
                      }
                    });
                  
                    // setup email data with unicode symbols
                    let mailOptions = {
                      from: "noreplyjatingupta@gmail.com", // sender address
                      to: email, // list of receivers
                      subject: "Forgot Password", // Subject line
                      text: `Use the Password - "${newPassword}" for Login.
                              Do Change it after First Login`, // plain text body
                      
                    };
                  
                    // send mail with defined transport object
                    let info = await transporter.sendMail(mailOptions)
                  
                    console.log("Message sent: %s", info.messageId);
                    // Preview only available when sending through an Ethereal account
                    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                  
                    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

                   
                    let apiResponse= response.generate(false, 'Mail Sent Successfully', 200, null)
                    console.log(apiResponse)
                    res.send(apiResponse)
                    
                  }main().catch(console.error);


            }
        })




}






module.exports={
    main:sendmail
    
}