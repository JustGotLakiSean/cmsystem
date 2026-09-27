const jwt = require("jsonwebtoken")

const authMiddleware = (req, res, next) => {
    try {
        // get token from authorization header
        const authHeader = req.headers.authorization;

        // check if token exist
        if(!authHeader) {
            return res.status(401).json({ message: "Unauthorize access." })
        }

        // split and get the actual token / bearer token...
        const token = authHeader.split(" ")[1]

        // verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // assign decoded token to user
        req.user = decoded;

        next()

    } catch (error) {
        res.status(401).json({ message: "Unauthorized. Invalid or expired token." })
    }
}

const requireRole = (roles) => {
    return (req, res, next) => {
       if(!roles.includes(req.user.role)){
            return res.status(403).json({ message: "Forbidden" })
       }
        next()
    }
}

module.exports = { authMiddleware, requireRole };