const express = require("express");
const router = express.Router();
const path = require("path");
const Product = require("../models/Product");
const { isAuthenticated, isAdmin } = require("../authentication/authMiddleware");
const multer = require("multer");
const Order = require("../models/Order");
const User = require("../models/User");
//------------------------------
/*----------dashboard----------*/
//------------------------------
router.get("/dashboard", isAuthenticated, isAdmin, async(req, res) => {
  const products = await Product.find();
  res.render("admin-dashboard", { user: req.session.user, products });
});


/**
 * ✅ Summary Table
Feature	res.send()	res.render()
Sends	Text, HTML, JSON, Buffer	HTML generated from a template
Uses template?	❌ No	✅ Yes
Can pass variables?	❌ Only by stringifying	✅ Directly passed to template
Use case	Quick response, API, JSON	Full HTML pages, dashboard, front-end
 */
//-------------------------------------------------
// -----------------Show Add Product Form-----------
//-----------------------------------------------
router.get("/add-product", isAuthenticated, isAdmin, (req, res) => {
  res.render("add-product");  // <-- create add-product.ejs
});
//-----------------------------------------
//-----------------Multer--------------
//-----------------------------------
// Handle Add Product Form submission
// 1️⃣ Configure Multer storage FIRST
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images"); // save uploaded images here
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // unique filename
  }
});

// 2️⃣ Initialize upload AFTER storage
const upload = multer({ storage: storage });
//--------------------------------------------
//-------------------post add-product----------
//--------------------------------------------
// 3️⃣ Now use upload in your route
router.post("/add-product", isAuthenticated, isAdmin, upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const image = req.file ? "/images/" + req.file.filename : "";

    const product = new Product({ name, description, price, category, stock, image });
    await product.save();

    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding product");
  }
});

// View single product details (admin)
router.get("/product/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.send("Product not found");

    res.render("admin-product-details", { product });
  } catch (err) {
    console.log(err);
    res.send("Error loading product");
  }
});

/*| Type        | Example           | Access Using    |
| ----------- | ----------------- | --------------- |
| Route Param | `/product/123`    | `req.params.id` |
| Query Param | `/product?id=123` | `req.query.id`  |
| Form Body   | POST form         | `req.body.id`   |
*/ 
// Show delete products page
router.get("/delete-products", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const products = await Product.find();
    res.render("admin-delete-products", { products });
  } catch (err) {
    console.log(err);
    res.send("Error loading products for deletion");
  }
});

// Handle deletion of selected products
router.post("/delete-products", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const idsToDelete = req.body.products; // array of selected product _id's
    if (!idsToDelete) return res.redirect("/admin/delete-products");

    // If only one checkbox selected, convert to array
    const idsArray = Array.isArray(idsToDelete) ? idsToDelete : [idsToDelete];
    await Product.deleteMany({ _id: { $in: idsArray } });

    res.redirect("/admin/delete-products");
  } catch (err) {
    console.log(err);
    res.send("Error deleting products");
  }
});

// Show edit products page
router.get("/edit-products", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const products = await Product.find();
    res.render("admin-edit-products", { products });
  } catch (err) {
    console.log(err);
    res.send("Error loading products for editing");
  }
});

// Show single product edit form
router.get("/edit-product/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.send("Product not found");

    res.render("admin-edit-product-form", { product });
  } catch (err) {
    console.log(err);
    res.send("Error loading product");
  }
});

// Handle product edit submission
router.post("/edit-product/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { name, description, price, category, stock, image } = req.body;

    await Product.findByIdAndUpdate(req.params.id, {
      name,
      description,
      price,
      category,
      stock,
      image
    });

    res.redirect("/admin/edit-products");
  } catch (err) {
    console.log(err);
    res.send("Error updating product");
  }
});

// Show all orders
router.get("/orders", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .sort({ createdAt: -1 });

    res.render("admin-orders", { orders });
  } catch (err) {
    console.log(err);
    res.send("Failed to load orders");
  }
});

// ✅ ADMIN – UPDATE ORDER STATUS
router.post("/orders/:id/status", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).send("Order not found");

    order.status = status;
    await order.save();

    // ✅ redirect to existing route
    res.redirect("/admin/orders");

  } catch (err) {
    console.log(err);
    res.status(500).send("Failed to update order status");
  }
});

module.exports = router;
module.exports = router;

/**| Feature               | Option A (Local)              | Option B (Cloudinary)        | Option C (URL)                          |
| --------------------- | ----------------------------- | ---------------------------- | --------------------------------------- |
| Where image is stored | Your server                   | Cloud storage                | External website                        |
| Setup                 | Requires Multer, disk storage | Multer + Cloudinary setup    | No upload, just form input              |
| File handling         | Saved on server               | Saved in cloud               | Not saved, just reference               |
| Scalability           | Limited                       | High                         | Depends on external host                |
| Control over image    | Full                          | Cloud allows transformations | None, you rely on the URL host          |
| Best for              | Learning, small apps          | Production apps              | Quick testing, placeholders, prototypes |
 
Step 1️⃣ What multer Actually Is

When you do:

const multer = require("multer");

multer is just a normal JavaScript function.

Think of it like this:

function multer(options) {
   // setup using options
   return someMiddlewareCreator;
}

So:

👉 multer is NOT middleware
👉 It is a function that RETURNS something

Step 2️⃣ When You Call It
const upload = multer({ storage });

You are calling the function.

That means:

upload = return value of multer(...)

So whatever multer() returns becomes upload.

Step 3️⃣ What Does multer() Return?

Internally (simplified), Multer does something like this:

function multer(options) {
   return {
      single: function(fieldName) {
         return function(req, res, next) {
            console.log("Handling file upload...");
            next();
         }
      }
   };
}

So:

const upload = multer({ storage });

Now upload equals:

{
   single: function(fieldName) {
      return function(req, res, next) { ... }
   }
}
Step 4️⃣ Where Is The Real Middleware?

Here:

upload.single("image")

This returns:

function(req, res, next) {
   // file upload logic
   next();
}

THAT function is the actual middleware.













*/