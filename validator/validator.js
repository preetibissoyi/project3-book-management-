const mongoose = require('mongoose')

//=========================validation for email===================================

const isValidEmail = function (value) {
  let emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/;
  if (emailRegex.test(value)) return true;
};

//==========================validation for string==================================

const isValidString = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

//==============================validation for name===============================

const isValidName = function (name) {
  if (/^[a-zA-Z, ]+$/.test(name)) {
    return true;
  }
};

//--------------------------------subcategory--------------------------------------------

const isValidSubcategory=function(subcategory){
  if (/^[a-zA-Z0-9\- ]*$/.test(subcategory)){
    return true;
  }
  }

  //--------------------------------date(format:mm/dd/yyyy)--------------------------------------------

const isValidDate= function(Date){
  if (/^(?:(?:(?:0?[13578]|1[02])(\/|-|\.)31)\1|(?:(?:0?[1,3-9]|1[0-2])(\/|-|\.)(?:29|30)\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:0?2(\/|-|\.)29\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:(?:0?[1-9])|(?:1[0-2]))(\/|-|\.)(?:0?[1-9]|1\d|2[0-8])\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/.test(Date)){
    return true;
  }
} 


//==============================validation for mobile ===============================

const isValidPhone = function (phone) {
 if (/^[0]?[789]\d{9}$/.test(phone)){
    return true
 }
}
//===========================validation for image===================================

const isValidImage = function (image) {
  if (/^(https\:\/\/.*\.(?:png|jpg))/.test(image)){
     return true
  }
 }

 const isValidPassword = function (value) {
  return value.length >= 8 && value.length <= 15;
};

//--------------------Id--------------------------
const isValidObjectId = function (value) {
  return mongoose.Types.ObjectId.isValid(value);
};

//============================= module exports ==============================


module.exports = { isValidEmail, isValidDate, isValidString,isValidName,isValidPhone,isValidImage,isValidPassword,isValidSubcategory,isValidObjectId}