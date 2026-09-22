/**
 * Lazy Firebase Admin initializer for seed/migration scripts.
 *
 * Admin SDK access bypasses Firestore security rules, so content writes from
 * scripts keep working after `firestore.rules` deny all client writes.
 * A service account is NEVER committed — supply it at runtime via:
 *   - FIREBASE_SERVICE_ACCOUNT  (JSON string of the service-account key)
 *   - GOOGLE_APPLICATION_CREDENTIALS (path to a service-account JSON file)
 *
 * Initialization is deferred until the first actual write, so `DRY_RUN`
 * runs still work without credentials.
 */
import fs from "node:fs";
import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let dbPromise = null;

const PROJECT_ID = "learning-832c9";

function credentials() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    return cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT));
  }
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    if (!fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
      throw new Error(
        `GOOGLE_APPLICATION_CREDENTIALS points to a missing file: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`,
      );
    }
    return applicationDefault();
  }
  throw new Error(
    "No Firebase service account configured. Set FIREBASE_SERVICE_ACCOUNT (JSON string) " +
      "or GOOGLE_APPLICATION_CREDENTIALS (file path) before running a real (non-DRY_RUN) seed. " +
      "Keep service-account files out of git.",
  );
}

export function getAdminFirestore() {
  if (!dbPromise) {
    dbPromise = initializeApp({ credential: credentials(), projectId: PROJECT_ID }).then(() => getFirestore());
  }
  return dbPromise;
}

/**
 * Convert a Firestore REST "Fields" object ({ field: { stringValue } })
 * into the plain JS values the Admin SDK expects, recursively.
 */
function toJs(v) {
  if (v == null) return null;
  if (typeof v !== "object") return v;
  if ("stringValue" in v) return v.stringValue;
  if ("booleanValue" in v) return v.booleanValue;
  if ("integerValue" in v) return Number(v.integerValue);
  if ("doubleValue" in v) return Number(v.doubleValue);
  if ("arrayValue" in v) return (v.arrayValue.values ?? []).map(toJs);
  if ("mapValue" in v) return toJsMap(v.mapValue.fields ?? {});
  if ("timestampValue" in v) return v.timestampValue;
  if ("referenceValue" in v) return v.referenceValue;
  if ("geoPointValue" in v) return v.geoPointValue;
  return null;
}

function toJsMap(fields) {
  const out = {};
  for (const [k, val] of Object.entries(fields)) out[k] = toJs(val);
  return out;
}

export function fieldsToJs(fields) {
  return toJsMap(fields);
}

export async function patchChapterDoc(docId, fields) {
  const db = await getAdminFirestore();
  await db.doc(`chapters/${docId}`).set(fieldsToJs(fields), { merge: true });
}