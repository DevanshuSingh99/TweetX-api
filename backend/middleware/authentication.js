import jwt from 'jsonwebtoken'
import {} from "dotenv/config";

export const auth=async (req,res,next)=>{
    const authHeader = req.headers['accesstoken'];
    const token = authHeader && authHeader.split(" ")[0];
    if(!token){
        res.status(401).send("Token required");
    }
    if (token) {
        try{
            const tokenIsValid = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            // console.log(tokenIsValid);
            req.user=tokenIsValid;
            next() 
            return;
        }     catch(e)
        {
             res.status(401).send("Token invalid")
        }
    }
}