import {db} from "../utils/constants";
import {UserModel} from "../models/user_model";

export async function syncUserProjects(): Promise<UserModel | undefined> {
  try {
    const userQuery = await db.collection("users").get();
    console.log("Total users: ", userQuery.size);
    const users: UserModel[] = userQuery.docs.map((doc) => {
      return UserModel.fromJson(doc.data());
    });
    for (const user of users) {
      await updateUserProjects(user);
    }
    return users[0];
  } catch (e) {
    console.log("Exception: ", e);
    return undefined;
  }
}

async function updateUserProjects(user: UserModel): Promise<void> {
  try {
    const tokenQuery = await db
        .collection("users")
        .doc(user.result.id.toString())
        .collection("tokens")
        .get();
    console.log("Token: ", tokenQuery.docs[0].data());
  } catch (e) {
    console.log("Exception: ", e);
  }
}
