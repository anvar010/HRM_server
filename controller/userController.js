const users = require('../db/models/users');
const bcrypt = require('bcryptjs');
const success_function = require('../utils/response-handler').success_function ;
const error_function = require('../utils/response-handler').error_function ;

async function createUser (req,res) {
    try {
        let first_name = req.body.first_name ;
        let last_name = req.body.last_name;
        let email = req.body.email;
        let password = req.body.password;

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
        });

        if (new_user) {
            let response_datas = {
                _id : new_user._id,
                first_name : new_user.first_name,
                last_name : new_user.last_name,
                email : new_user.email,
               
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

async function getUserData(req,res){
    try {
        let allUsers = await users.find({});

        if (allUsers.length > 0) {
            let response = success_function({
                statusCode : 200,
                data : allUsers,
                message : "All users retrieved successfully",
            });
            res.status(response.statusCode).send(response);
        }else {
            let response = error_function({
                statusCode : 404 ,
                message : "No users found",
            });
            res.status(response.statusCode).send(response);
            return ;
        }
    } catch(error) {
        console.log ("error : ",error);

        let response = error_function({
            statusCode : 500,
            message : "Internal server error",
        });
        res.status(response.statusCode).send(response)
    }
} 

module.exports = {
    createUser,
    getUserData,
}