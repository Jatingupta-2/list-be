'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let userSchema = new Schema({
  userName:{
    type:String,
    default:''
  },
  friends:[{
    type:String,
    default:''
  }],
  sentRequests:[{
    type:String,
    default:''
  }],
  receivedRequests:[{
    type:String,
    default:''
  }],


  
  userId: {
    type: String,
    default: '',
    index: true,
    unique: true
  },
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    default: 'passskdajakdjkadsj'
  },
  email: {
    type: String,
    default: ''
  },
  mobileNumber: {
    type: Number,
    default: 0
  },
  countryCode:{
    type:String,
    default:''
  },
  createdOn :{
    type:Date,
    default:""
  }


})


mongoose.model('User', userSchema);