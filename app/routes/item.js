const express = require('express');
const router = express.Router();
const userController = require("./../../app/controllers/userController");
const appConfig = require("./../../config/appConfig")

const itemController = require('./../controllers/itemController');

module.exports.setRouter = (app) => {
    let baseUrl = `${appConfig.apiVersion}/items`;

    // defining routes.


    app.post(`${baseUrl}/view/all`, itemController.getAllItem);

    /**
         * @apiGroup users
         * @apiVersion  1.0.0
         * @api {post} /api/v1/items/view/all api for Items view all.
         *
         * 
         * 
         * @apiParam {string} listId listId of the user. (body params) (required)
         * 
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
             
         { error: 'false',
            message: 'All Items Found',
            status: 200,
            data:
            { listId: '2BmYuDxH3',
                userId: 'PqUWyXaZ2',
                listName: 'A new List',
                item: [] 
            } 
        }
         
         @apiErrorExample {json} Error-Response:
         *
         * {
            "error": true,
            "message": "Failed To Find Item Details",
            "status": 500,
            "data": null
           }
         
         
        */




    app.put(`${baseUrl}/edit`, itemController.editItem)

    /**
         * @apiGroup users
         * @apiVersion  1.0.0
         * @api {put} /api/v1/items/edit api for items edit.
         *
         * 
         * 
         * 
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
             
         { error: false,
            message: 'Edited Successfully',
            status: 200,
            data: { n: 1, nModified: 1, ok: 1 } 
         }
         
         
        */





    app.put(`${baseUrl}/undo`, itemController.undo)

/**
         * @apiGroup users
         * @apiVersion  1.0.0
         * @api {put} /api/v1/items/undo api for undo.
         *
         * 
         * 
         * 
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
             
         { 
            error: false,
            message: 'Undo Successful',
            status: 200,
            data: { n: 1, nModified: 1, ok: 1 
            } 
        }
         
        
         
         
        */





    app.post(`${baseUrl}/add`, itemController.addList)
    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/signup api for adding List.
     *
     * 
     * 
     * @apiParam {string} firstName userId of the user. (body params) (required)
     * @apiParam {string} lastName listName of the list. (body params) (required)
     * @apiParam {string} mobileNumber item of the list. (body params) (required)

     
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {  error: false,
            message: 'User created',
            status: 200,
            data:
            { listId: {""},
                userId:{ ""},
                listName:{""},
                item: [{""}]
            }
    
    */



    app.post(`${baseUrl}/viewList`, itemController.getLists);
    /**
         * @apiGroup users
         * @apiVersion  1.0.0
         * @api {post} /api/v1/items/viewList api for Viewing List.
         *
         * 
         * 
         * @apiParam {string} userId userId of the user. (body params) (required)
         * 
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
             
         { error: 'false',
            message: 'All Lists',
            status: 200,
            data:
            [ { listId: '2BmYuDxH3',
                userId: 'PqUWyXaZ2',
                listName: 'A new List',
                item: [] },
                { listId: 'pGwntczXM',
                userId: 'PqUWyXaZ2',
                listName: 'A new List',
                item: [] 
            } ]

        }
         
         @apiErrorExample {json} Error-Response:
         *
         * {
            "error": true,
            "message": "No List Found",
            "status": 500,
            "data": null
           }
         
         
        */


    
    

}