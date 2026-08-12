// this checks for the role. admin,user,store_owner.
export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                message: "User is not authenticated",
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "User is not authorized",
            });
        }

        next();
    };
};