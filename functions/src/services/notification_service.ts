import {UserModel} from "../models/user_model";
import {db, fcm} from "../utils/constants";

export async function sendNewProjectsNotification(params: {
    user: UserModel,
    count: number,
}): Promise<void> {
  if (params.count == 0) {
    return;
  }
  if (params.user.result.id) {
    const token: string | undefined = params.user.token;
    if (token) {
      const result = await fcm.send({
        token: token,
        notification: {
          title: "New projects available!",
          body: "Total "+ params.count + " new projects, click to see them now.",
        },
        android: {
          priority: "high",
        },
      });
      console.log("Result: ", result);
    } else {
      throw Error("Token is null");
    }
  } else {
    throw Error("User ID is null");
  }
}
