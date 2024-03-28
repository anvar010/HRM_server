const users = require('../db/models/users');
const bcrypt = require('bcryptjs');
const success_function = require('../utils/response-handler').success_function ;
const error_function = require('../utils/response-handler').error_function ;
const set_pass_template = require("../utils/email-templates/setPassword").resetPassword;
const sendEmail = require ("../utils/send-email").sendEmail;
const mongoose = require('mongoose');


function generateRandomPassword(length) {
    let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$";
    let password = "";

    for (var i = 0; i<length;i++) {
        var randomIndex = Math.floor(Math.random() * charset.length);
        password += charset.charAt(randomIndex);
    }
    return password;
}


async function createUser (req,res) {
    try {
        let first_name = req.body.first_name ;
        let last_name = req.body.last_name;
        let email = req.body.email;
        let password = generateRandomPassword(12);

        console.log("name : ",first_name)

        let userFound =await users.findOne({email});

        if(userFound){
            let response = error_function({
                statusCode : 400 ,
                message : "user already exist"
            })
            res.status(response.statusCode).send(response);
            return ;
        }

        let salt = await bcrypt.genSalt(10);
        console.log("salt : ",salt);

        let hashed_password = bcrypt.hashSync(password,salt);

        let new_user = await users.create ({
            first_name,
            last_name,
            email,
            password : hashed_password,
            user_type : "65f3d65961496a1395461cf1"
        });


        if (new_user) {
            let emailContent = await set_pass_template(first_name,email,password);

            await sendEmail(email, "set your password",emailContent);
               console.log("email : ", email)

            let response_datas = {
                _id : new_user._id,
                first_name : new_user.first_name,
                last_name : new_user.last_name,
                email : new_user.email,
                user_type : "65f3d65961496a1395461cf1"
               
            }
            
            console.log("new_user : ",new_user);

            let response = success_function({
                statusCode : 201,
                data : response_datas,
                message : "user created successfully",
            })
            res.status(response.statusCode).send(response);
            return ;
        }else {
            let response = error_function({
                statusCode : 400 ,
                message : "user creation failed",
            })
            res.status(response.statusCode).send(response);
            return ;
        }
    }catch (error) {
        console.log("error : ",error);

        let response = error_function ({
            statusCode : 400 , 
            message : "something went wrong..."
        })
        res.status(response.statusCode).send(response);
        return ;
    }
}

async function getUserData(req, res) {
    try {
        let count = Number(await users.countDocuments());
        console.log("Count: ", count);

        const pageNumber = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || count;

        console.log("Page Number:", pageNumber);
        console.log("Page Size:", pageSize);

        let allUsers = await users
            .find({})
            .skip(pageSize * (pageNumber - 1))
            .limit(pageSize);

        if (allUsers.length > 0) {
            let totalCount = await users.countDocuments();
            let totalPages = Math.ceil(totalCount / pageSize);

            let data = {
                count: totalCount,
                totalPages: totalPages,
                currentPage: pageNumber,
                datas: allUsers,
            };

            let response = success_function({
                statusCode: 200,
                data: data,
                message: "Users retrieved successfully",
            });

            res.status(response.statusCode).send(response);
        } else {
            let response = error_function({
                statusCode: 404,
                message: "No users found",
            });

            res.status(response.statusCode).send(response);
        }
    } catch (error) {
        console.log("Error:", error);

        let response = error_function({
            statusCode: 500,
            message: "Internal server error",
        });

        res.status(response.statusCode).send(response);
    }
}


const getSingleUserData = async (req, res) => {
    try {
      const userId = req.params.id;
      console.log("userId : ",userId)
      if (!userId || !mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
  
     
      const user = await users.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };





module.exports = {
    createUser,
    getUserData,
    getSingleUserData
}