const bookModel = require('../model/bookModel')
const reviewModel = require('../model/reviewModel')
const userModel = require('../model/userModel')
const middleware=require('../middleware/middleware')
const {isValidString,isValidName,isValidDate,isValidObjectId} = require('../validator/validator')

const createBook= async function(req,res){
    try{
        let data=req.body
        let{title,excerpt,userId,ISBN,category,subcategory,releasedAt}=data
        if(Object.keys(data).length==0) return res.status(400).send({status:false, message: "provide required information in the request body"})//check if data is available in req body    }
    
        //---------------------------keys in the req body--------------------------------

        if(!title) return res.status(400).send({status:false, message: "title is required in the request body"}) //check if title is mentioned 
        if(!excerpt) return res.status(400).send({status:false, message: "excerpt is required in the request body"}) //check if excerpt is mentioned 
        if(!userId) return res.status(400).send({status:false, message: "userId is required in the request body"}) //check if userId is mentioned 
        if(!ISBN) return res.status(400).send({status:false, message: "ISBN is required in the request body"}) //check if ISBN is mentioned 
        if(!category) return res.status(400).send({status:false, message: "category is required in the request body"}) //check if category is mentioned 
        if(!subcategory) return res.status(400).send({status:false, message: "subcategory is required in the request body"}) //check if subcategory is mentioned 
        if(!releasedAt) return res.status(400).send({status:false, message: "releasedAt is required in the request body"}) //check if releasedAt is mentioned 

         //---------------------------unique keys------------------------------
       
        let unique= await bookModel.findOne({isDeleted:false})
        if(!unique)return res.status(404).send({status:false, message: "book does not exist"}) 

        let uniqueTitle= await bookModel.findOne({title:title})
        if(uniqueTitle) return res.status(400).send({status:false, message: "title already exist"}) //unique title
        
        let uniqueISBN= await bookModel.findOne({ISBN:ISBN})
        if(uniqueISBN) return res.status(400).send({status:false, message: "ISBN already exist"}) //unique ISBN
        
        //--------------------------authorisation--------------------------------

        if (req.decodedToken.userId !== req.body.userId ) 
          return res.status(403).send({
            status: false,
            message:
              "Unauthorised Access: You CANNOT Create Books By using other User's ID (in Request-Body).",
          });
        
        //------------------------validation-------------------------

        if(!isValidString(title) || !isValidName(title) ) return res.status(400).send({status:false,message:"Please provide valid title"})  //it should be a valid title
        if(!isValidString(excerpt) || !isValidName(excerpt) ) return res.status(400).send({status:false,message:"Please provide valid excerpt"})  //it should be a valid excerpt
        if(!isValidObjectId(userId)) return res.status(400).send({status:false,message:"Please provide valid userId"})  //it should be a valid userId
        if(!isValidString(category) || !isValidName(category)) return res.status(400).send({status:false,message:"Please provide valid category"})  //it should be a valid category
        if( !isValidString(ISBN) || !isValidName(ISBN) ) return res.status(400).send({status:false,message:"Please provide valid ISBN"})  //it should be a valid ISBN
        if(!isValidDate(releasedAt) ) return res.status(400).send({status:false,message:"Please provide valid releasedAt"})  //it should be a valid releasedAt
        if(!isValidString(subcategory) || !isValidName(subcategory)) return res.status(400).send({status:false,message:"Please provide valid subcategory"})  //it should be a valid subcategory
       
        //-----------------------Create User data---------------------------

        let bookData = await bookModel.create(data)
        return res.status(201).send({ status: true, message: bookData })
        
    }
    catch(error){
        return res.status(500).send({ status: false, message: error.message }) 
    }
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

//                                        GET BOOKS FROM QUERY PARAMS

//----------------------------------------------------------------------------------------------------------------------------------------------------------



const getBooksQuery= async function (req, res){
try{

    //----------------------queryParams---------------------------------
    let data=req.query  
    let {userId,category,subcategory}=data

    if(Object.keys(data).length ==0) return res.status(400).send({status:false, message: "provide required information in query"})//check if data is available in query 
    
    //-------------------------anyCombinationOfQuery---------------------

    if(userId || category || subcategory ) {
      if (!isValidObjectId(userId)) {
        return res.status(400).send({
          status: false,
          message: "UserID is not Valid",
        });
      }
      if ( !isValidName(category)) {
        return res.status(400).send({
          status: false,
          message: "category is not Valid.",
        });
      }
      if ( !isValidName(subcategory)) {
        return res.status(400).send({
          status: false,
          message: "subcategory is not valid.",
        });
      }
    }

    //--------------------------crossCheckqueryWithMongo---------------------------

       let getBooks= await bookModel.find({userId:userId, isDeleted:false}).select({_id:1,title:1,excerpt:1,userId:1,category:1,reviews:1,releasedAt:1}).sort({title:1})
    if(!getBooks) return res.status(404).send({status:false, message: "book is deleted"})

    //-------------------------------authorisation------------------------

    // if (req.decodedToken.userId !== req.query.userId) 
    // return res.status(403).send({
    //   status: false,
    //   message:
    //     "Unauthorised Access: You CANNOT Create Books By using other User's ID (in Request-Body).",
    // });

    return res.status(200).send({ status: true,message: 'Books list', date:getBooks})

}
catch(error){
    return res.status(500).send({ status: false, message: error.message }) 
}
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

//                               GET BOOKS FROM PATH PARAMS

//----------------------------------------------------------------------------------------------------------------------------------------------------------


const getBooksByPathParams= async function (req, res){
    try{
         //--------------------------findReview-------------------------

         let bookId=middleware.authorisation.bookId

         let findReview= await reviewModel.find({bookId:bookId,isDeleted:false}).select({ __v: 0, isDeleted: 0 });
         if(!findReview) return res.status(404).send({status:false, message: "Review doesnt exist"})
        //--------------------------findBook-------------------------
        let findBook = await bookModel.findOne({isDeleted:false})
        if(!findBook) return res.status(404).send({status:false, message: "Book doesnt exist"})

        //-------------------objectDestructuring---------------------------
        const finalData = { ...findBook.toObject(), reviewsData: findReview };
        
        return res.status(200).send({ status: true, message: "'Books list'.", data: finalData})
        }
        catch(error){
        return res.status(500).send({ status: false, message: error.message }) 
      }
    }

       

    
//--------------------------------------------------------------------------------------------------------------------------------------------------------

//                        PUT(UPDATE) BOOKS FROM PATH PARAMS (BOOKID)

//----------------------------------------------------------------------------------------------------------------------------------------------------------

 
    const updateBook=async function(req,res){
        try{

         //-------------------------KEYS IN RESPONSE BODY------------
         let data= req.body
         let{ title,excerpt,releasedAt,ISBN}=data

         if (Object.keys(data).length==0) return res.status(400).send({status:false, message: "provide required information in the request body"})//check if data is available in req body    }

         if(!title || !excerpt || !releasedAt || !ISBN) return res.status(400).send({status:false, message: "title, excerpt, releasedAt or ISBN is missing from request body"}) //check if bookId is mentioned in path param
        
          //---------------------------validation--------------------------------

        if(!isValidString(title) || !isValidName(title) ) return res.status(400).send({status:false,message:"Please provide valid title"})  //it should be a valid title
        if(!isValidString(excerpt) || !isValidName(excerpt) ) return res.status(400).send({status:false,message:"Please provide valid excerpt"})  //it should be a valid excerpt
        if(!isValidDate(releasedAt) ) return res.status(400).send({status:false,message:"Please provide valid releasedAt"})  //it should be a valid releasedAt
       
        let findBookIsDeleted= await bookModel.findOne({isDeleted:false})
        if(!findBookIsDeleted)  return res.status(404).send({status: false, message:"book is deleted"});

        //---------------------------unique title&&ISBN------------------------------
      
        let findBooktitle= await bookModel.findOne({title:title})
        if(findBooktitle)return res.status(400).send({status:false, message: "title already exist"}) //unique title
          
        let findISBN= await bookModel.findOne({ISBN:ISBN})
        if(findISBN) return res.status(400).send({status:false, message: "ISBN already exist"}) //unique ISBN  
        
        

        //------------------------findAndUpdate---------------------------

        let bookId=middleware.authorisation
        bookId=req.params.bookId
        
        let findAndUpdateBook = await bookModel.findByIdAndUpdate(
            {_id:bookId},
           {$set:{
            title:data.title,
            excerpt:data.excerpt,
            releasedAt:data.releasedAt,
            ISBN:data.ISBN
           }},
           {new:true})

          return res.status(200).send({ status: true, message: findAndUpdateBook });

        }
        catch(error){
            return res.status(500).send({ status: false, message: error.message }) 
        }
    }

    
//--------------------------------------------------------------------------------------------------------------------------------------------------------

//                                   DELETE BOOKS 

//--------------------------------------------------------------------------------------------------------------------------------------------------------

const deleteParam = async function(req, res){
    try{
       let bookId=middleware.authorisation.bookId
       bookId=req.params.bookId

       //--------------------------findBook-------------------------
       let findBook= await bookModel.findOne({isDeleted:false})
       if(!findBook) return res.status(404).send({status: false, message:"book is deleted"});

       //------------------------findAndUpdate---------------------------

       let findAndDeleteBook = await bookModel.findByIdAndUpdate(
           {_id:bookId,isDeleted:false},
          {$set:{
           isDeleted:true
          }},
          {new:true} )

          return res.status(200).send({ status: true, message: findAndDeleteBook });

    }
    catch(error){
        return res.status(500).send({ status: false, message: error.message }) 
    }
}

module.exports={createBook,getBooksQuery,getBooksByPathParams,updateBook,deleteParam}