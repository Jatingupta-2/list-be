const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib')
const passwordLib = require('../libs/generatePasswordLib');
const token = require('../libs/tokenLib');
const AuthModel = mongoose.model('Auth');

/* Models */
const UserModel = mongoose.model('User')
const generateCountry = require('../libs/generateCountryCodeLib');



let getAllUser = (req, res) => {
    UserModel.find()
        .select('-password -__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'User Controller: getAllUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                res.send(apiResponse)
            }
            else if (check.isEmpty(result)) {
                logger.error('null', 'User Controller: getAllUser', 10)
                let apiResponse = response.generate(true, 'No user found', 500, null)
                res.send(apiResponse)
            }
            else {

                let apiResponse = response.generate('false', 'All Details', 200, result)

                console.log(apiResponse)
                console.log(apiResponse.data[0].sentRequests)
                res.send(apiResponse);
            }
        })
}




let editPassword = (req, res) => {
    let options = req.body
    UserModel.update({ 'email': req.params.email }, { 'password': passwordLib.hashPassword(req.body.password) })
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'User Controller: editPassword', 10)
                let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                res.send(apiResponse)
            }
            else if (check.isEmpty(result)) {
                logger.error(err.message, 'User Controller: editPassword', 10)
                let apiResponse = response.generate(true, 'No user found', 500, null)
                res.send(apiResponse)
            }
            else {

                let apiResponse = response.generate('false', ' editPassword', 200, result)
                console.log(apiResponse)
                res.send(apiResponse);
            }
        })
}



// start user signup function 

let signUpFunction = (req, res) => {
    let validateUserInput = () => {
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                if (!validateInput.Email(req.body.email)) {
                    let apiResponse = response.generate(true, 'Email does not meet Criteria', 400, null)
                    reject(apiResponse);
                }
                else if (check.isEmpty(req.body.password)) {
                    let apiResponse = response.generate(true, 'Password is missing', 400, null)
                    reject(apiResponse);
                }
                else {
                    resolve(req);
                }
            }
            else {
                logger.error('Field Missing During User Creation', 'userController: createUser()', 5)
                let apiResponse = response.generate(true, 'One or More Parameter(s) is missing', 400, null)
                reject(apiResponse);
            }
        })
    }//end validate user

    let createUser = () => {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ 'email': req.body.email }, (err, retreivedDetails) => {
                if (err) {
                    logger.error(err.message, 'userController:Create User', 500, null)
                    let apiResponse = response.generate(true, 'Failed to create', 500, null);
                    return apiResponse;
                }
                else if (check.isEmpty(retreivedDetails)) {
                    
                    let newUser = new UserModel({
                        userId: shortid.generate(),
                        firstName: req.body.firstName,
                        lastName: req.body.lastName || '',
                        email: req.body.email.toLowerCase(),
                        mobileNumber: req.body.mobileNumber,
                        userName: req.body.firstName,
                        countryCode: generateCountry.generateCountryCode(req.body.countryCode),
                        password: passwordLib.hashPassword(req.body.password),
                        createdOn: Date.now(),
                        friends:"",
                        sentRequests:'',
                        receivedRequests:''
                    })

                    newUser.save((err, result) => {
                        if (err) {
                            logger.error(err.message, 'UserController:create User', 10)
                            let apiResponse = response.generate(true, 'Failed to create new user', 500, null);
                            reject(apiResponse);
                        }
                        else {
                            let newObj = result.toObject();
                            resolve(newObj);
                        }
                    })




                }
                else {
                    logger.error('', 'userController: createUser', 10)
                    let apiResponse = response.generate(true, 'User already exists', 403, null)
                    reject(apiResponse)
                }
            })

        })
    }

    validateUserInput(req, res)
        .then(createUser)
        .then((resolve) => {
            delete resolve.password;

            let apiResponse = response.generate(false, 'User created', 200, resolve)
            console.log(apiResponse)
            res.send(apiResponse);
        })
        .catch((err) => {
            console.log(err);

            res.send(err)
        })

}// end user signup function 

