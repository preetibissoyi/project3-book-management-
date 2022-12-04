const jwt=require('jsonwebtoken')
const bookModel= require('../model/bookModel')
const reviewModel=require('../model/reviewModel')
const {isValidObjectId} = require('../validator/validator')

const authentication = async (req, res, next) => {
    try {
      const token = req.headers["x-api-key"]; 
      if (!token) {
        return res
          .status(400)
          .send({ status: false, message: "Token must be present." });
      }
  
      jwt.verify(
        token,
        "group23",
        (err, decodedToken) => {
          if (err) {
            return res.status(401).send({ status: false, message: err.message });
          }
          req.decodedToken = decodedToken;
          next();
        }
      );
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
    }
  };

  const authorisation = async (req, res, next) => {
    try {
        
      //Validation - If Request-Params has <bookId>.
      if (req.params.bookId) {
        //Validate that <bookId> is a Valid Mongoose ObjectId.
        if (!isValidObjectId(req.params.bookId)) {
          return res.status(400).send({
            status: false,
            message: "BookID NOT a Valid Mongoose ObjectId.",
          });
        }
  
        //Find Books with <filter>.
        const bookFound = await bookModel.findOne({ _id: req.params.bookId });
  
        //Error: NO Books Found.
        if (!bookFound) {
          return res.status(404).send({
            status: false,
            message: `NO Books Found having <bookId: ${req.params.bookId}>.`,
          });
        }
  
        //Verify User.
        if (req.decodedToken.userId !== bookFound.userId.toString()) {
          return res.status(403).send({
            status: false,
            message:
              "Unauthorised Access: You CANNOT <Edit: Update OR Delete> Books of other Users.",
          });
        }
      }
  
      //IF User Authorised then Call <next()>.
      next();
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
    }
  };
 
  const middleForPath=async function(req,res,next){
    try{
 //-------------------------KEYS IN PARAM--------------

 let bookId= req.params.bookId
 let reviewId=req.params.reviewId

 if(!bookId) return res.status(400).send({status:false, msg: "bookId is required in the path param"}) //check if bookId is mentioned in path param
 if(!reviewId) return res.status(400).send({status:false, msg: "reviewId is required in the path param"}) //check if reviewId is mentioned in path param

  if(!isValidObjectId(bookId) || !isValidObjectId(reviewId)) return res.status(400).send({status:false,message:"Please provide valid bookId and reviewId"})  //it should be a valid reviewId and bookId

//--------------------------findBook-------------------------

let checkBookId= await bookModel.findById({_id:bookId, isdeleted:false})
if(!checkBookId) return res.status(400).send({status:false, msg: "book does'nt exist"})//checking bookId

let isReviewDelete= await reviewModel.findById({_id:reviewId})
if(!isReviewDelete.isDeleted===false) return res.status(400).send({status: false, msg:"review is deleted"})

next()
    }
    catch(error){
        return res.status(500).send({ status: false, message: error.message }) 
    }
}
 


module.exports={authentication, authorisation,middleForPath}