import mongoose from "mongoose";


const CategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 50,
            minlength: 2,

        },
        isActive: {
            type: Boolean,
            default: true
        }
    }, { timestamps: true }
)

const Category = mongoose.model('category', CategorySchema);
export default Category;    