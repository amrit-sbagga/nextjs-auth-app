import { hashedPassword } from "../../../lib/auth";
import { connectToDatabase } from "../../../lib/db";

async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }
  const data = req.body;
  const { email, password } = data;

  if (
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 7
  ) {
    res
      .status(422)
      .json({
        message:
          "Invalid input - password should be atleast 7 characters long.",
      });
    return;
  }

  const client = await connectToDatabase();

  const db = client.db();

  // check if user with this email already exists
  const existingUser = await db.collection("users").findOne({
      email : email
  });

  if(existingUser){
    res.status(422).json({message : 'User Already exists!'});
    client.close();
    return;
  }

  const hashPassword = await hashedPassword(password);
  const result = await db.collection("users").insertOne({
    email: email,
    password: hashPassword,
  });

  res.status(201).json({ message: "Created user!" });
  client.close();
}

export default handler;
