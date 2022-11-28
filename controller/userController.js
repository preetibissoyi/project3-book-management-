const userModel=require('../model/userModel')
const {isValidString,isValidName,isValidPhone, isValidPassword, isValidEmail} = require('../validator/validator')
const jwt=require("jsonwebtoken")

const createUser= async function(req, res){
    try{
        let data= req.body
        let { title,name, phone, email, password, address}=data
     
        
        if(Object.keys(data).length==0) return res.status(400).send({status:false, msg: "data is required in the request body"})//check if the request body is empty
        

        //------------------------title----------------------------

       
        if(!title) return res.status(400).send({status:false, msg: "title is required in the request body"}) //check if title is mentioned 
        if(!isValidString(title) || !isValidName(title) ) return res.status(400).send({status:false,message:"Please provide valid title"})   //it should be a valid title
        
        //--------------------------name----------------------------

        if(!name) return res.status(400).send({status:false, msg: "name is required in the request body"}) //check if name is mentioned 
        if(!isValidString(name) || !isValidName(name) ) return res.status(400).send({status:false,message:"Please provide valid name"})//it should be a valid name
        
        //---------------------------phone---------------------------
        
        if(!phone) return res.status(400).send({status:false, msg: "phone is required in the request body"}) //check if phone is mentioned
        if(!isValidPhone(phone) ) return res.status(400).send({status:false,message:"Please provide valid phone"})//it should be a valid phone
      
        let uniquePhone= await userModel.findOne({phone:phone})
       if(uniquePhone) return res.status(400).send({status:false, message:"phone number already exist"})   //unique phone number

        //---------------------------email----------------------------

        
        if(!email) return res.status(400).send({status:false, msg: "email is required in the request body"})//check if email is mentioned 
      
        if(!isValidEmail(email) ) return res.status(400).send({status:false,message:"Please provide valid email"})  //it should be a valid email
        
        let uniqueEmail= await userModel.findOne({ email: email })
        if(uniqueEmail) return res.status(400).send({status:false, message:"Email ID already exist"})//unique phone number

        //-----------------------------------password------------------------------------

        
        if(!password) return res.status(400).send({status:false, msg: "password is required in the request body"})//check if password is mentioned 

         if(!isValidPassword(password) ) return res.status(400).send({status:false, message:"Please provide valid password"})//it should be a valid password
        
         let uniquePassword= await userModel.findOne({ password: password })
         if(uniquePassword) return res.status(400).send({status:false, message:"password already exist"})//unique password number
         //----------------------------------address---------------------------------------

         
        if(!address) return res.status(400).send({status:false, msg: "address is required in the request body"})//check if address is mentioned
        
        if(!isValidString(address) || !isValidName(name) ) return res.status(400).send({status:false,message:"Please provide valid address"})//it should be a valid address
        
            
            if(address) {
                var {street, city, pincode}=address
            }

            //-----------------------street------------------------------

        if(!street) return res.status(400).send({status:false, msg: "street is required in the request body"})//check if street is mentioned 
        if(!isValidString(street) || !isValidName(street) ) return res.status(400).send({status:false,message:"Please provide valid street"}) //it should be a valid street
        
        //-------------------------city--------------------------------------

        if(!city) return res.status(400).send({status:false, msg: "city is required in the request body"})   //check if city is mentioned 
        if(!isValidString(city) || !isValidName(city) ) return res.status(400).send({status:false,message:"Please provide valid city"})//it should be a valid city
        
        //-------------------------pincode---------------------------------
      
        if(!pincode) return res.status(400).send({status:false, msg: "pincode is required in the request body"})  //check if pincode is mentioned 
        if(!isValidString(pincode) || !isValidName(pincode) ) return res.status(400).send({status:false,message:"Please provide valid pincode"})//it should be a valid pincode
        
    
        //-----------------------Create User data---------------------------
        let userData = await userModel.create(data)
        return res.status(201).send({ status: true, msg: userData })
        
    }  
    catch(error){
        return res.status(500).send({ status: false, message: error.message }) 
    }       
}

// const loginUser = async function (req, res) {
//     try {

//         let data = req.body.email
//         let data1 = req.body.password

//         //-----------------check email && password in request body------------------------------------

//         if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "Email is required in the request body" })

//         if (Object.keys(data1).length == 0) return res.status(400).send({ status: false, msg: "Password is required in the request body" })

//         //-----------------check email && password exist in mongodb------------------------------------

//         let emailPassword = await userModel.findOne({ email: data, password: data1 })
//         if (!emailPassword) return res.status(400).send({ status: false, msg: "Email does not exist" })


//         //generate token 

//         let token=jwt.sign(
//             {
//              login:emailPassword._id.toString()
//         },
//         'project3'
//         )

//         return res.status(200).send({status:true, msg:token})

//     }
//     catch (error) {
//         return res.status(500).send({ status: false, message: err.message })
//     }
// }

const login=async function(req, res){
    try{
        let email1=req.body.email
    let password1=req.body.password
    
    let loginByEmailPassword = await authorModel.findOne({email:email1, password:password1})
    
    if(!loginByEmailPassword){
        return res.status(404).send({status:false, msg:"email and password are incorrect"})
    }
    

    let token=jwt.sign(
        {
            login:loginByEmailPassword._id,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60, 
        },
        "group4"
    )
    //res.setHeader("x-api-key", token);
    res.status(200).send({status:true, message: "Token Generated Successfully.", data: token})
    }
    catch(err){
        res.status(500).send({status:false, msg:err.msg})
    }
}

module.exports={createUser,login}


