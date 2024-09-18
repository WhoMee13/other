const express=require("express")
const app=express()
require("dotenv").config()
require("./config/dbconfig.js")()
const ERROR=require("./middlewares/errorHandlerMiddleware.js")
const authMiddleware = require("./middlewares/authMiddleware.js")
app.use(require("cors")())
app.use(express.json())
//* Routes
app.use("/api/user",require('./routes/userRoute.js'))
app.use("/api/admin",require("./routes/adminRoute.js"))
app.use("/api/",require('./routes/authRoute.js'))
app.use("/api/product",authMiddleware,require("./routes/productRoute.js"))
app.use("/api/order",authMiddleware,require("./routes/OrderRoute.js"))
app.use("/api/cart",authMiddleware,require("./routes/cartRoute.js"))
app.use("/api/websites",authMiddleware,require("./routes/websiteRoute.js"))
app.use("/try",require)

//* Middlewares
app.use(ERROR.errorHandleMiddleware)
// Server
const PORT =process.env.PORT || 3000
app.listen(
    PORT,
    ()=>{
        console.log(`Server is running at ${PORT}`);
    }
)