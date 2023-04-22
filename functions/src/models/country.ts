export class Country {
  highres_flag_url_cdn?: string;
  code?: any;
  highres_flag_url?: string;
  flag_url_cdn?: string;
  name?: string;
  flag_url?: null;

  public static fromJson(json: any): Country {
    return Object.assign(new Country(), json);
  }

  public toJson() {
    return JSON.parse(JSON.stringify(this));
  }
}
