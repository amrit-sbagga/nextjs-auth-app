import { getSession } from "next-auth/react";
import { connectToDatabase } from "../../../lib/db";
import { hashedPassword, verifyPassword } from "../../../lib/auth";

async function handler(req, res) {
  if (req.method !== "PATCH") {
    return;
  }

  try {
    const session = await getSession({ req: req });

    if (!session) {
      res.status(401).json({ message: "Not authenticated!" });
      return;
    }

    const userEmail = session.user.email;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    const client = await connectToDatabase();

    const usersCollection = client.db().collection("users");

    const user = await usersCollection.findOne({
      email: userEmail,
    });

    if (!user) {
      res.status(404).json({ message: "User not found!" });
      client.close();
      return;
    }

    const currentPassword = user.password;

    const passwordsAreEqual = await verifyPassword(
      oldPassword,
      currentPassword
    );

    if (!passwordsAreEqual) {
      res.status(403).json({ message: "Invalid password!" });
      client.close();
      return;
    }

    //update password
    const newHashedPassword = await hashedPassword(newPassword);
    const result = await usersCollection.updateOne(
      { 'email': userEmail },
      {
        $set: { password: newHashedPassword },
      }
    );

    client.close();
    res.status(200).json({ message: "Password updated" });
  } catch (error) {
    //console.log("change-pwd error => ", error.message);
    res.status(500).json({ message: "Some error occured!"});
  }
}

export default handler;
