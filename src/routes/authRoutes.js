import express from 'express'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import cloudinary from '../lib/cloudinary.js'
import Book from '../models/Book.js'
import protectRoute from '../middleware/auth.middleware.js'

const router = express.Router()
const generateToken = (userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15d' })
    return token
}
router.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body
        if (!username || !email || !password) {
            return res.status(400).json({message:'all fields are required'})
        }
        if (password.length < 6) {
            return res.status(400).json({message:'password should be at least 6 characters long'})
        }
        if (username.length < 3) {
            return res.status(400).json({message:'username should be at least 3 characters long'})
        }
        const existingEmail = await User.findOne({ email })
        if (existingEmail) {
            return res.status(400).json({message:'email already exists'})
        }
        const existingUsername = await User.findOne({ username })
        if (existingUsername) {
            return res.status(400).json({message:'username already exists'})
        }
        const profileImage=`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
        const user = new User({
            email, username, password, profileImage:profileImage
        })
        await user.save()
        const token = generateToken(user._id)
        res.status(201).json({
            token, user: {
                id: user._id,
                username: user.username,
                email: user.email,
            profileImage:user.profileImage
        }})
    } catch (error) {
        console.log('error in register route', error)
        res.status(500).json({message:'internal server error'})
    }
})
router.post('/login', async (req, res) => {
    try {
        console.log('req.body', req.body)
        const { email, password } = req.body
        if (!email || !password) return res.status(400).json({ message: 'all fields are required' })
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: 'invalid credentilas' })
        const isPasswordCorrect = await user.comparePassword(password)
        if (!isPasswordCorrect) return res.status(400).json({ message: 'invalid credentials' })
        const token = generateToken(user._id)
        res.status(200).json({token, user:{id:user._id, username:user.username, email:user.email, profileImage:user.profileImage}})
    } catch (error) {
        console.log('error in login route', error)
        res.status(500).json({message:'internal server error'})
    }
})

export default router
// import express from 'express'
// import User from '../models/User.js'
// import jwt from 'jsonwebtoken'
// import protectRoute from '../middleware/auth.middleware.js'
// import Book from '../models/Book.js'
// const router = express.Router()
// const generateToken = (userId) => {
//     const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15d' })
//     return token
// }
// router.post('/register', async (req, res) => {
//     try {
//         const { email, username, password } = req.body
//         if (!username || !email || !password) {
//             return res.status(400).json({message:'all fields are required'})
//         }
//         if (password.length < 6) {
//             return res.status(400).json({message:'password should be at least 6 characters long'})
//         }
//         if (username.length < 3) {
//             return res.status(400).json({message:'username should be at least 3 characters long'})
//         }
//         const existingEmail = await User.findOne({ email })
//         if (existingEmail) {
//             return res.status(400).json({message:'email already exists'})
//         }
//         const existingUsername = await User.findOne({ username })
//         if (existingUsername) {
//             return res.status(400).json({message:'username already exists'})
//         }
//         const profileImage=`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
//         const user = new User({
//             email, username, password, profileImage:profileImage
//         })
//         await user.save()
//         const token = generateToken(user._id)
//         res.status(201).json({
//             token, user: {
//                 id: user._id,
//                 username: user.username,
//                 email: user.email,
//             profileImage:user.profileImage
//         }})
//     } catch (error) {
//         console.log('error in register route', error)
//         res.status(500).json({message:'internal server error'})
//     }
// })
// router.post('/login', async (req, res) => {
//     try {
//         const { email, password } = req.body
//         if (!email || !password) return res.status(400).json({ message: 'all fields are required' })
//         const user = await User.findOne({ email })
//         if (!user) return res.status(400).json({ message: 'invalid credentilas' })
//         const isPasswordCorrect = await user.comparePassword(password)
//         if (!isPasswordCorrect) return res.status(400).json({ message: 'invalid credentials' })
//         const token = generateToken(user._id)
//         res.status(200).json({token, user:{id:user._id, username:user.username, email:user.email, profileImage:user.profileImage}})
//     } catch (error) {
//         console.log('error in login route', error)
//         res.status(500).json({message:'internal server error'})
//     }
// })
// router.post('/book', async (req, res) => {
//     console.log(req.body, 'req.body')
//     try {
//         const { title,caption, rating, image } = req.body
//         if (!image || !title || !caption || !rating) {
//             res.status(400).json({ message: 'please provide all fields' })
//         }
//         const uploadResponse = await cloudinary.uploader.upload(image)
//         const imageUrl = uploadResponse.secure_url
//         const newBook = new Book({
//             title, caption, rating, image: imageUrl,user:req.user._id
//         })
//         await newBook.save()
//         res.status(201).json(newBook)
//     } catch (error) {
//         console.log('error creating book', error)
//         res.status(500).json({message:error.message})
//     }
// })
// export default router