// start of login function 
let loginFunction = (req, res) => {

    let findUser = () => {
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                console.log('Email present');
                console.log(req.body);
                UserModel.findOne({ 'email': req.body.email })
                    .exec((err, result) => {
                        if (err) {
                            console.log(err)
                            logger.error('Failed To Retrieve User Data', 'userController: findUser()', 10)
                            /* generate the error message and the api response message here */
                            let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                            reject(apiResponse)
                        }
                        else if (check.isEmpty(result)) {
                            logger.error('No User Found', 'userController: findUser()', 7)
                            let apiResponse = response.generate(true, 'No User Details Found', 404, null)
                            reject(apiResponse)
                        }
                        else {
                            logger.info('User Found', 'userController: findUser()', 10);
                            resolve(result);
                        }
                    })
            }
            else {
                logger.error('No email found', 'UserController:Find User', 10)
                let apiResponse = response.generate(true, 'No Email Details Found', 404, null)
                reject(apiResponse)
            }
        })
    }//end find User

    let validatePassword = (retrievedUserDetails) => {
        console.log("Validating Password ... ");
        return new Promise((resolve, reject) => {
            passwordLib.comparePassword(req.body.password, retrievedUserDetails.password, (err, isMatch) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'userController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Login Failed', 500, null)
                    reject(apiResponse)
                }
                else if (isMatch) {

                    let retrievedUserDetailsObj = retrievedUserDetails.toObject();
                    delete retrievedUserDetailsObj.password
                    delete retrievedUserDetailsObj.__v
                    delete retrievedUserDetailsObj._id
                    delete retrievedUserDetailsObj.createdOn
                    delete retrievedUserDetailsObj.modifiedOn
                    resolve(retrievedUserDetailsObj);
                }
                else {
                    logger.info('Login Failed Due To Invalid Password', 'userController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Wrong Password.Login Failed', 400, null)
                    reject(apiResponse)
                }
            })
        })

    }//end validate Password


    let generateToken = (userDetails) => {
        console.log('Generating token...');
        console.log(userDetails);
        return new Promise((resolve, reject) => {
            token.generateToken(userDetails, (err, tokenDetails) => {
                if (err) {
                    console.log('Error');
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                }
                else {
                    tokenDetails.userId = userDetails.userId
                    tokenDetails.userDetails = userDetails
                    resolve(tokenDetails);
                }
            })
        })

    }//end Generate Token

    let saveToken = (tokenDetails) => {

        console.log('Saving Token ....');
        return new Promise((resolve, reject) => {
            AuthModel.findOne({ 'userId': tokenDetails.userId }, (err, retrievedTokenDetails) => {
                if (err) {
                    console.log(err.message, 'userController: saveToken', 10)
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                }
                else if (check.isEmpty(retrievedTokenDetails)) {
                    let newAuthToken = new AuthModel({
                        userId: tokenDetails.userId,
                        authToken: tokenDetails.token,
                        tokenSecret: tokenDetails.tokenSecret,
                        tokenGenerationTime: time.now()
                    })

                    newAuthToken.save((err, result) => {
                        if (err) {
                            logger.error(err.message, 'userController: saveToken', 10)
                            let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                            reject(apiResponse)
                        }
                        else {

                            let responseBody = {
                                authToken: result.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })

                }

                else {
                    retrievedTokenDetails.authToken = tokenDetails.token;
                    retrievedTokenDetails.tokenSecret = tokenDetails.tokenSecret
                    retrievedTokenDetails.tokenGenerationTime = time.now()
                    retrievedTokenDetails.save((err, newTokenDetails) => {
                        if (err) {
                            logger.error(err.message, 'userController: saveToken', 10)
                            let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                            reject(apiResponse)
                        }
                        else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody);
                        }
                    })
                }
            })
        })

    }//end save token

    findUser(req, res)
        .then(validatePassword)
        .then(generateToken)
        .then(saveToken)
        .then((resolve) => {

            let apiResponse = response.generate(false, 'Login Successful', 200, resolve)
            console.log(apiResponse)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err);

            res.send(err)
        })

}


// end of the login function 


let logout = (req, res) => {
    AuthModel.remove({ userId: req.params.userId }, (err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'user Controller: logout', 10)
            let apiResponse = response.generate(true, `error occurred: ${err.message}`, 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            let apiResponse = response.generate(true, 'Already Logged Out or Invalid UserId', 404, null)
            res.send(apiResponse)
        } else {
            
            let apiResponse = response.generate(false, 'Logged Out Successfully', 200, null)
            console.log(apiResponse)
            res.send(apiResponse)
        }
    })
} // end of the logout function.



let deleteUser = (req, res) => {
    UserModel.remove({ 'userId': req.params.userId })
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'User Controller: deleteUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                res.send(apiResponse)
            }
            else if (check.isEmpty(result)) {
                logger.error(err.message, 'User Controller: deleteUser', 10)
                let apiResponse = response.generate(true, 'No user found', 500, null)
                res.send(apiResponse)
            }
            else {

                let apiResponse = response.generate('false', 'Delete User', 200, result)
                console.log(apiResponse)
                res.send(apiResponse);
            }
        })
}

module.exports = {
    deleteUser: deleteUser,
    getAllUser: getAllUser,
    signUpFunction: signUpFunction,
    loginFunction: loginFunction,
    logout: logout,
    editPassword: editPassword
}// end exports