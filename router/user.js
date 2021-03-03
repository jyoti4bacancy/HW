const express=require('express')
require('dotenv').config()
const router=new express.Router()
const HwUser = require('../models/db')
const nodemailer=require('nodemailer')
const { generateAccessToken, authenticateJWT}=require('../middleware/auth')
var OTP=0
router.post('/signup', async (req, res) => {
    const user = new HwUser(req.body);
    try {
        const result = await user.save()

        res.status(200).send(result)
    }
    catch (e) {
        res.status(400).send();
    }

})

router.post('/login', async (req, res) => {
    try {
        const user = await HwUser.findOne({ email: req.body.email, password: req.body.password })
         if(user){
        const token = await generateAccessToken({ email: req.body.email });
        res.json( token)
        //    return  res.send({user,token}) 
         }
         else{
             res.send("username or password incorrect")
         }
    }
    catch (e) {
        return res.status(400).send(e);
    }

})

router.post('/forget_pwd',authenticateJWT, async(req,res)=>{
    const user = await HwUser.findOne({ email: req.body.email})
    if(!user){
          return res.status(401).send("email id is invalid!")
       }

       var transport = nodemailer.createTransport({
        service: "gmail",
        auth:{
          user: process.env.auth_user,
          pass: process.env.auth_password,
        },
      });
       OTP=Math. floor(100000 + Math. random() * 900000);
      var msg = "Dear User,\nYour OTP is: "+OTP +"\n Thank You!!";
 
      var mailOptions = 
      {
        from: "sharmajyoti4699@gmail.com",
        to: user.email,
        subject: "Forgot Password",
        text: msg
      };

     transport.sendMail(mailOptions,  function(err,data)
     {        
       if (data) 
       {
         res.send(data)
       }
       else{
         res.send(err)
       }
       
     } )
    })

    router.post('/checkOtp',async(req,res)=>{
      console.log(OTP);
      if(OTP===req.body.OTP){
        const user = await HwUser.findOne({ email: req.body.email})
           var transport = nodemailer.createTransport({
            service: "gmail",
            auth:{
              user: process.env.auth_user,
              pass: process.env.auth_password,
            },
          });
           
          var msg = "Dear User,\nYour password  is: "+user.password +". please reset your password to protect it.\n  Thank You!!";
     
          var mailOptions = 
          {
            from: "sharmajyoti4699@gmail.com",
            to: user.email,
            subject: "Forgot Password",
            text: msg
          };
    
         transport.sendMail(mailOptions,  function(err,data)
         {        
           if (data) 
           {
            return res.send(data)
           }
             res.send(err)
         } )
       }
      else{
       return res.send('otp is wrong.')
     }
    })

router.post('/reset',authenticateJWT,async(req,res)=>{
    const user = await HwUser.findOne({ email: req.body.email})
      if(!user)
      {
        return res.status(401).send('invalid email id!')
      }        
      var transport=nodemailer.createTransport({
        service:"gmail",
        auth:{
          user:process.env.auth_user,
          pass:process.env.auth_password
        }
      })

      var mailOptions={
        from:"sharmajyoti4699@gmail.com",
        to:user.email,
        subject:"reset password",
       text:"Dear "+user.name+ ", please click below link to reset your password. \n\n http://localhost:3000/reset"
      }
        var new_password=req.body.new_password;
      transport.sendMail(mailOptions,async function(err,data){
        if(err){
        return   res.send(err)
        }
          const updateUser=await HwUser.findOneAndUpdate({email:user.email},{password:new_password})
          if(updateUser){
           return  res.send('reset done!')
          }
          res.status(500).send('something went wrong!')

      })

})



router.post('/user',authenticateJWT, async (req, res) => {
    try { 

        res.send({
            message:"welcome user!"
        })
     }
    catch (e) {
        return res.status(400).send(e);
    }
})

module.exports=router