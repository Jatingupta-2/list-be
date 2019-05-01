const socketio = require('socket.io');
const mongoose = require('mongoose')
const shortid = require('shortid')
const logger = require('./loggerLib')
const events = require('events');
const eventEmitter = new events.EventEmitter();

const tokenLib = require('./tokenLib');
const check = require('./checkLib')
const response = require('./responseLib');
const ItemModel = mongoose.model('Item')
const HistoryModel = mongoose.model('History')
const UserModel = mongoose.model('User')


let setServer = (server) => {

    let io = socketio.listen(server)
    myIo = io.of('/');

    myIo.on('connection', (socket) => {

        console.log("Successful connection");

        socket.on('send-req', (data) => {

            console.log("Sending friend Request")

            console.log(data)

            let findUser = (data) => {
                return new Promise((resolve, reject) => {
                    UserModel.findOne({ 'userId': data.senderId })
                        .exec((err, result) => {
                            if (err) {
                                console.log(err)
                                logger.error(err.message, 'Socket: findUser', 10)
                                let apiResponse = response.generate(true, 'Failed To Find user Details', 500, null)
                                reject(apiResponse)
                            }
                            else if (check.isEmpty(result)) {
                                logger.error('null', 'Socket: findUser', 10)
                                let apiResponse = response.generate(true, 'No user found', 500, null)
                                reject(apiResponse)
                            } else {
                                
                                result.sentRequests.push(data.receiverId)
                                
                                logger.info('User Found', 'Socket: findUser', 10);
                                resolve(result);
                            }
                        })

                })
            }


            let updateUser = (trans) => {
                return new Promise((resolve, reject) => {
                    console.log(trans)

                    UserModel.update({ 'userId': data.senderId }, trans, (err, result) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'Socket: updateUser', 10)
                            let apiResponse = response.generate(true, 'Failed To update Details', 500, null)
                            reject(apiResponse)
                        }
                        else if (check.isEmpty(result)) {
                            logger.error('null', 'socket: updateUser', 10)
                            let apiResponse = response.generate(true, 'No user found', 500, null)
                            reject(apiResponse)
                        } else {

                            logger.info('User Found', 'socket: updateUser', 10);
                            resolve(result);
                        }
                    })


                })


            }



            let findReceiver = (res) => {
                return new Promise((resolve, reject) => {
                    UserModel.findOne({ 'userId': data.receiverId }, (err, result) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'Socket: findReceiver', 10)
                            let apiResponse = response.generate(true, 'Failed To Find user Details', 500, null)
                            reject(apiResponse)
                        }
                        else if (check.isEmpty(result)) {
                            logger.error('null', 'Socket : findReceiver', 10)
                            let apiResponse = response.generate(true, 'No user found', 500, null)
                            reject(apiResponse)
                        } else {
                       
                            result.receivedRequests.push(data.senderId)
                       
                            logger.info('User Found', 'Socket : findReceiver', 10);
                            resolve(result);
                        }
                    })

                })
            }

            let updateReceiver = (trans) => {
                return new Promise((resolve, reject) => {
                    console.log(trans)

                    UserModel.update({ 'userId': data.receiverId }, trans, (err, result) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'Socket : updateReceiver', 10)
                            let apiResponse = response.generate(true, 'Failed To update user Details', 500, null)
                            reject(apiResponse)
                        }
                        else if (check.isEmpty(result)) {
                            logger.error('null', 'Socket : updateReceiver', 10)
                            let apiResponse = response.generate(true, 'No user found', 500, null)
                            reject(apiResponse)
                        } else {

                            logger.info('User Found', 'Socket : updateReceiver', 10);
                            resolve(result);
                        }
                    })


                })


            }



            findUser(data)
                .then(updateUser)
                .then(findReceiver)
                .then(updateReceiver)
                .then((resolve) => {

                    let apiResponse = response.generate(false, 'Edit Save Successful', 200, resolve)
                    console.log(apiResponse)

                })
                .catch((err) => {
                    console.log(err);

                    res.send(err)
                })
            myIo.emit(data.senderId, data)
            myIo.emit(data.receiverId, data)


        })

        socket.on('accept-reject', (data) => {
            console.log("Accept/Reject friend Request")
            let data1 = data;
            console.log(data)

            let findUser = (data) => {
                return new Promise((resolve, reject) => {
                    UserModel.findOne({ 'userId': data1.senderId })
                        .exec((err, result) => {
                            if (err) {
                                console.log(err)
                                logger.error(err.message, 'Socket : findUser', 10)
                                let apiResponse = response.generate(true, 'Failed To Find user Details', 500, null)
                                reject(apiResponse)
                            }
                            else if (check.isEmpty(result)) {
                                logger.error('null', 'Socket : findUser', 10)
                                let apiResponse = response.generate(true, 'No user found', 500, null)
                                reject(apiResponse)
                            } else {
                                
                                for (let req = 0; req <= result.sentRequests.length; req++) {
                                    console.log(req)
                                    if (result.sentRequests[req] == data1.receiverId) {
                                        console.log(req)
                                        result.sentRequests.splice(req, 1)
                                    }
                                }
                                console.log(result.sentRequests)
                                if (data1.accept == true) {
                                    result.friends.push(data.receiverId)
                                }
                                // result.sentRequests.push(data.receiverId)
                            
                                logger.info('User Found', 'Socket : findUser', 10);
                                resolve(result);
                            }
                        })

                })
            }


            let updateUser = (trans) => {
                return new Promise((resolve, reject) => {
                    console.log(trans)

                    UserModel.update({ 'userId': data.senderId }, trans, (err, result) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'Socket : updateUser', 10)
                            let apiResponse = response.generate(true, 'Failed To update user Details', 500, null)
                            reject(apiResponse)
                        }
                        else if (check.isEmpty(result)) {
                            logger.error('null', 'Socket : updateUser', 10)
                            let apiResponse = response.generate(true, 'No user found', 500, null)
                            reject(apiResponse)
                        } else {

                            logger.info('User Found', 'Socket : updateUser', 10);
                            resolve(result);
                        }
                    })


                })


            }



            let findReceiver = (res) => {
                return new Promise((resolve, reject) => {
                    UserModel.findOne({ 'userId': data1.receiverId }, (err, result) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'Socket : findReceiver', 10)
                            let apiResponse = response.generate(true, 'Failed To Find user Details', 500, null)
                            reject(apiResponse)
                        }
                        else if (check.isEmpty(result)) {
                            logger.error('null', 'Socket : findReceiver', 10)
                            let apiResponse = response.generate(true, 'No user found', 500, null)
                            reject(apiResponse)
                        } else {
                         
                            for (let req = 0; req <= result.receivedRequests.length; req++) {
                                if (result.receivedRequests[req] == data1.senderId) {
                                    result.receivedRequests.splice(req, 1)
                                }
                            }
                            if (data1.accept == true) {

                                result.friends.push(data.senderId)
                            }
                            // result.receivedRequests.push(data.senderId)
                   
                            logger.info('User Found', 'Socket : findReceiver', 10);
                            resolve(result);
                        }
                    })

                })
            }

            let updateReceiver = (trans) => {
                return new Promise((resolve, reject) => {
                    console.log(trans)

                    UserModel.update({ 'userId': data.receiverId }, trans, (err, result) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'Socket : updateReceiver', 10)
                            let apiResponse = response.generate(true, 'Failed To update user Details', 500, null)
                            reject(apiResponse)
                        }
                        else if (check.isEmpty(result)) {
                            logger.error('null', 'Socket : updateReceiver', 10)
                            let apiResponse = response.generate(true, 'No user found', 500, null)
                            reject(apiResponse)
                        } else {

                            logger.info('User Found', 'Socket : updateReceiver', 10);
                            resolve(result);
                        }
                    })


                })


            }



            findUser(data)
                .then(updateUser)
                .then(findReceiver)
                .then(updateReceiver)
                .then((resolve) => {

                    let apiResponse = response.generate(false, 'Editing Saved Successful', 200, resolve)
                    console.log(apiResponse)
                    let senderRes = data1.senderId + "ar"
                    let receiverRes = data.receiverId + "ar";
                    myIo.emit(senderRes, data1)
                    socket.emit(receiverRes, data1)
                    console.log(data1)

                })
                .catch((err) => {
                    console.log(err);

                    res.send(err)
                })

        })

        socket.on('editEmit', (data) => {

            console.log("Editing List Socket call");
            console.log(data)
            UserModel.findOne({ 'userId': data.userId })
                .exec((err, result) => {
                    if (err) {
                        console.log(err)
                        logger.error(err.message, 'Socket : editEmit', 10)
                        let apiResponse = response.generate(true, 'Failed To Find user Details', 500, null)
                        reject(apiResponse)
                    }
                    else if (check.isEmpty(result)) {
                        logger.error('null', 'Socket : editEmit', 10)
                        let apiResponse = response.generate(true, 'No user found', 500, null)
                        reject(apiResponse)
                    } else {

                        logger.info('User Found', 'Socket : editEmit', 10);
                        myIo.emit(data.userId + "edit", data.message)
                        for (let friend = 0; friend < result.friends.length; friend++) {
                            console.log(result.friends[friend])
                            myIo.emit(result.friends[friend] + "edit", data.message)

                        }
                    }
                })


        })


    })
}

module.exports = {
    setServer: setServer
}
