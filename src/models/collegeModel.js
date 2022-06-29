const mongoose = require('mongoose')

const collegeSchema = new mongoose.Schema ({
    name: {
        type: String,
        require: true,
        unique: true,
        trim: true,
    },  
    fullName: {
        type: String,
        require: true,
        trim: true
    }, 
    logoLink: {
        type: String,
        require: true,
        validate : {
            validator: function(logoLink){
               return /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/.test(logoLink) 
            }
        }
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
    
});

module.exports = mongoose.model ('collegeDB', collegeSchema)


