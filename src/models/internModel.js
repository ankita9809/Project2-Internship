const mongoose = require('mongoose')
const objectId = mongoose.Schema.Types.ObjectId

const internSchema = new mongoose.Schema ({
    name: {
        type: String,
        require: true,
        unique: true,
        trim: true,
    }, 
    email: {            //validation required
        type: String,
        require: true,
        unique: true,
        trim: true
    }, 
    mobile: {           // validation required
        type: Number,
        unique: true,
        require: true,
        trim: true
    },
    collegeId:{
        type: objectId,
        ref: "collegeDB",
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
    
}, {timestamps : true});

module.exports = mongoose.model ('internDb', internSchema)