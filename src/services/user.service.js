import supabase from "../db.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import e from "express";
import jwt from "jsonwebtoken";

// User registration
export const registerUser = async (data) => {
  const { user_name, email, password, first_name, last_name } = data;
  console.log("Received email value:", email);

  // Validate required fields
  if (!user_name || !email || !password) {
    throw new Error("Fields user_name, email, and password are required");
  }

  try {
    // Check if the email already exists
    const { data: existingEmail, error: emailError } = await supabase
      .from('auth_user.user')
      .select('user_id')
      .eq('email', email)
      .maybeSingle();
    console.log(emailError);

    // Check if the user_name already exists
    const { data: existingUserName, error: userNameError } = await supabase
      .from('auth_user.user')
      .select("user_id")
      .eq("user_name", user_name)
      .maybeSingle();

    // Handle email errors
    if (emailError) {
      console.log(emailError);
      throw new Error("Error checking email: " + emailError.message);
    }
    if (existingEmail) {
      throw new Error("The email is already registered");
    }

    // Handle user_name errors
    if (userNameError) {
      throw new Error("Error checking user_name: " + userNameError.message);
    }
    if (existingUserName) {
      throw new Error("The user_name is already registered");
    }

    // Generate salt
    const salt = crypto.randomBytes(16).toString("hex");

    // Create password hash + salt
    const password_hash = await bcrypt.hash(password + salt, 10);

    // Prepare data to insert
    const insertData = {
      user_name,
      email,
      password_hash,
      salt,
      first_name,
      last_name
    };

    console.log("Inserting data:", insertData);

    // Insert into Supabase
    const { data: user, error: insertError } = await supabase
      .from('auth_user.user')
      .insert([insertData])
      .select()
      .maybeSingle();

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      throw new Error("Error registering the user: " + JSON.stringify(insertError));
    }

    return user;
  } catch (err) {
    console.error("Register user failed:", err);
    throw new Error(err.message || "Unknown error while registering user");
  }
};

// User login
export const loginUser = async (data) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new Error("Fields email and password are required");
  }

  try {
    // Find user by email
    const { data: user, error } = await supabase
      .from('auth_user.user')
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error || !user) {
      console.error("Supabase login error:", error);
      throw new Error("Invalid credentials");
    }

    // Verify password using salt
    const validPassword = await bcrypt.compare(password + user.salt, user.password_hash);
    if (!validPassword) {
      throw new Error("Invalid credentials");
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.user_id, email: user.email, user_name: user.user_name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { user, token };
  } catch (err) {
    console.error("Login user failed:", err);
    throw new Error(err.message || "Unknown error during login");
  }
};
