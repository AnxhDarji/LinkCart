const db = require("../config/db");
const generateSlug = require("../utils/generateSlug");
const { getUserProfileByCustomId } = require("../utils/userProfile");
const { isProfileComplete } = require("../utils/profileCompletion");

exports.createProduct = async (req, res) => {
    try {
        const { title, description, price, location, visibility } = req.body;

        if (!title)
            return res.status(400).json({ error: "Title is required" });

        if (title.length > 200)
            return res.status(400).json({ error: "Title must be 200 characters or fewer" });

        if (description && description.length > 5000)
            return res.status(400).json({ error: "Description must be 5000 characters or fewer" });

        if (location && location.length > 200)
            return res.status(400).json({ error: "Location must be 200 characters or fewer" });

        const userId = req.user.custom_id;
        const profile = await getUserProfileByCustomId(userId);

        if (!isProfileComplete(profile)) {
            return res.status(400).json({ error: "Profile incomplete" });
        }

        const slug = generateSlug();
        const imageUrl = req.file ? req.file.path : null;

        if (req.file && !imageUrl) {
            return res.status(400).json({ error: "Image upload failed" });
        }

        const result = await db.query(
            `INSERT INTO products 
            (user_id, title, description, price, location, visibility, slug, image)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8) 
            RETURNING *`,
            [
                userId,
                title,
                description,
                price,
                location,
                visibility || "public",
                slug,
                imageUrl,
            ]
        );

        res.status(201).json({
            message: "Product link created successfully",
            product: result.rows[0],
        });
    } catch (error) {
        console.error("createProduct error:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

exports.getMyProducts = async (req, res) => {
    try {
        const userId = req.user.custom_id;

        const result = await db.query(
            `SELECT *
             FROM products
             WHERE user_id = $1
             ORDER BY created_at DESC`,
            [userId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error("getMyProducts error:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

exports.getPublicProducts = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT 
                p.*,
                u.full_name AS seller_name,
                COALESCE(u.profile_pic, '') AS seller_profile_pic
             FROM products p
             JOIN users u ON u.custom_id = p.user_id
             WHERE p.visibility = 'public'
             ORDER BY p.created_at DESC`
        );

        res.json(result.rows);
    } catch (error) {
        console.error("getPublicProducts error:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

exports.getProductBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const result = await db.query(
            `SELECT 
                p.*,
                u.full_name AS seller_name,
                COALESCE(u.profile_pic, '') AS seller_profile_pic
             FROM products p
             JOIN users u ON u.custom_id = p.user_id
             WHERE p.slug = $1`,
            [slug]
        );

        if (result.rows.length === 0)
            return res.status(404).json({ error: "Product not found" });

        res.json(result.rows[0]);
    } catch (error) {
        console.error("getProductBySlug error:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

exports.markAsSold = async (req, res) => {
    const productId = req.params.id;
    const userId = req.user.custom_id;

    try {
        const result = await db.query(
            `UPDATE products
             SET status = 'sold'
             WHERE id = $1 AND user_id = $2
             RETURNING id, status`,
            [productId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Product not found or unauthorized." });
        }

        res.json({ message: "Product marked as sold.", product: result.rows[0] });
    } catch (error) {
        console.error("markAsSold error:", error.message);
        res.status(500).json({ error: "Failed to update product." });
    }
};

exports.toggleVisibility = async (req, res) => {
    const productId = req.params.id;
    const userId = req.user.custom_id;

    try {
        const checkResult = await db.query(
            `SELECT visibility FROM products WHERE id = $1 AND user_id = $2`,
            [productId, userId]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: "Product not found or unauthorized." });
        }

        const currentVisibility = checkResult.rows[0].visibility;
        const newVisibility = currentVisibility === 'public' ? 'private' : 'public';

        const updateResult = await db.query(
            `UPDATE products
             SET visibility = $1
             WHERE id = $2 AND user_id = $3
             RETURNING id, visibility`,
            [newVisibility, productId, userId]
        );

        res.json({ message: `Product visibility changed to ${newVisibility}.`, product: updateResult.rows[0], newVisibility });
    } catch (error) {
        console.error("toggleVisibility error:", error.message);
        res.status(500).json({ error: "Failed to update product visibility." });
    }
};

exports.deleteProduct = async (req, res) => {
    const client = await db.connect();
    try {
        const { id } = req.params;
        const userId = req.user.custom_id;

        await client.query("BEGIN");
        await client.query("DELETE FROM interests WHERE product_id = $1", [id]);
        await client.query("UPDATE reports SET product_id = NULL WHERE product_id = $1", [id]);

        const result = await client.query(
            "DELETE FROM products WHERE id = $1 AND user_id = $2 RETURNING *",
            [id, userId]
        );

        if (result.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ error: "Product not found or unauthorized to delete." });
        }

        await client.query("COMMIT");
        res.json({ message: "Product deleted successfully." });
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("deleteProduct error:", error.message);
        res.status(500).json({ error: "Failed to delete product." });
    } finally {
        client.release();
    }
};

exports.editProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.custom_id;
        const { title, description, price, location } = req.body;

        if (!title)
            return res.status(400).json({ error: "Title is required" });
        if (title.length > 200)
            return res.status(400).json({ error: "Title must be 200 characters or fewer" });
        if (description && description.length > 5000)
            return res.status(400).json({ error: "Description must be 5000 characters or fewer" });
        if (location && location.length > 200)
            return res.status(400).json({ error: "Location must be 200 characters or fewer" });

        const result = await db.query(
            `UPDATE products 
             SET title = $1, description = $2, price = $3, location = $4 
             WHERE id = $5 AND user_id = $6 
             RETURNING *`,
            [title, description, price, location, id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Product not found or unauthorized to edit." });
        }

        res.json({ message: "Product updated successfully.", product: result.rows[0] });
    } catch (error) {
        console.error("editProduct error:", error.message);
        res.status(500).json({ error: "Failed to update product." });
    }
};
