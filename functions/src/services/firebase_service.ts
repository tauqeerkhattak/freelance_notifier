import {apiBaseUrl, db, freelanceClientId, freelanceClientSecret, refreshUrl, redirectUri} from "../utils/constants";
import {UserModel} from "../models/user_model";
import {Token} from "../models/token";
import axios, {AxiosResponse} from "axios";
import {sendEmail} from "./email_service";
import {Project} from "../models/project";
import {sendNewProjectsNotification} from "./notification_service";

export async function syncUserProjects(): Promise<any | undefined> {
  const userQuery = await db.collection("users").get();
  console.log("Total users: ", userQuery.size);
  const users: UserModel[] = userQuery.docs.map((doc) => {
    return UserModel.fromJson(doc.data());
  });
  const errors: string[] = [];
  for (const user of users) {
    try {
      return await updateUserProjects(user);
    } catch (e: any) {
      console.log("Exception: ", e);
      if (e?.message != null) {
        errors.push(e.message);
      }
    }
  }
  if (errors.length > 0) {
    const errorText = errors.join("\n\n");
    await sendEmail(errorText);
  }
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
  let token = tokens[0];
  if (token.isExpired()) {
    console.log("Token is expired");
    token = await refreshToken(token, user.result.id.toString());
  } else {
    console.log("Token is not expired!");
    return await getProjects(
        token.access_token,
        user,
    );
  }
}

async function refreshToken(token: Token, userId: string): Promise<Token> {
  try {
    const response = await axios.post(refreshUrl, {
      grant_type: "refresh_token",
      refresh_token: token.refresh_token,
      client_id: freelanceClientId,
      client_secret: freelanceClientSecret,
      redirect_uri: redirectUri,
    }, {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
    });
    if (response.status !== 200) {
      const date = new Date();
      const errorMessage = response.statusText + " at " + date + " for user: " + userId;
      throw errorMessage;
    }
    const newToken = Token.fromJson(response.data);
    const ref = db.collection("users").doc(userId).collection("tokens");
    await db.recursiveDelete(ref);
    await db.collection("users").doc(userId).collection("tokens").add(newToken.toJson());
    return newToken;
  } catch (e: any) {
    console.log("Error: ", e?.message);
    throw e;
  }
}

async function getProjects(token: string, user: UserModel): Promise<any> {  
  try {
    const userQuery: string = user.queries.join(" ");
    console.log("User Query: ", userQuery);
    const response: AxiosResponse = await axios.get(apiBaseUrl + "/projects/0.1/projects/all/", {
      params: {
        query: userQuery,
        project_statuses: [
          "active",
        ],
        full_description: true,
        or_search_query: true,
      },
    });
    if (response.status !== 200) {
      const errorText = response.statusText + " for user: " + user.result.username;
      throw Error(errorText);
    } else {
      console.log("Status: ", response.statusText);
      const rawData: any[] = response.data["result"]["projects"];
      console.log("Headers: ", response.headers);
      const projects: Project[] = rawData.map((data) => {
        return Project.fromJson(data);
      });
      console.log("Total projects: ", projects.length);
      
      await saveProjects(projects, user);
    }
  } catch (e: any) {
    const errorText = e?.message + " for user: " + user.result.id;
    throw Error(errorText);
  }
}

async function saveProjects(projects: Project[], user: UserModel): Promise<void> {
  const batch = db.batch();
  const userID: string = user.result.id.toString();
  const ref = await db
      .collection("users")
      .doc(userID)
      .collection("projects")
      .get();
  const oldProjects: Project[] = ref.docs.map((doc) => {
    return Project.fromJson(doc.data());
  });
  let count = 0;
  for (const project of projects) {
    const exists = oldProjects.some((old) => {
      return old.id == project.id;
    });
    if (exists) {
      continue;
    } else {
      count++;
      const doc = db
          .collection("users")
          .doc(userID)
          .collection("projects")
          .doc();
      batch.set(doc, project.toJson());
    }
  }
  await sendNewProjectsNotification({user: user, count: count});
  console.log("New projects count: ", count);
  await batch.commit();
}
