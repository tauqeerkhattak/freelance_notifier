import {apiBaseUrl, db} from "../utils/constants";
import {UserModel} from "../models/user_model";
import {Token} from "../models/token";
import axios, {AxiosResponse} from "axios";
import {sendEmail} from "./email_service";

export async function syncUserProjects(): Promise<any | undefined> {
  const userQuery = await db.collection("users").get();
  console.log("Total users: ", userQuery.size);
  const users: UserModel[] = userQuery.docs.map((doc) => {
    return UserModel.fromJson(doc.data());
  });
  for (const user of users) {
    try {
      return await updateUserProjects(user);
    } catch (e) {
      console.log("Exception: ", e);
      sendEmail("Exception: " + e);
    }
  }
  return users[0];
}

async function updateUserProjects(user: UserModel): Promise<any> {
  const tokenQuery = await db
      .collection("users")
      .doc(user.result.id.toString())
      .collection("tokens")
      .get();
  const tokens: Token[] = tokenQuery.docs.map((doc) => {
    return Token.fromJson(doc.data());
  });
  if (tokens.length == 0) {
    return;
  }
  const token = tokens[0];
  if (token.isExpired()) {
    console.log("Token is expired");
    // / TODO: refresh code added here
  } else {
    console.log("Token is not expired!");
    // / TODO: _getProjects here!
    return await getProjects(token.access_token);
  }
}

async function getProjects(token: string): Promise<any> {
  console.log("TOKEN: ", token);
  
  const response: AxiosResponse = await axios.get(apiBaseUrl + "/projects/0.1/projects/all/", {
    params: {
      query: "python",
    },
  });
  if (response.status !== 200) {
    throw response.statusText;
  }
  console.log("Status: ", response.statusText);
  
  return response.data;
}
