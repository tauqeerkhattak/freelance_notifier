import * as functions from "firebase-functions";
// import {sendEmail} from "./services/email_service";
import {syncUserProjects} from "./services/firebase_service";

exports.userProjectsCron = functions
    .runWith({timeoutSeconds: 540, memory: "2GB"})
    .pubsub
    .schedule("*/5 * * * *")
    .onRun(async (context) => {
      const date: Date = new Date();
      console.log("Running at: ", date);
      await syncUserProjects();
      return;
    });

// exports.syncUserProjects = functions
//     .runWith({timeoutSeconds: 540, memory: "1GB"})
//     .https
//     .onRequest(async (req, res) => {
//       try {
//         const data = await syncUserProjects();
//         res.json({success: true, message: data});
//       } catch (e) {
//         console.log("Exception: ", e);
//         res.json({success: false, message: "Error: " + e});
//       }
//     });
