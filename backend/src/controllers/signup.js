const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();


app.use(express.json());
app.use(cors());


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

mongoose
  .connect("mongodb+srv://revolvesoftware2025_db_user:tcVsDuvhHFkh6DrM@cluster0.fkgwmao.mongodb.net/") 
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));


app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "Signup Successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});


app.listen(5000, () => {
  console.log("Server running on port 5000");
});