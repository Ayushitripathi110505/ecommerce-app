const express = require("express");
const path = require("path");
const router = express.Router();
const { isAuthenticated, isUser } = require("../authentication/authMiddleware");
const Product =require("../models/Product");
const Cart = require("../models/Cart");
const Order = require("../models/Order"); 

router.get("/test-route", (req, res) => {
  console.log("🔥 User test route hit!");
  res.send("✅ User test route works!");
});
// User Dashboard
router.get("/dashboard", isAuthenticated, isUser, async(req, res) => {
  try{
    const products =await Product.find();
    console.log("Products from DB:", products);

  res.render("user-dashboard", {
     user: req.session.user,
    products:products });
  }
  catch(error){
    console.log(error);
    res.send("error loading products")
  }
});

// Show user's cart
router.get("/cart", isAuthenticated, async (req, res) => {
  try {
    // Fetch the user's cart
    const cart = await Cart.findOne({ user: req.session.user.id }).populate("items.product");

    // Render the correct template: cart.ejs
    res.render("cart", { cart }); 
  } catch (err) {
    console.log("Error fetching cart:", err);
    res.send("Error loading cart");
  }
});
/*
router.get("/clear-products", async (req, res) => {
  try {
    await Product.deleteMany({});
    res.send("✅ All products deleted");
  } catch (err) {
    console.log(err);
    res.send("❌ Error clearing products");
  }
});

router.get("/seed-products", async (req, res) => {
  await Product.insertMany([
    {
      name: "Flower Bouquet",
      price: 300,
      category: "Beautiful",
      description: "Freshly handpicked and beautifully arranged, this flower bouquet is designed to brighten any occasion with its vibrant colors and delightful fragrance. Each bloom is carefully chosen to create a perfect balance of elegance and charm, making it an ideal gift for birthdays, anniversaries, weddings, or simply to show someone you care. Wrapped with love and presented in an elegant style, this bouquet adds warmth, joy, and a touch of nature’s beauty to every moment. Affordable yet luxurious, it’s more than just flowers—it’s a heartfelt gesture that turns ordinary days into unforgettable memories.",
      image: "/product1.jpg",
      stock: 10
    },
    {
      name: "Teddy Bears",
      price: 650,
      category: "Cute",
       description: "Soft, cuddly, and full of love, our teddy bears are the perfect companions for all ages. Made with premium materials, they bring comfort, warmth, and joy to anyone who holds them close. Whether it’s a gift for a child, a romantic gesture, or a token of friendship, these teddy bears speak the language of care and affection. Their adorable design and huggable softness make them a timeless keepsake that never goes out of style. More than just a toy, they are a heartfelt reminder that love can be simple, sweet, and everlasting.",
      image: "/product2.jpg",
      stock: 5
    },
    {
      name: "Chocolates",
      price: 500,
      category: "Tasty",
       description: "Indulge in the rich, irresistible taste of our handcrafted chocolates. Each piece is made with the finest ingredients, blending smooth textures and delightful flavors that melt in your mouth. Perfect for celebrations, romantic gestures, or simply treating yourself, these chocolates are little bites of happiness wrapped in elegance. From creamy milk to decadent dark varieties, every box is a journey of sweetness and joy. Affordable yet luxurious, our chocolates are not just treats—they are experiences that make every occasion unforgettable.",
      image: "/product3.jpg",
      stock: 20
    },
    {
      name: "Watches",
      price: 300,
      category: "Smart",
       description: "Timeless elegance meets modern style with our exquisite collection of watches. Each piece is crafted with precision to not only keep perfect time but also make a bold fashion statement. Whether you’re dressing for a business meeting, a casual outing, or a special occasion, these watches add sophistication and charm to your look. Durable, stylish, and affordable, they are more than accessories—they are reflections of your personality and taste. A watch from our collection is the perfect gift for yourself or someone special, turning every moment into a memory worth cherishing.",
      image: "/product5.jpg",
      stock: 8
    }
  ]);

  res.send("Products Inserted Successfully");
});


*/
/**Temporary Routes */



