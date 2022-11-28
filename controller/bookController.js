const bookModel = require('../model/bookModel')
const userModel = require('../model/userModel')
const {isValidString,isValidName,isValidSubcategory,isValidDate,isValidObjectId} = require('../validator/validator')

const createBook= async function(req,res){
    try{
        let data=req.body
        let{title,excerpt,userId,ISBN,category,subcategory,releasedAt}=data

        if(Object.keys(data).length==0) return res.status(400).send({status:false, message: "provide required information in the request body"})//check if data is available in req body    }
    
        //---------------------------title--------------------------------

        if(!title) return res.status(400).send({status:false, msg: "title is required in the request body"}) //check if title is mentioned 
        if(!isValidString(title) || !isValidName(title) ) return res.status(400).send({status:false,message:"Please provide valid title"})  //it should be a valid title
        
        let uniqueTitle= await bookModel.findOne({title:title})
        if(uniqueTitle) return res.status(400).send({status:false, msg: "title already exist"}) //unique title

        //---------------------------excerpt------------------------------
    
        if(!excerpt) return res.status(400).send({status:false, msg: "excerpt is required in the request body"}) //check if excerpt is mentioned 
        if(!isValidString(excerpt) || !isValidName(excerpt) ) return res.status(400).send({status:false,message:"Please provide valid excerpt"})  //it should be a valid excerpt

        //--------------------------userId--------------------------------

        let id =await userModel.findById({_id:userId})
        if(!id) return res.status(400).send({status:false, msg: "userId already exist"})//checking userId

        if(!userId) return res.status(400).send({status:false, msg: "userId is required in the request body"}) //check if userId is mentioned 
        if(!isValidObjectId(userId)) return res.status(400).send({status:false,message:"Please provide valid userId"})  //it should be a valid userId

        //-------------------------ISBN----------------------------

        if(!ISBN) return res.status(400).send({status:false, msg: "ISBN is required in the request body"}) //check if ISBN is mentioned 
       // if(!isValidString(ISBN) || !isValidName(ISBN) ) return res.status(400).send({status:false,message:"Please provide valid ISBN"})  //it should be a valid ISBN

        let uniqueISBN= await bookModel.findOne({ISBN:ISBN})
        if(uniqueISBN) return res.status(400).send({status:false, msg: "ISBN already exist"}) //unique ISBN

        //------------------------category-------------------------

        if(!category) return res.status(400).send({status:false, msg: "category is required in the request body"}) //check if category is mentioned 
        if(!isValidString(category) || !isValidName(category)) return res.status(400).send({status:false,message:"Please provide valid category"})  //it should be a valid category

        //------------------------subcategory-------------------------

        if(!subcategory) return res.status(400).send({status:false, msg: "subcategory is required in the request body"}) //check if subcategory is mentioned 
        if(!isValidSubcategory(subcategory)) return res.status(400).send({status:false,message:"Please provide valid subcategory"})  //it should be a valid subcategory

        //------------------------review-------------------------

        if(!releasedAt) return res.status(400).send({status:false, msg: "releasedAt is required in the request body"}) //check if releasedAt is mentioned 
        if(!isValidDate(releasedAt) ) return res.status(400).send({status:false,message:"Please provide valid releasedAt"})  //it should be a valid releasedAt

        //-----------------------Create User data---------------------------
        let bookData = await bookModel.create(data)
        return res.status(201).send({ status: true, msg: bookData })
        
    }
    catch(error){
        return res.status(500).send({ status: false, message: error.message }) 
    }
}

const getBooksQuery= async function (req, res){
try{
    let data=req.query  

    if(Object.keys(data).length==0) return res.status(400).send({status:false, message: "provide required information in query"})//check if data is available in query 
    
    let getBooks= await bookModel.find({isDeleted:false})
    if(!getBooks) return res.status(400).send({status:false, message: "book is deleted"})
      
    let obj= {}

    obj._id=getBooks._id
    obj.title=getBooks.title
    obj.excerpt=getBooks.excerpt
    obj.userId=getBooks.userId
    obj.category=getBooks.category
    obj.releasedAt=getBooks.releasedAt
    obj.reviews=getBooks.reviews

    return res.status(200).send({ status: true,message: 'Books list', date:obj })

}
catch(error){
    return res.status(500).send({ status: false, message: error.message }) 
}
}


module.exports={createBook,getBooksQuery}