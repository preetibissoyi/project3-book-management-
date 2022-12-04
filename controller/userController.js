const userModel=require('../model/userModel')
const {isValidString,isValidName,isValidPhone, isValidTitle, isValidPassword, isValidEmail} = require('../validator/validator')
const jwt=require("jsonwebtoken")

const createUser= async function(req, res){
    try{
        //--------------------------keys in req body----------------------------

        let data= req.body
        let { title,name, phone, email, password, address}=data
       
        if(address) {
            var {street, city, pincode}=address
        }
       
        if(Object.keys(data).length==0) return res.status(400).send({status:false, msg: "data is required in the request body"})//check if the request body is empty
        
        //------------------------title----------------------------

        if(!title) return res.status(400).send({status:false, message: "title is required in the request body"}) //check if title is mentioned 
        if(!name) return res.status(400).send({status:false, message: "name is required in the request body"}) //check if name is mentioned 
        if(!phone) return res.status(400).send({status:false, message: "phone is required in the request body"}) //check if phone is mentioned
        if(!email) return res.status(400).send({status:false, message: "email is required in the request body"})//check if email is mentioned 
        if(!password) return res.status(400).send({status:false, message: "password is required in the request body"})//check if password is mentioned 
        if(!address) return res.status(400).send({status:false, message: "address is required in the request body"})//check if address is mentioned
        if(!pincode) return res.status(400).send({status:false, message: "pincode is required in the request body"})  //check if pincode is mentioned 
        if(!street) return res.status(400).send({status:false, message: "street is required in the request body"})//check if street is mentioned 
        if(!city) return res.status(400).send({status:false, message: "city is required in the request body"})   //check if city is mentioned

        //-----------------------------------validation----------------------------------------------
        
        if(!isValidTitle(title) ) return res.status(400).send({status:false,message:"Please provide valid title"})   //it should be a valid title
        if(!isValidString(name) || !isValidName(name) ) return res.status(400).send({status:false,message:"Please provide valid name"})//it should be a valid name
        if(!isValidPhone(phone) ) return res.status(400).send({status:false,message:"Please provide valid phone"})//it should be a valid phone
        if(!isValidEmail(email) ) return res.status(400).send({status:false,message:"Please provide valid email"})  //it should be a valid email
        if(!isValidPassword(password) || !isValidString(password) ) return res.status(400).send({status:false, message:"Please provide valid password"})//it should be a valid password
        if(!isValidString(city) || !isValidName(city) ) return res.status(400).send({status:false,message:"Please provide valid city"})//it should be a valid city
        if(!isValidString(street) || !isValidName(street) ) return res.status(400).send({status:false,message:"Please provide valid street"}) //it should be a valid street
        if(!isValidString(pincode) || !isValidName(pincode) ) return res.status(400).send({status:false,message:"Please provide valid pincode"})//it should be a valid pincode
     
        //---------------------------unique keys---------------------------
                
       let uniquePhone= await userModel.findOne({phone:phone})
       if(uniquePhone) return res.status(400).send({status:false, message:"phone number already exist"})   //unique phone number
        
       let uniqueEmail= await userModel.findOne({ email: email })
       if(uniqueEmail) return res.status(400).send({status:false, message:"Email ID already exist"})//unique phone number

        //-----------------------Create User data---------------------------

        let userData = await userModel.create(data)
        return res.status(201).send({ status: true, message: userData })
    }  
    catch(error){
        return res.status(500).send({ status: false, message: error.message }) 
    }       
}



const login=async function(req, res){
    try{
        let email1=req.body.email
    let password1=req.body.password

    //-------------------------password&&email----------------------------

    if(!email1) return res.status(400).send({status:false, message: "email is required in the request body"})//check if email is mentioned 
    if(!password1) return res.status(400).send({status:false, message: "password is required in the request body"})//check if password is mentioned 
    
    //-------------------------matching password&&email----------------------------
    let loginByEmailPassword = await userModel.findOne({email:email1, password:password1})
    if(!loginByEmailPassword) return res.status(400).send({status:false, message:"email or password are incorrect"})
    
    let token=jwt.sign(
        {
            userId:loginByEmailPassword._id,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60, 
        },
        "group23"
    )
    res.setHeader("x-api-key", token);
    res.status(200).send({status:true, message: "Token Generated Successfully.", data: token})
    }
    catch(err){
        res.status(500).send({status:false, message:err.msg})
    }
}

module.exports={createUser,login}


