let success_function = require('../utils/response-handler').success_function;
const error_function = require('../utils/response-handler').error_function;
let jwt = require('jsonwebtoken');
let bcrypt =require('bcryptjs')
let dotenv =require ('dotenv');
const { response } = require('express');
const users = require('../db/models/users');
dotenv.config();


exports.login = async function (req,res){
    try {
        let email = req.body.email;
        console.log("email : ", email);

       let password =req.body.password;
       console.log("password : ", password);

       if(!email) {
        response = error_function({
            statuscode : 400,
            message : "Email is Required"
        });
        res.status(response.statusCode).send(response);
        return ;
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
                    user_id:user.user_id},process.env.PRIVATE_KEY, {expiresIn: "1d"});
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