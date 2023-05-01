import {Result} from "./result";

export class UserModel {
  result: Result;
  request_id: string;
  status: string;
  queries: string[];
  token?: string;

  public static fromJson(json: any): UserModel {
    return Object.assign(new UserModel(), json);
  }

  public toJson() {
    return JSON.parse(JSON.stringify(this));
  }
}

