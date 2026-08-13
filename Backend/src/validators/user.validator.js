import {body,validationResult} from "express-validator";

export const validateUser = [
    body("username")
        .isLength({ min: 20, max: 60 })
        .withMessage("Username must be between 20 and 60 characters"),

    body("email")
        .isEmail()
        .withMessage("Enter a valid email"),

    body("password")
        .isLength({ min: 8, max: 16 })
        .withMessage("Password must be between 8 and 16 characters")
        .matches(/[A-Z]/)
        .withMessage("Password must contain an uppercase letter")
        .matches(/[^A-Za-z0-9]/)
        .withMessage("Password must contain a special character"),

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
