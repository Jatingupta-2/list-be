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
const UserModel = mongoose.model('User');
const ItemModel = mongoose.model('Item');
const HistoryModel = mongoose.model('History');


let getAllItems = (req, res) => {
    ItemModel.findOne({ 'listId': req.body.listId })
        .select('-__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'Item Controller: getAllItem', 10)
                let apiResponse = response.generate(true, 'Failed To Find Item Details', 500, null)
                res.send(apiResponse)
            }
            else if (check.isEmpty(result)) {
                logger.error('null', 'Item Controller: getAllItem', 10)
                let apiResponse = response.generate(true, 'No Item found', 500, null)
                res.send(apiResponse)
            }
            else {

                let apiResponse = response.generate('false', 'All Items Found', 200, result)

                console.log(apiResponse)
                res.send(apiResponse);
            }
        })
}


let getLists = (req, res) => {
    ItemModel.find({ 'userId': req.body.userId })
        .select('-__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'Item Controller: getLists', 10)
                let apiResponse = response.generate(true, 'Failed To Find Lists', 500, null)
                res.send(apiResponse)
            }
            else if (check.isEmpty(result)) {
                logger.error('null', 'Item Controller: getLists', 10)
                let apiResponse = response.generate(true, 'No List found', 500, null)
                res.send(apiResponse)
            }
            else {

                let apiResponse = response.generate('false', 'All Lists', 200, result)
                console.log(apiResponse)
                res.send(apiResponse);
            }
        })
}




let addList = (req, res) => {

    let listId = shortid.generate()
    let newList = new ItemModel({
        listId: listId,
        userId: req.body.userId,
        listName: req.body.listName,
        item: req.body.item

    })

    newList.save((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'Item Controller: addList', 10)
            let apiResponse = response.generate(true, 'Failed To add List', 500, null)
            res.send(apiResponse)
        }
        else if (check.isEmpty(result)) {
            logger.error('null', 'Item Controller: addList', 10)
            let apiResponse = response.generate(true, 'No List found', 500, null)
            res.send(apiResponse)
        }
        else {
            console.log(result)

            let data2 = new HistoryModel({
                listId: listId,
                lists: [newList]
            })

            data2.save(((err, result) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'Item Controller: addList', 10)
                    let apiResponse = response.generate(true, 'Failed To add List', 500, null)
                    res.send(apiResponse)
                }
                else {
                    let apiResponse = response.generate('false', 'All Details', 200, result)
                    console.log(result)
                    res.send(apiResponse);
                }
            }))
        }
    })
}



let editItem = (req, res) => {


    let updateSingleList = () => {
        return new Promise((resolve, reject) => {
            let listId = req.body.listId
            let options = req.body

            console.log(options)
            ItemModel.update({ 'listId': listId }, options, { multi: true })
                .select('-__v -_id')
                .lean()
                .exec((err, result) => {
                    if (err) {
                        console.log(err)
                        logger.error(err.message, 'Item Controller: editItem', 10)
                        let apiResponse = response.generate(true, 'Failed To Find Item Details', 500, null)
                        reject(apiResponse)
                    }
                    else if (check.isEmpty(result)) {
                        logger.error('null', 'Item Controller: editItem', 10)
                        let apiResponse = response.generate(true, 'No Item found', 500, null)
                        reject(apiResponse)
                    } else {
                        logger.info('User Found', 'userController: findUser()', 10);
                        resolve(result);
                    }

                })
        })
    }


    let findTransaction = () => {
        return new Promise((resolve, reject) => {
            HistoryModel.findOne({ 'listId': req.body.listId }, (err, result) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'Item Controller: findTransaction', 10)
                    let apiResponse = response.generate(true, 'Failed To Find transaction Details', 500, null)
                    reject(apiResponse)
                }
                else if (check.isEmpty(result)) {
                    logger.error('null', 'Item Controller: findTransaction', 10)
                    let apiResponse = response.generate(true, 'No Transaction found', 500, null)
                    reject(apiResponse)
                } else {
                    result.lists.push(req.body)
                    logger.info('Transaction Found', 'Item Controller: findTransaction', 10);
                    resolve(result);
                }
            })

        })
    }


    let updateTransaction = (trans) => {
        return new Promise((resolve, reject) => {
            console.log(trans)

            HistoryModel.update({ 'listId': req.body.listId }, trans, (err, result) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'Item Controller: updateTransaction', 10)
                    let apiResponse = response.generate(true, 'Failed To Find transaction Details', 500, null)
                    reject(apiResponse)
                }
                else if (check.isEmpty(result)) {
                    logger.error('null', 'Item Controller: updateTransaction', 10)
                    let apiResponse = response.generate(true, 'No transaction found', 500, null)
                    reject(apiResponse)
                } else {

                    logger.info('User Found', 'Item Controller: updateTransaction()', 10);
                    resolve(result);
                }
            })


        })


    }

    updateSingleList(req, res)
        .then(findTransaction)
        .then(updateTransaction)

        .then((resolve) => {

            let apiResponse = response.generate(false, 'Edited Successfully', 200, resolve)
            console.log(apiResponse)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err);

            res.send(err)
        })
}