router.get("/reset-products", async (req, res) => {
  try {
    // Delete all existing products
    await Product.deleteMany({});

    // Insert new products
    await Product.insertMany([
      {
        name: "Flower Bouquet",
        price: 300,
        category: "Beautiful",
        description: "Freshly handpicked and beautifully arranged, this flower bouquet is designed to brighten any occasion with its vibrant colors and delightful fragrance. Each bloom is carefully chosen to create a perfect balance of elegance and charm, making it an ideal gift for birthdays, anniversaries, weddings, or simply to show someone you care. Wrapped with love and presented in an elegant style, this bouquet adds warmth, joy, and a touch of nature’s beauty to every moment. Affordable yet luxurious, it’s more than just flowers—it’s a heartfelt gesture that turns ordinary days into unforgettable memories",
        image: "/product1.jpg",
        stock: 10
      },
      {
        name: "Teddy Bears",
        price: 650,
        category: "Cute",
        description: "Soft, cuddly, and full of love, our teddy bears are the perfect companions for all ages. Made with premium materials, they bring comfort, warmth, and joy to anyone who holds them close. Whether it’s a gift for a child, a romantic gesture, or a token of friendship, these teddy bears speak the language of care and affection. Their adorable design and huggable softness make them a timeless keepsake that never goes out of style. More than just a toy, they are a heartfelt reminder that love can be simple, sweet, and everlasting.",
        image: "/product2.jpg",
        stock: 5
      },
      {
        name: "Chocolates",
        price: 500,
        category: "Tasty",
        description: "Indulge in the rich, irresistible taste of our handcrafted chocolates. Each piece is made with the finest ingredients, blending smooth textures and delightful flavors that melt in your mouth. Perfect for celebrations, romantic gestures, or simply treating yourself, these chocolates are little bites of happiness wrapped in elegance. From creamy milk to decadent dark varieties, every box is a journey of sweetness and joy. Affordable yet luxurious, our chocolates are not just treats—they are experiences that make every occasion unforgettable.",
        image: "/product3.jpg",
        stock: 20
      },
      {
        name: "Watches",
        price: 300,
        category: "Smart",
        description: "Timeless elegance meets modern style with our exquisite collection of watches. Each piece is crafted with precision to not only keep perfect time but also make a bold fashion statement. Whether you’re dressing for a business meeting, a casual outing, or a special occasion, these watches add sophistication and charm to your look. Durable, stylish, and affordable, they are more than accessories—they are reflections of your personality and taste. A watch from our collection is the perfect gift for yourself or someone special, turning every moment into a memory worth cherishing.",
        image: "/product5.jpg",
        stock: 8
      }
    ]);

    res.send("✅ Products cleared and inserted successfully!");
  } catch (err) {
    console.log(err);
    res.send("❌ Error resetting products");
  }
});


router.get("/product/:id", async (req, res) => {
  try {
    console.log("Route hit");   // 👈 add this for testing

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.send("Product not found");
    }

    res.render("product-details", { product });

  } catch (err) {
    console.log(err);
    res.send("Error loading product");
  }
});

