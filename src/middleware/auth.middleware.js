import { findUserById } from "../dao/user.dao.js"
import { verifyToken } from "../utils/helper.js"

export const authMiddleware = async (req, res, next) => {
    // Try to get token from cookie first, then from Authorization header
    let token = req.cookies.accessToken

    if (!token) {
        const authHeader = req.headers.authorization
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7) // Remove 'Bearer ' prefix
        }
    }

    if(!token) return res.status(401).json({message:"Unauthorized - No token provided"})

    try {
        const decoded = verifyToken(token)
        const user = await findUserById(decoded)
        if(!user) return res.status(401).json({message:"Unauthorized - User not found"})
        req.user = user
        next()
    } catch (error) {
        console.log("Auth middleware error:", error)
        return res.status(401).json({message:"Unauthorized - Invalid token", error: error.message})
    }
}