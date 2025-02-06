import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { z } from "zod";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    const userSchema = z.object({
        firstName: z.string().min(2, { message: "First name should be at least 2 characters long" }),
        lastName: z.string().min(2, { message: "Last name should be at least 2 characters long" }),
        email: z.string().email({ message: "Invalid email address" }),
        password: z.string().min(6, { message: "Password should be at least 6 characters long" }),
    });

    const validatedData = userSchema.safeParse(req.body);
    if (!validatedData.success) {
        return res.status(400).json({
            errors: validatedData.error.issues.map((err) => err.message),
        });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({
            message: "User signed up successfully",
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
            },
        });
    } catch (error) {
        console.error("Error in signing up:", error);
        res.status(500).json({ error: "An error occurred while signing up" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(403).json({ error: "Invalid credentials" });
        }

        // Compare the password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(403).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({
            id: user._id,
        },
        config.JWT_USER_PASSWORD
        );
        // Login successful
        res.status(201).json({ message: "Login successful", user });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while logging in" });
    }
};
