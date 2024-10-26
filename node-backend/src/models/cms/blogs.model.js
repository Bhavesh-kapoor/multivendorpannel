
import { mongoose, Schema } from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 255,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    content: {
        type: String,
        required: true,
    },

    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',  // Only Author is ref
        required: true,
    },

    tags: [{
        type: String,   // Inline tags as array of strings
    }],
    featured_image: {
        type: String,
        default: null,
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft',
    },
    seo: {
        meta_title: {
            type: String,
            maxlength: 255,
            default: null,
        },
        meta_description: {
            type: String,
            maxlength: 500,
            default: null,
        },
        meta_keywords: {
            type: [String],
            default: [],
        },
        canonical_url: {
            type: String,
            default: null,
        },

    },

}, { timestamps: true });

blogSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

export const Blog = mongoose.model('Blog', blogSchema);
