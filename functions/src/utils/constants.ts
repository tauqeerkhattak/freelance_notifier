import * as admin from "firebase-admin";
import {getFirestore} from "firebase-admin/firestore";

admin.initializeApp();
export const db = getFirestore();

export const apiBaseUrl = "https://www.freelancer-sandbox.com/api";