let undo = (req, res) => {

    let listId = req.body.listId


    let findTransaction = () => {
        return new Promise((resolve, reject) => {
            HistoryModel.findOne({ 'listId': listId })
                .select('-__v -_id')
                .lean()
                .exec((err, result) => {
                    if (err) {
                        console.log(err)
                        logger.error(err.message, 'Item Controller: findTransaction', 10)
                        let apiResponse = response.generate(true, 'Failed To Find transaction Details', 500, null)
                        reject(apiResponse)
                    }
                    else if (check.isEmpty(result) || result.lists.length == 1) {
                        logger.error('null', 'Item Controller: findTransaction', 10)
                        let apiResponse = response.generate(true, 'No transaction found', 300, null)
                        reject(apiResponse)
                    } else {
                        logger.info('User Found', 'Item Controlle: findTransaction()', 10);
                        console.log(result)
                        resolve(result);
                    }


                })
        })

    }

    let updateList = (result) => {
        console.log(result)
        let passresult = result
        let data;
        let data1;

        data1 = passresult.lists.pop();
        data = passresult.lists[passresult.lists.length - 1]
        console.log(data)

        return new Promise((resolve, reject) => {
            ItemModel.update({ 'listId': data.listId }, { listId: data.listId, userId: data.userId, listName: data.listName, item: data.item }, { multi: true })
                .select('-__v -_id')
                .lean()
                .exec((err, result) => {
                    if (err) {
                        console.log(err)
                        logger.error(err.message, 'Item Controller: updateList', 10)
                        let apiResponse = response.generate(true, 'Failed To Find list Details', 500, null)
                        reject(apiResponse)
                    }
                    else if (check.isEmpty(result)) {
                        logger.error('null', 'Item Controller: updateList', 10)
                        let apiResponse = response.generate(true, 'No list found', 500, null)
                        reject(apiResponse)
                    } else {
                        logger.info('User Found', 'Item Controller: updateList', 10);

                        resolve(passresult);
                    }

                })
        })


    }


    let updateTransaction = (result) => {
        return new Promise((resolve, reject) => {
            HistoryModel.update({ 'listId': listId }, result)
                .select('-__v -_id')
                .lean()
                .exec((err, result) => {
                    if (err) {
                        console.log(err)
                        logger.error(err.message, 'Item Controller: updateTransaction', 10)
                        let apiResponse = response.generate(true, 'Failed To Find transaction Details', 500, null)
                        reject(apiResponse)
                    }
                    else if (check.isEmpty(result)) {
                        logger.error('null', 'Item Controller: updateTransaction', 10)
                        let apiResponse = response.generate(true, 'No transaction found', 500, null)
                        reject(apiResponse)
                    } else {
                        logger.info('User Found', 'Item Controller: updateTransaction', 10);
                        resolve(result);
                    }

                })


        })

    }

    findTransaction(req, res)
        .then(updateList)
        .then(updateTransaction)

        .then((resolve) => {

            let apiResponse = response.generate(false, 'Undo Successful', 200, resolve)
            console.log(apiResponse)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err);

            res.send(err)
        })





}




module.exports = {
    getAllItem: getAllItems,

    editItem: editItem,

    undo: undo,

    addList: addList,

    getLists: getLists
}
