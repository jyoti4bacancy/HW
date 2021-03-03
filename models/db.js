const mongoose=require('mongoose')
const userSchema=new mongoose.Schema({ 
    name:{type:String,
    required:true,
    trim:true,
    lowercase:true
   },
    password:{
    type:String,
    required:true,
   
    trim:true,
    minlength:7
  },
          email:{
          type:String,
          trim:true, unique:true,
          lowercase:true
        }})

        
const HwUser=mongoose.model('HwUser',userSchema)
module.exports=HwUser;