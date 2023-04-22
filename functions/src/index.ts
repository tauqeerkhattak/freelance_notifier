import * as functions from "firebase-functions";
// import {sendEmail} from "./services/email_service";
import {syncUserProjects} from "./services/firebase_service";

// exports.userProjectsCron = functions
//     .pubsub
//     .schedule("*/5 * * * *")
//     .onRun(async (context) => {
//       const date: Date = new Date();
//
//       try {
//         console.log("Running at: ", date);
//         await getUserProjects();
//         return;
//       } catch (e) {
//         console.log("Could not run function at: ", date);
//         await sendEmail(e + " was thrown at " + date);
//         return;
//       }
//     });

exports.syncUserProjects = functions
    .runWith({timeoutSeconds: 540, memory: "1GB"})
    .https
    .onRequest(async (req, res) => {
      try {
        const data = await syncUserProjects();
        res.json({success: true, message: data});
      } catch (e) {
        console.log("Exception: ", e);
        res.json({success: false, message: "Error: " + e});
      }
    });
