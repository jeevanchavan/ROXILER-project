import { body, validationResult } from "express-validator";

export const validateStore = [
    body("storename")
        .notEmpty()
        .withMessage("Store name is required")
        .isLength({ max: 100 })
        .withMessage("Store name must not exceed 100 characters"),

    body("email")
        .isEmail()
        .withMessage("Enter a valid email"),

    body("address")
        .isLength({ max: 400 })
        .withMessage("Address must not exceed 400 characters"),

    body("ownerId")
        .isInt({ min: 1 })
        .withMessage("Owner ID must be a positive integer"),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        next();
    }
];