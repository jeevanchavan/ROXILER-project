import {body,validationResult} from "express-validator"


export const validateRating = [
    body("rating")
        .isInt({ min: 1, max: 5 })
        .withMessage("Rating must be an integer between 1 and 5"),

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