const jwt = require('jsonwebtoken');

const jwtMiddleware = (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if(!accessToken) {
            return res.status(401).json({message:"Access token not Found"})
        }
        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        req.userId = decodedToken.userId
        next();
    } catch (err) {
   console.error("JWT Error:", err.message);
    return res.status(401).json({ message: "Invalid or expired Access token" });
  }
}

module.exports = jwtMiddleware;