///------------------------orders-------------------------
//-------------------------------------------------------
/*router.post("/checkout", isAuthenticated, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.session.user.id }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.send("Cart is empty");
    }

    let totalAmount = 0;
    const orderItems = cart.items.map(item => {
      totalAmount += item.product.price * item.quantity;
      return {
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      };
    });

    const newOrder = await Order.create({
      user: req.session.user._id,
      items: orderItems,
      totalAmount,
      address: req.body.address
    });

    // Reduce stock
    for (let item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    res.redirect("/user/orders");

  } catch (err) {
    console.log("Checkout error:", err);
    res.send("Checkout failed");
  }
});
*/
router.post("/checkout", isAuthenticated, async (req, res) => {
  try {
    console.log("Checkout started");

    const userId = req.session.user.id; // <-- use this

    let cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) {
      // Create empty cart if none exists
      cart = await Cart.create({ user: userId, items: [] });
    }

    if (cart.items.length === 0) {
      return res.send("Cart is empty");
    }

    let totalAmount = 0;
    const orderItems = cart.items.map(item => {
      totalAmount += item.product.price * item.quantity;
      return {
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      };
    });

    const newOrder = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      address: req.body.address
    });

    // Reduce stock
    for (let item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    res.redirect("/user/orders");
  } catch (err) {
    console.log("Checkout error:", err);
    res.send("Checkout failed");
  }
});
// Show user orders
router.get("/user-orders", isAuthenticated, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.session.user.id })
                              .populate("items.product") // important!
                              .sort({ createdAt: -1 });

    res.render("user-orders", { orders, user: req.session.user });
  } catch (err) {
    console.log(err);
    res.send("Error loading orders");
  }
});
/**------------------------------------------ */
// Add product to cart  cart
/**------------------------------------------- 

router.get("/cart", isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user.id;

    const cart = await Cart.findOne({ user: userId })
      .populate("items.product"); // important to show product details

    res.render("cart", { cart });

  } catch (err) {
    console.log("CART ERROR:", err);
    res.status(500).send("Error loading cart");
  }
});


router.post("/add-to-cart/:id", isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user.id;  // ✅ fixed
    const productId = req.params.id;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += 1;
    } else {
      cart.items.push({ product: productId, quantity: 1 });
    }

    await cart.save();
    res.redirect("/cart");

  } catch (err) {
    console.log("FULL ERROR:", err);
    res.send(err.message);
  }
});
router.get("/cart", isAuthenticated, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.session.user._id })
      .populate("items.product");

    res.render("cart", { cart });
  } catch (err) {
    console.log(err);
    res.send("Error loading cart");
  }
});

router.post("/remove-from-cart/:id", isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user.id;   // ✅ fixed
    const productId = req.params.id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.redirect("/cart");
    }

    // Remove selected product
    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();
    res.redirect("/cart");

  } catch (err) {
    console.log("REMOVE ERROR:", err);
    res.status(500).send("Error removing item");
  }
});
*/
router.get("/orders", isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user.id; // make sure this matches session
    const orders = await Order.find({ user: userId })
                              .populate("items.product")
                              .sort({ createdAt: -1 });

    res.render("user-orders", { orders, user: req.session.user });
  } catch (err) {
    console.log("Error loading orders:", err);
    res.send("Error loading orders");
  }
});
router.post("/update-cart/:id", isAuthenticated, async (req, res) => {
  try {
    const productId = req.params.id;
    let quantity = parseInt(req.body.quantity);

    const product = await Product.findById(productId);
    if (!product) return res.send("Product not found");

    if (quantity > product.stock) quantity = product.stock;

    const cart = await Cart.findOne({ user: req.session.user.id });
    if (!cart) return res.send("Cart not found");

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
    }

    res.redirect("/user/cart"); // reload cart
  } catch (err) {
    console.log("Update cart error:", err);
    res.send("Failed to update cart");
  }
});
module.exports = router;

/** 
 * product === products:products 
 * 
 * only when key name =variable name 
 * else
 *  now const products = await Product.find();
res.render("page", { items: products }); // different name */


//---------------------------------------------------------------
//---------------important-----------------------------------------
/**Suppose the logged-in user has a cart like this:

cart.items = [
  {
    product: { _id: "p1", name: "Nike Shoes", price: 2000, stock: 10 },
    quantity: 2
  },
  {
    product: { _id: "p2", name: "Adidas Shirt", price: 1000, stock: 5 },
    quantity: 1
  }
];
🔹 Step 1: Initialize Total
let totalAmount = 0;
🔹 Step 2: Convert Cart Items to Order Items

The code:

const orderItems = cart.items.map(item => {
  totalAmount += item.product.price * item.quantity;

  return {
    product: item.product._id,
    quantity: item.quantity,
    price: item.product.price
  };
});
🔹 How map() Works Here

1️⃣ First item:

item.product.price * item.quantity = 2000 * 2 = 4000

totalAmount = 0 + 4000 = 4000

Return object:

{
  product: "p1",
  quantity: 2,
  price: 2000
}

2️⃣ Second item:

item.product.price * item.quantity = 1000 * 1 = 1000

totalAmount = 4000 + 1000 = 5000

Return object:

{
  product: "p2",
  quantity: 1,
  price: 1000
}
🔹 Step 3: Result

After map() finishes:

orderItems = [
  { product: "p1", quantity: 2, price: 2000 },
  { product: "p2", quantity: 1, price: 1000 }
];

totalAmount = 5000;
🔹 Step 4: Save Order to Database
const newOrder = await Order.create({
  user: req.session.user._id,
  items: orderItems,
  totalAmount,
  address: "123 Main Street, Mumbai"
});
The Order Saved in MongoDB Will Look Like:
{
  "_id": "o1001",
  "user": "u123",
  "items": [
    { "product": "p1", "quantity": 2, "price": 2000 },
    { "product": "p2", "quantity": 1, "price": 1000 }
  ],
  "totalAmount": 5000,
  "address": "123 Main Street, Mumbai",
  "paymentStatus": "Pending",
  "orderStatus": "Pending",
  "createdAt": "2026-02-24T05:30:00Z",
  "updatedAt": "2026-02-24T05:30:00Z"
} */