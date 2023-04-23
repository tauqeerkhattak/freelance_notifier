import {apiBaseUrl, db} from "../utils/constants";
import {UserModel} from "../models/user_model";
import {Token} from "../models/token";
import axios, {AxiosError, AxiosResponse} from "axios";
import {sendEmail} from "./email_service";
import {Project} from "../models/project";

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
  const token = tokens[0];
  if (token.isExpired()) {
    console.log("Token is expired");
    // / TODO: refresh code added here
  } else {
    console.log("Token is not expired!");
    // / TODO: _getProjects here!
    return await getProjects(token.access_token, user.result.display_name, user.result.id.toString());
  }
}

async function getProjects(token: string, username: string, userId: string): Promise<any> {  
  try {
    const response: AxiosResponse = await axios.get(apiBaseUrl + "/projects/0.1/projects/all/", {
      params: {
        query: "flutter",
        project_statuses: [
          "frozen",
          "active",
        ],
      },
    });
    if (response.status !== 200) {
      const errorText = response.statusText + " for user: " + username;
      throw Error(errorText);
    } else {
      console.log("Status: ", response.statusText);
      const rawData: any[] = response.data["result"]["projects"];
      const projects: Project[] = rawData.map((data) => {
        return Project.fromJson(data);
      });
      console.log("Total projects: ", projects.length);
      
      await saveProjects(projects, userId);
    }
  } catch (e: any) {
    const errorText = e?.message + " for user: " + username;
    throw Error(errorText);
  }
}

async function saveProjects(projects: Project[], userId: string): Promise<void> {
  const batch = db.batch();
  for (const project of projects) {
    const doc = db
        .collection("users")
        .doc(userId)
        .collection("projects")
        .doc(project.id.toString());
    batch.set(doc, project.toJson());
  }
  await batch.commit();
}
