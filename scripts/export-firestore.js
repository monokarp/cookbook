const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const SERVICE_ACCOUNT_PATH = path.join(__dirname, "service-account.json");
const OUTPUT_DIR = path.join(__dirname, "..");

const COLLECTIONS = ["prepacks", "products", "recipes"];

if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
    console.error(`Service account key not found at ${SERVICE_ACCOUNT_PATH}`);

    process.exit(1);
}

admin.initializeApp({
    credential: admin.credential.cert(require(SERVICE_ACCOUNT_PATH)),
});

const db = admin.firestore();

async function exportCollection(name) {
    const snapshot = await db.collection(name).get();

    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const outputPath = path.join(OUTPUT_DIR, `${name}.json`);

    fs.writeFileSync(outputPath, JSON.stringify(docs, null, 2));
    console.log(`${name}: ${docs.length} docs → ${outputPath}`);
}

async function main() {
    console.log(`Exporting ${COLLECTIONS.length} collection(s)...`);

    for (const name of COLLECTIONS) {
        await exportCollection(name);
    }

    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
