import {Country} from "./country";

export class Location {
  country: Country;
  city: string;
  latitude?: number;
  administrative_area?: string;
  vicinity?: string;
  full_address?: string;
  longitude?: string;

  public static fromJson(json: any): Location {
    return Object.assign(new Location(), json);
  }

  public toJson() {
    return JSON.parse(JSON.stringify(this));
  }
}
