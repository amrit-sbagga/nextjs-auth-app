import { hashedPassword } from "../../../lib/auth";
import { connectToDatabase } from "../../../lib/db";

async function handler(req, res){
    const data = req.body;
    const { email, password } = data;

    if(!email || !email.includes('@') || !password || password.trim().length < 7){
        res.status(422).json({message : 'Invalid input - password should be atleast 7 characters long.'})
        return;
    }

    const client = await connectToDatabase();

    const db = client.db();

    const hashPassword = hashedPassword(password);
    const result = await db.collection('users').insertOne({
        email : email,
        password : hashPassword
    });

    res.status(201).json({message : 'Created user!'})
}

export default handler;