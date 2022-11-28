const jwt = require("jsonwebtoken");
let userModel = require("../model/userModel")


const auth = async function(req,res, next) {
try{
 
 let token = req.headers["x-api-key"]

if(!token) return res.send({ status:false, msg: "token is not available"})

let decodedToken = jwt.verify(token, "project3");
if (!decodedToken) return res.status(403).send({status: false, msg: "token is invalid"});

  next()

}
catch(err){
 return res.status(500).send({status:false, msg: err.msg})
}
}

module.exports.auth=auth