const { auth_jwt } = require("../config/config");
const { jwt } = require("../config/node_packages");


const authenticate_user = (req, res, next) => {
    // const token = req.cookies.token; // Retrieve the token directly from cookies
    const authHeader = req.headers['authorization']; // Get the Authorization header
    const token = authHeader && authHeader.split(' ')[1]; // Extract the token

    if (!token) {
        console.log('No token provided')
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, auth_jwt.secret, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        console.log('User details:', user);
        req.user = user; // Attach user information to request
        next();
    });
}

module.exports = {
    authenticate_user
}
