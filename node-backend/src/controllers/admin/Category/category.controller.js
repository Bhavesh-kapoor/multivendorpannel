
import { validationResult, check } from "express-validator";
import ApiError from "../../../utils/apiErrors.js";
import { connection, connectToDatabase } from "../../../db/connection.js";
import ApiResponse from "../../../utils/apiResponse.js";


// Validation rules
const validateCategory = [
    check('category_name')
        .notEmpty().withMessage('Category name is required')
        .isLength({ min: 2 }).withMessage('Category name must be at least 2 characters long'),

    // You can add more validation rules as needed
];

const index = async (req, res) => {
    let [categories] = await connection.query("SELECT * FROM categories where store_id=1 order by id desc");
    return res.render("vendors/categories/list", { categories });
};


const create = (req, res) => {
    return res.render("vendors/categories/add");

}


const store = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(new ApiError(400, "Validation Error", errors));
    } else {
        let { category_name, status } = req.body;
        // now fetch the 
        const [rows] = await connection.query("SELECT * FROM categories WHERE category_name = ?", [category_name]);
        if (rows.length > 0) {
            return res.status(400).json(new ApiError(400, "Already Exist", { errors: [{ msg: "Category Already exist" }] }))
        } else {
            const insertCategory = "INSERT INTO categories (category_name , status, store_id,created_at) VALUES (? , ? ,? , NOW()) "
            let store_id = 1;
            await connection.query(insertCategory, [category_name, status, store_id]);
            return res.status(201).json(new ApiResponse(200, 'Category Created Successfully!'));


        }
    }



}
const edit = async (req, res) => {
    // find the category data 
    try {
        const [edicategory] = await connection.query("SELECT * FROM categories WHERE id = ?", [req.params.id]);
        if (edicategory.length === 0) {
            return res.status(404).send('Category not found');
        }
        return res.render("vendors/categories/edit", { edicategory: edicategory[0] }); // Pass the first (and only) element
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
}
export { index, create, store, validateCategory, edit };
