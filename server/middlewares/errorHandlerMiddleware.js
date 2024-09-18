const errorHandleMiddleware=(err,req,res,next)=>{
    const errStatusCode=res.statusCode===200?500:res.statusCode
    console.log(err)
    res.status(errStatusCode).json({
      "success":false,
      "message":err.message
    })
    console.error(err.stack);
  }
  module.exports={errorHandleMiddleware}