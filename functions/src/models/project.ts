export class Project {
  id: number = null;
  owner_id: number = null;
  title: string = null;
  status: string = null;
  sub_status: string = null;
  seo_url: string = null;
  currency: Currency = null;
  description: string = null;
  jobs: string[] = [];
  preview_description: string = null;
  deleted: boolean = null;
  nonpublic: boolean = null;
  hidebids: boolean = null;
  type: string = null;
  bidperiod: number = null;
  budget: Budget = null;
  hourly_project_info: any = null;
  featured: boolean = null;
  urgent: boolean = null;
  assisted: boolean = null;
  active_prepaid_milestone: any = null;
  bid_stats: BidStats = null;
  time_submitted: number = null;
  time_updated: number = null;
  language: string = null;
  hireme: boolean = null;

  public static fromJson(json: any): Project {
    const project = new Project();
    const keys = Object.entries(project);
    const data = JSON.parse(JSON.stringify({}));
    
    for (const [key, value] of keys) {
      data[key] = json[key];
      value;
    }
    return Object.assign(project, data);
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}

export class BidStats {
  bid_count: number;
  bid_avg: number;

  public static fromJson(json: any): BidStats {
    return JSON.parse(JSON.stringify(json)) as BidStats; 
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}

export class Budget {
  minimum: number;
  maximum: number;
  name: string;
  project_type: string;
  currency_id: number;

  public static fromJson(json: any): Budget {
    return JSON.parse(JSON.stringify(json)) as Budget; 
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}

export class Currency {
  id: number;
  code: string;
  sign: string;
  name: string;
  exchange_rate: number;
  country: string;
  is_external: boolean;
  is_escrowcom_supported: boolean;

  public static fromJson(json: any): Currency {
    return JSON.parse(JSON.stringify(json)) as Currency; 
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}
