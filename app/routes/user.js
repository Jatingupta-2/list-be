const express = require('express');
const router = express.Router();
const userController = require("./../../app/controllers/userController");
const appConfig = require("./../../config/appConfig")
const mailController = require('./../controllers/mailController')

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/users`;

    // defining routes.


    app.get(`${baseUrl}/view/all`, userController.getAllUser);


    /**
         * @apiGroup users
         * @apiVersion  1.0.0
         * @api {get} /api/v1/users/view/all api for user view all.
         *
         * 
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
             
         {
             "error":"false",
             "message":"All Details",
             "status":200,
             "data":
             [{"createdOn":"2019-05-01T03:02:22.239Z",
                "countryCode":"India",
                "mobileNumber":0,
                "email":"",
                "lastName":"",
                "firstName":"",
                "userId":"",
                "receivedRequests":[""],
                "sentRequests":[""],
                "friends":[""],
                "userName":"Jatin"
                    }
         
         @apiErrorExample {json} Error-Response:
         *
         * {
            "error": true,
            "message": "Failed To Find User Details",
            "status": 500,
            "data": null
           }
         
         
        */







    app.post(`${baseUrl}/delete/:userId`, userController.deleteUser)


    /**
         * @apiGroup users
         * @apiVersion  1.0.0
         * @api {post} /api/v1/users/delete/:userId api for delete a user.
         *
         * 
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
             
         {
                "error": "false",
                "message": "Delete User",
                "status": 200,
                "data": {
                    "n": 0,
                    "ok": 1
                }
            }
         
         @apiErrorExample {json} Error-Response:
         *
         * {
            "error": true,
            "message": "No user found",
            "status": 500,
            "data": null
           }
         
         
        */




    app.post(`${baseUrl}/signup`, userController.signUpFunction);
    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/signup api for user signup.
     *
     * 
     * 
     * @apiParam {string} firstName firstName of the user. (body params) (required)
     * @apiParam {string} lastName lastName of the user. (body params) (required)
     * @apiParam {string} mobileNumber mobile of the user. (body params) (required)
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     * @apiParam {string} countryCode countryCode of the user. (body params) (required)
     
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {  error: false,
            message: 'User created',
            status: 200,
            data:
            { __v: 0,
                _id: 5cc90ef30bb80c1974d39e5d,
                createdOn: 2019-05-01T03:13:55.131Z,
                countryCode: 'India',
                mobileNumber: 0,
                email: '',
                lastName: 'r',
                firstName: '',
                userId: '',
                receivedRequests: [ '' ],
                sentRequests: [ '' ],
                friends: [ '' ],
                userName: '' } 
            }
    
    */

    // params: firstName,lastName,mobile,email,password,countryCode.

    app.post(`${baseUrl}/login`, userController.loginFunction);


    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/login api for user login.
     *
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         { error: false,
            message: 'Login Successful',
           error: false,
            message: 'Login Successful',
            status: 200,
            data:
            { authToken: '',
                userDetails:
                { countryCode: 'India',
                    mobileNumber: 0,
                    email: '',
                    lastName: 'r',
                    firstName: '',
                    userId: '',
                    receivedRequests: [],
                    sentRequests: [],
                    friends: [],
                    userName: '' } }
                        
                    }


    
    */

    // params: email, password.

    app.post(`${baseUrl}/logout`, userController.logout);
    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/logout to logout user.
     *
     * @apiParam {string} authToken authToken of the user. (auth headers) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Logged Out Successfully",
            "status": 200,
            "data": null

        }

    @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed To Find User Details",
	    "status": 500,
	    "data": null
	   }
    */

    // auth token params: authToken.

    app.post(`${baseUrl}/editPassword/:email`, userController.editPassword)


    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/editPassword/:email to editing Password of a user.
     *
     * @apiParam {string} email password of the user. (auth headers) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         { error: 'false',
            message: ' editPassword',
            status: 200,
            data: { n: 1, nModified: 1, ok: 1 
            }
         }

    @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "No user found",
	    "status": 500,
	    "data": null
	   }
    */


    app.post(`${baseUrl}/mail`, mailController.main)

    /**
            * @apiGroup users
            * @apiVersion  1.0.0
            * @api {post} /api/v1/users/mail api for user forgot Password.
            *
            * 
            * @apiParam {string} email email of the user. (body params) (required)
            * 
            * @apiSuccess {object} myResponse shows error status, message, http status code, result.
            * 
            * @apiSuccessExample {object} Success-Response:
                
             { error: false,
               message: 'Mail Sent Successfully',
               status: 200,
               data: null 
           }          
           */

}
