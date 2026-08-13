import {body,validationResult} from "express-validator";

export const validateUser = [
    body("username")
        .isLength({ min: 3, max: 60 })
        .withMessage("Username must be between 3 and 60 characters"),

    body("email")
        .isEmail()
        .withMessage("Enter a valid email"),

    body("password")
        .isLength({ min: 6, max: 50 })
        .withMessage("Password must be between 6 and 50 characters"),

    body("address")
        .isLength({ max: 400 })
        .withMessage("Address must not exceed 400 characters"),

    body("role")
        .isIn(["user", "admin", "store_owner"])
        .withMessage("Invalid role"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]
