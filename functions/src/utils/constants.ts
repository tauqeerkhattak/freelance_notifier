import * as admin from "firebase-admin";
import {getFirestore} from "firebase-admin/firestore";
import {getMessaging} from "firebase-admin/messaging";

admin.initializeApp();
export const db = getFirestore();
export const fcm = getMessaging();

export const apiBaseUrl = "https://www.freelancer.com/api";
export const refreshUrl = "https://accounts.freelancer.com/oauth/token";
// Debug - sandbox
// export const freelanceClientId = "a24fb7a0-e0f2-4924-a229-0c7a9e82dd99";
export const freelanceClientId = "d29afe08-2da1-419a-8a89-72651c3387df";
// Debug - sandbox
// export const freelanceClientSecret = "385889c4efa3cf8c90f3dd08fce8de776763cc27e387e418b76e92caea4d25308d603df685a7ea91d26ab96520b3a14bded17aa6a9d6bc09c1d83ac29346bac8";
export const freelanceClientSecret = "4d711f5d8317ce974b45c438dcced8d93a7d0ff46d2d25ae8f8618ef4f3d00a3bb07d8c1e964e3c9ec94b58f2308b1acf311e23f1aab93a13574eca01ff7fb94";
export const redirectUri = "http://localhost";

