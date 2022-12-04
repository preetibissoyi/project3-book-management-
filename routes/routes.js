const express = require('express');
const router = express.Router();
const userController=require('../controller/userController')
const bookController= require('../controller/bookController')
const reviewController= require('../controller/reviewController')
const middleware=require('../middleware/middleware')

//---------------------USER------------------------------
router.post("/register",userController.createUser)

router.post("/login",userController.login)

//-------------------BOOKS-------------------------------

router.post("/books", middleware.authentication, bookController.createBook)

router.get("/books",middleware.authentication, bookController.getBooksQuery)

router.get("/books/:bookId", middleware.authentication, middleware.authorisation, bookController.getBooksByPathParams)

router.put("/books/:bookId", middleware.authentication,  middleware.authorisation, bookController.updateBook)

router.delete("/books/:bookId", middleware.authentication,  middleware.authorisation, bookController.deleteParam)

//-------------------REVIEW-------------------------------

router.post("/books/:bookId/review", reviewController.createReview)

router.put("/books/:bookId/review/:reviewId", middleware.middleForPath, reviewController.updateReview)

router.delete("/books/:bookId/review/:reviewId",middleware.middleForPath, reviewController.deleteReview)





module.exports = router;
