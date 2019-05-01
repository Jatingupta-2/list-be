const mongoose = require('mongoose');
const Schema = mongoose.Schema
const time = require('./../libs/timeLib');

let HistorySchema = new Schema
    ({
        listId: {
            type: String
        },


        lists: [{
            listId: {
                type: String
            },userId:{
                type:String
            },
            listName:{
                type:String
            },
    

            item: [{
                name: {
                    type: String,
                    default: ''
                },
                open: {
                    type: Boolean,
                    default: true
                },
                subitems: [{
                    type: String
                }]
            }]
        }]
    }

    )

module.exports = mongoose.model('History', HistorySchema); 