let success_function = require('../utils/response-handler').success_function;
const error_function = require('../utils/response-handler').error_function;
const users = require('../db/models/users');
const resetPassword = require('../utils/email-templates/resetPassword').resetPassword;
let bcrypt =require('bcryptjs')
let jwt = require('jsonwebtoken');
const sendEmail = require('../utils/send-email').sendEmail;
let dotenv =require ('dotenv');
// const { response } = require('express');


dotenv.config();


exports.login = async function (req,res){
    try {
        let email = req.body.email;
        console.log("email : ", email);

       let password =req.body.password;
       console.log("password : ", password);

       

       if(!email) {
        let response = error_function({
            statusCode : 400,
            message : "email is Required"
        });
        res.status(response.statusCode).send(response);
        return;
       }
       if (!password) {
        let response = error_function({
            statusCode : 400,
            message : "Password is Required"
        });
        res.status(response.statusCode).send(response);
        return;
       }
       let user = await users.findOne({ email });
       console.log("user : ",user)

       if (user) {

        let db_password = user.password;

        console.log("db_password : ",db_password);

        bcrypt.compare(password,db_password,(err,auth)=>{
            if(auth===true){
                const access_token = jwt.sign({
                    user_id:user._id},process.env.PRIVATE_KEY, {expiresIn: "1d"});
                    console.log("access_token : ",access_token);

                    let response = success_function({
                        statusCode : 200,
                        data : access_token,
                        message : "Login Successful"
                    });
                    res.status(response.statusCode).send(response);
                    
                    return ;

                }else{
                    let response = error_function({
                        statusCode : 400,
                        message : "Invalid Password"
                    });
                    res.status(response.statusCode).send(response);
                    return ;
                }
            });
        } else {
            let response = error_function({
                statusCode: 400,
                message: "User not found"
            });
            res.status(response.statusCode).send(response);
            return;
        }
    }catch (error) {
        console.log("error : ",error);
        let response = error_function({
            statusCode : 400,
            message : error.message ? error.message : error,
        });
       res.status(response.statusCode).send(response);
       return;

    }
}


exports.forgotPasswordController = async function (req,res) {
    
    try{
    let email = req.body.email ;
    console.log("email : ", email);

    if(email){
       let user =  await users.findOne({email : email});
        if(user) {
            let reset_token = jwt.sign(
                {user_id : user._id},
                process.env.PRIVATE_KEY,
                {expiresIn : "10m"}
            );
            // console.log("user : ", user);

            let data = await users.updateOne(
                { email : email },
                { $set : {password_token : reset_token} }
                
            );
            console.log("data : ", data);
            if(data.matchedCount === 1 && data.modifiedCount == 1 ){

                let reset_link = `${process.env.FRONTEND_URL}reset-password?token=${reset_token}`
                let email_template = await resetPassword(user.first_name,reset_link);
                sendEmail(email,"Forgot Password",email_template);

                let response = success_function({

                    statusCode : 200 ,
                    message : "Email Sent Successfully"

                });
                res.status(response.statusCode).send(response)
                return ;

            }else if(data.matchedCount == 0){

                let response  = error_function({
                    statusCode : 404,
                    message : "User not found"
                })
                res.status(response.statusCode).send(response)
                return;

            }else{
                let response = error_function({
                    statusCode : 400,
                    message : "Password reset failed"
                })
                res.status(response.statusCode).send(response)
                return;
            }
        }else {
            let response = error_function({
                statusCode : 403,
                message : "Forbidden"
            })
            res.status(response.statusCode).send(response);
            return;
        }

    }else{
        let response = error_function({
            statusCode : 422 ,
            message : "Email is required"
        })
        res.status(response.statusCode).send(response);
        return;

    }
}catch (error) {
    if(process.env.NODE_ENV){

        let response = error_function({
            statusCode : 400,
            message : error
            ?error.message
            ?error.message
            :error
            : "Something went wrong",
        });
        res.status(response.statusCode).send(response);
        return;
    }else{
        let response = error_function({
            statusCode : 400,
            message : error
        })
        res.status(response.statusCode).send(response);
        return ;
    }
}
};