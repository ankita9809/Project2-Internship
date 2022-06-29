const mongoose = require('mongoose')
const objectId = mongoose.Schema.Types.ObjectId

const internSchema = new mongoose.Schema ({
    isDeleted: {
        type: Boolean,
        default: false
    },
    name: {
        type: String, 
        require: true, 
        trim: true,
    }, 
    email: {            
        type: String,
        require: true,
        unique: true,
        trim: true,
        validate : {
            validator: function(email){
               return (/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))
            }
        }
    }, 
    mobile: {           // validation required
        type: String,
        unique: true,
        require: true,
        trim: true, 
    },
    collegeId:{
        type: objectId,
        ref: "collegeDB",
    }
   
    
});

module.exports = mongoose.model ('internDb', internSchema)