export class Timezone {
  country: string;
  offset: number;
  timezone: string;
  id: number;

  public static fromJson(json: any): Timezone {
    return Object.assign(new Timezone(), json);
  }

  public toJson() {
    return JSON.parse(JSON.stringify(this));
  }
}
