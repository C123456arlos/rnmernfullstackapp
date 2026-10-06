import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const protectRoute = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        console.log(token)
        // const token = req.header('Authorization')
        
        if (!token) return res.status(401).json({ message: 'no authentication token access denied' })
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.userId).select('-password')
        if (!user) return res.status(401).json({ message: 'token is not valid' })
        req.user = user
        next()
    } catch (error) {
        console.error('Authentication error', error.message)
        res.status(401).json({message:'token is not valid'})
    }
}
export default protectRoute