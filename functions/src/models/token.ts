import { Timestamp } from "firebase-admin/firestore";
import moment from "moment";

export class Token {
    public access_token: string;
    public refresh_token: string;
    public scope: string;
    public token_type: string;
    public expires_in: Date;

    public static fromJson(json: any): Token {
        const timestamp: Timestamp = json["expires_in"];
        const date: Date = timestamp.toDate();
        json["expires_in"] = date;
        const token: Token = Object.assign(new Token(), json);
        return token;
    }

    public toJson(): any {
        return JSON.parse(JSON.stringify(this));
    }

    public isExpired(): boolean {
        const now: Date = new Date();
        return moment(now).isAfter(this.expires_in);
    }
}