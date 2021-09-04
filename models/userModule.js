const mongoose = require('mongoose');
const randToken = require('rand-token');

const userSchema = new mongoose.Schema({
    name : {
        type:String,
        require: true
    },
    emailId : {
        type : String,
        require : true
    },
    password : {
        type : String,
        require : true
    },
    token : {
        type : String,
        default : function(){
            return randToken.generate(48);
        }
    },
    isValid : {
        type : Boolean,
        default : false
    }

})

module.exports = mongoose.model('User', userSchema);