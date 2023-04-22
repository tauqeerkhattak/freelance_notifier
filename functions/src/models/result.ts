import {Location} from "./location";
import {Timezone} from "./timezone";

export class Result {
  limited_account: boolean;
  is_active?: boolean;
  role: string;
  timezone: Timezone;
  primary_language: string;
  avatar?: string;
  display_name: string;
  is_profile_visible: boolean;
  suspended?: boolean;
  force_verify?: boolean;
  registration_date: number;
  chosen_role: string;
  closed: boolean;
  location: Location;
  id: number;
  email?: string;
  username: string;

  public static fromJson(json: any): Result {
    return Object.assign(new Result(), json);
  }

  public toJson() {
    return JSON.parse(JSON.stringify(this));
  }
}
