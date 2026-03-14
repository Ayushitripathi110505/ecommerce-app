const express=require("express");
const router=express.Router();
const crypto=require("crypto");

router.post("/verify-payment",(req,res)=>{
    const{
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (generatedSignature === razorpay_signature) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});
module.exports = router;
