// createAdmin.js
const bcrypt = require("bcrypt");
const User = require("./models/User");

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = new User({
      name: "SuperAdmin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
    });
    /**
8 → fast
10 → recommended
12+ → high security 

bcrypt.hash() takes time (it’s asynchronous), so we use:
async
await*/
    await admin.save();
    console.log("Admin created successfully!");
    process.exit();
  } catch (err) {
    console.log("Error creating admin:", err.message);
    process.exit(1);
  }
}
/**| Code | Meaning |
| ---- | ------- |
| `0`  | Success |
| `1`  | Error   |
 */

createAdmin();