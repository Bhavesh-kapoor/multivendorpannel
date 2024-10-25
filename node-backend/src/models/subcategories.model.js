import mongoose from "mongoose";


const SubcategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,

        },
        categoryId: {
            type: mongoose.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true
        }
    }, { timestamps: true }
)

const Subcategory = mongoose.model('Subcategory', SubcategorySchema);
export default Subcategory;