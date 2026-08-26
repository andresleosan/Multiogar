import { getVercelOidcToken } from "@vercel/oidc";
import { Firestore as GoogleCloudFirestore } from "@google-cloud/firestore";
import {
  cert,
  getApps,
  initializeApp,
  type App,
  type Credential,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

export class FirebaseAdminConfigurationError extends Error {
  constructor() {
    super("Firebase Admin no estÃ¡ configurado.");
    this.name = "FirebaseAdminConfigurationError";
  }
}

type OidcConfig = {
  projectNumber: string;
  serviceAccountEmail: string;
  poolId: string;
  providerId: string;
};

let oidcFirestore: GoogleCloudFirestore | null = null;

function getProjectId() {
  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID ??
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) throw new FirebaseAdminConfigurationError();
  return projectId;
}

function getOidcConfig(): OidcConfig | null {
  const config = {
    projectNumber: process.env.GCP_PROJECT_NUMBER,
    serviceAccountEmail: process.env.GCP_SERVICE_ACCOUNT_EMAIL,
    poolId: process.env.GCP_WORKLOAD_IDENTITY_POOL_ID,
    providerId: process.env.GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID,
  };
  const values = Object.values(config);
  if (values.every(Boolean)) return config as OidcConfig;
  if (values.some(Boolean)) throw new FirebaseAdminConfigurationError();
  return null;
}

async function getOidcFirestoreDb(
  projectId: string,
  config: OidcConfig,
): Promise<Firestore> {
  const directory = join(tmpdir(), "multiogar-oidc");
  const tokenPath = join(directory, "vercel-oidc-token");
  const credentialsPath = join(directory, "external-account.json");

  try {
    const token = await getVercelOidcToken();
    await mkdir(directory, { recursive: true, mode: 0o700 });
    await writeFile(tokenPath, token, { encoding: "utf8", mode: 0o600 });
    if (!oidcFirestore) {
      await writeFile(
        credentialsPath,
        JSON.stringify({
          type: "external_account",
          audience: `//iam.googleapis.com/projects/${config.projectNumber}/locations/global/workloadIdentityPools/${config.poolId}/providers/${config.providerId}`,
          subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
          token_url: "https://sts.googleapis.com/v1/token",
          service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${config.serviceAccountEmail}:generateAccessToken`,
          credential_source: { file: tokenPath, format: { type: "text" } },
        }),
        { encoding: "utf8", mode: 0o600 },
      );
      oidcFirestore = new GoogleCloudFirestore({
        projectId,
        keyFilename: credentialsPath,
      });
    }
    return oidcFirestore as unknown as Firestore;
  } catch {
    throw new FirebaseAdminConfigurationError();
  }
}

function getAdminCredential(projectId: string): Credential {
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!clientEmail || !privateKey) throw new FirebaseAdminConfigurationError();
  return cert({ projectId, clientEmail, privateKey });
}

function getAdminApp(): App {
  const existingApp = getApps()[0];
  if (existingApp) return existingApp;

  const projectId = getProjectId();
  return initializeApp({
    credential: getAdminCredential(projectId),
    projectId,
  });
}

export async function getAdminFirestore(): Promise<Firestore> {
  const projectId = getProjectId();
  const oidcConfig = getOidcConfig();
  if (oidcConfig) return getOidcFirestoreDb(projectId, oidcConfig);
  return getFirestore(getAdminApp());
}
