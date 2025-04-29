const mongoose = require('mongoose');
const BlackListTokenSchema = new mongoose.Schema({
          token:{
             type:String,
             required:true,
             unique:true
          },
          createdAt:{
            type:Date,
            default:Date.now,
            expires:86400 //24 hours
          }
})

const BlacklistTokenModel = mongoose.model("blacklisttoken",BlackListTokenSchema);

module.exports = BlacklistTokenModel;