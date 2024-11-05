import { Router } from "express";


import { blogValidator, creatBlog, getAllBlogs ,deleteBlogs, updateBlog } from "../../controllers/admin/cms/blog.controller.js";
const blogroutes = Router();

// // GET all blogs (with optional filtering by category, author, or tags)
blogroutes.get('/', getAllBlogs);

// // GET a specific blog by slug or ID
// blogroutes.get('/:slugOrId', BlogController.getBlogBySlugOrId);

// POST (Create) a new blog
blogroutes.post('/create', blogValidator, creatBlog);

// // PUT (Update) an existing blog by ID
blogroutes.put('/:id', updateBlog);

// // DELETE a blog by ID
blogroutes.delete('/delete/:id', deleteBlogs);

// // SEO: GET SEO metadata for a blog by ID
// blogroutes.get('/:id/seo', BlogController.getBlogSEO);

// // SEO: Update SEO metadata for a blog by ID
// blogroutes.put('/:id/seo', BlogController.updateBlogSEO);

// // Get all blogs by a specific author
// blogroutes.get('/author/:authorId', BlogController.getBlogsByAuthor);

// Get all blogs in a specific category
// blogroutes.get('/category/:categoryName', BlogController.getBlogsByCategory)


export default blogroutes;