const reviewModel=require('../model/reviewModel')
const bookModel=require('../model/bookModel')
const {isValidString, isValidRating, isValidName, isValidObjectId, isValidDate} = require('../validator/validator')
const { middleForPath } = require('../middleware/middleware')


const createReview= async function(req,res){
    try{

        //----------------------pathParam-------------------------
        let bookId= req.params.bookId
        if(!bookId) return res.status(400).send({status:false, message: "bookId is required in the path param"}) //check if bookId is mentioned in path param
       
        //----------------------requestBody-------------------------
        let data=req.body
        let{ reviewedBy, rating, review, reviewedAt}=data
        if(Object.keys(data).length==0) return res.status(400).send({status:false, message: "data is required in the request body"})//check if the request body is empty
        
        //------------------------keys in req body----------------------------

        if(!reviewedBy) return res.status(400).send({status:false, message: "reviewedBy is required in the request body"}) //check if reviewedBy is mentioned 
        if(!rating) return res.status(400).send({status:false, message: "rating is required in the request body"}) //check if rating is mentioned 
        if(!review) return res.status(400).send({status:false, message: "review is required in the request body"}) //check if review is mentioned 
        if(!reviewedAt) return res.status(400).send({status:false, message: "reviewedAt is required in the request body"}) //check if reviewedAt is mentioned 
        
         //------------------------validation----------------------------------

        if(!isValidObjectId(bookId)) return res.status(400).send({status:false,message:"Please provide valid bookId"})   //it should be a valid bookId
        if(!isValidString(reviewedBy) || !isValidName(reviewedBy) ) return res.status(400).send({status:false,message:"Please provide valid reviewedBy"})//it should be a valid reviewedBy
        if(!isValidRating(rating) ) return res.status(400).send({status:false,message:"Please provide valid rating"})  //it should be a valid rating
        if(!isValidString(review) || !isValidName(review) ) return res.status(400).send({status:false,message:"Please provide valid review"})//it should be a valid review
        if(!isValidDate(reviewedAt) ) return res.status(400).send({status:false,message:"Please provide valid reviewedAt"})  //it should be a valid reviewedAt
         
        //-----------------------check bookId && isDeleted:false----------------------------

        let checkBookId= await bookModel.findOne({_id:bookId, isDeleted:false})
        if(!checkBookId) return res.status(404).send({status:false, message: "book does'nt exist"})//checking bookId

        //--------------------------update review----------------------------

        if(review){
            let findThatBookAndUpdate=await bookModel.findByIdAndUpdate(
                {_id:bookId},
                {$inc: { reviews: 1 }},
                {new:true}
                )
        }

        //------------------------createReview-----------------------------
        let createReview= await reviewModel.create(data)
        return res.status(201).send({ status: true, message:"success", data: createReview})
    }
    catch(error){
        return res.status(500).send({ status: false, message: error.message }) 
    }
}


     //-----------------------------------PUT-------------------------------

     const updateReview=async function(req, res){
        try{
         //-------------------------KEYS IN RESPONSE BODY------------

         let data= req.body
         let{ review, rating, reviewedBy}=data
         if (Object.keys(data).length==0) return res.status(400).send({status:false, message: "provide required information in the request body"})//check if data is available in req body    }

         if(!review || !rating || !reviewedBy) return res.status(400).send({status:false, msg: "review, rating or reviewedBy is missing from request body"}) //check if bookId is mentioned in path param
        
         let reviewId=middleForPath
         reviewId=req.params.reviewId
  
         //---------------------validation----------------------------

         if(!isValidRating(rating) ) return res.status(400).send({status:false,message:"Please provide valid rating"})  //it should be a valid rating
         if(!isValidString(review) || !isValidName(review) ) return res.status(400).send({status:false,message:"Please provide valid review"})//it should be a valid review
         if(!isValidString(reviewedBy) || !isValidName(reviewedBy) ) return res.status(400).send({status:false,message:"Please provide valid reviewedBy"})//it should be a valid reviewedBy
          
        //------------------------findAndUpdate---------------------------

        let findAndUpdateReview = await reviewModel.findOneAndUpdate(
            {_id: reviewId},
           {$set:{
            review:data.review,
            rating:data.rating,
            reviewedBy:data.reviewedBy
           }},
           {new:true} )
           
          return res.status(200).send({ status: true, message: findAndUpdateReview });

        }
        catch(error){
            return res.status(500).send({ status: false, message: error.message }) 
        }
     }

const deleteReview= async function(req,res){
    try{
       let reviewId=middleForPath
       reviewId=req.params.reviewId

       let bookId=middleForPath
       bookId=req.params.bookId
        //------------------------findAndUpdate---------------------------
        
       let findAndDeleteReview = await reviewModel.findOneAndUpdate(
           {_id:reviewId},{$set:{isDeleted:true}},{new:true} )

      if(findAndDeleteReview){
            let findThatBookAndUpdate=await bookModel.findByIdAndUpdate(
                {_id:bookId},{$inc: { reviews: -1 }}, {new:true} )
        }

          return res.status(200).send({ status: true, message: findAndDeleteReview });
    }
    catch(error){
        return res.status(500).send({ status: false, message: error.message }) 
    }
}


module.exports={createReview, updateReview, deleteReview}