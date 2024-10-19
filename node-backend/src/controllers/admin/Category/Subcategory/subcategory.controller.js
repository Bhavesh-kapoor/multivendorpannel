
import { validationResult, check } from "express-validator";
import ApiError from "../../../../utils/apiErrors.js";
import { connection } from "../../../../db/connection.js";
import ApiResponse from "../../../../utils/apiResponse.js";
import { DBfetchAllData, DBFetechJoins } from "../../../../db/globalqueries.js";



// Validation rules
const validateSubCategory = [
    check('category_id').notEmpty().withMessage('Please select Category First'),
    check('subcategory_name')
        .notEmpty().withMessage('Sub Category name is required')
        .isLength({ min: 2 }).withMessage(' Sub Category name must be at least 2 characters long'),

    // You can add more validation rules as needed
];

const index = async (req, res) => {
    let [subcategories] = await DBFetechJoins('subcategories', 'subcategories.* , categories.category_name', 'categories', 'category_id', 'id');
    return res.render("vendors/categories/subcategories/list", { subcategories });
};


const create = async (req, res) => {
    // check if the role if admin or vendor
    let categories;
    if (req.user.is_admin == 1) {
        [categories] = await DBfetchAllData('categories', 'status', 1);
    } else {
        [categories] = await DBfetchAllData('categories', 'status', 1, 'store_id', req.user.id);
    }
    return res.render("vendors/categories/subcategories/add", { categories });

}


const store = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(new ApiError(400, "Validation Error", errors));
    } else {
        let { subcategory_name, status, category_id } = req.body;
        // now fetch the 
        const [rows] = await connection.query("SELECT * FROM subcategories WHERE sub_category_name = ?", [subcategory_name]);
        if (rows.length > 0) {
            return res.status(400).json(new ApiError(400, "Already Exist", { errors: [{ msg: "Sub Category Already exist" }] }))
        } else {
            const insertCategory = "INSERT INTO subcategories (sub_category_name ,category_id, status, store_id,created_at) VALUES (?,? , ? ,? , NOW()) "
            let store_id = 1;
            await connection.query(insertCategory, [subcategory_name, category_id, status, store_id]);
            return res.status(201).json(new ApiResponse(200, 'Sub Category Created Successfully!'));


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


export { index, create, store, validateSubCategory, edit };
