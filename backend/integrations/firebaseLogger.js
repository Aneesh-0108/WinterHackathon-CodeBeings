const admin = require("firebase-admin");
const path = require("path");

let initialized = false;

function initFirebase() {
  if (initialized) return;

  const serviceAccount = require(path.join(
    __dirname,
    "..",
    "firebaseServiceAccount.json"
  ));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  initialized = true;
}

async function logEscalation(data) {
  try {
    initFirebase();

    const db = admin.firestore();

    await db.collection("escalations").add({
      ...data,
      timestamp: new Date(),
      status: "open",
      source: "chatbot",
    });
  } catch (err) {
    console.error("Firebase escalation logging failed:", err.message);
  }
}

module.exports = { logEscalation };
