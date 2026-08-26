import { getVercelOidcToken } from "@vercel/oidc";
import {
  cert,
  getApps,
  initializeApp,
  type App,
  type Credential,
  type GoogleOAuthAccessToken,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { ExternalAccountClient } from "google-auth-library";

export class FirebaseAdminConfigurationError extends Error {
  constructor() {
    super("Firebase Admin no está configurado.");
    this.name = "FirebaseAdminConfigurationError";
  }
}

class VercelOidcCredential implements Credential {
  private readonly authClient;

  constructor({
    projectNumber,
    serviceAccountEmail,
    poolId,
    providerId,
  }: {
    projectNumber: string;
    serviceAccountEmail: string;
    poolId: string;
    providerId: string;
  }) {
    const authClient = ExternalAccountClient.fromJSON({
      type: "external_account",
      audience: `//iam.googleapis.com/projects/${projectNumber}/locations/global/workloadIdentityPools/${poolId}/providers/${providerId}`,
      subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
      token_url: "https://sts.googleapis.com/v1/token",
      service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${serviceAccountEmail}:generateAccessToken`,
      subject_token_supplier: {
        // Google passes its supplier context as options; do not let that
        // override Vercel's fixed audience (`https://vercel.com/<team>`).
        getSubjectToken: async () => getVercelOidcToken(),
      },
    });

    if (!authClient) {
      throw new FirebaseAdminConfigurationError();
    }
    this.authClient = authClient;
  }

  async getAccessToken(): Promise<GoogleOAuthAccessToken> {
    const { token } = await this.authClient.getAccessToken();
    if (!token) throw new FirebaseAdminConfigurationError();

    const expiryDate = this.authClient.credentials.expiry_date;
    const expiresIn = expiryDate
      ? Math.max(60, Math.floor((expiryDate - Date.now()) / 1_000))
      : 3_000;

    return { access_token: token, expires_in: expiresIn };
  }
}

function getAdminCredential(projectId: string): Credential {
  const oidcConfig = {
    projectNumber: process.env.GCP_PROJECT_NUMBER,
    serviceAccountEmail: process.env.GCP_SERVICE_ACCOUNT_EMAIL,
    poolId: process.env.GCP_WORKLOAD_IDENTITY_POOL_ID,
    providerId: process.env.GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID,
  };
  const oidcValues = Object.values(oidcConfig);

  if (oidcValues.every(Boolean)) {
    return new VercelOidcCredential(
      oidcConfig as {
        projectNumber: string;
        serviceAccountEmail: string;
        poolId: string;
        providerId: string;
      },
    );
  }
  if (oidcValues.some(Boolean)) throw new FirebaseAdminConfigurationError();

  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!clientEmail || !privateKey) throw new FirebaseAdminConfigurationError();

  return cert({ projectId, clientEmail, privateKey });
}

function getAdminApp(): App {
  const existingApp = getApps()[0];
  if (existingApp) return existingApp;

  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID ??
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) throw new FirebaseAdminConfigurationError();

  return initializeApp({
    credential: getAdminCredential(projectId),
    projectId,
  });
}

export function getAdminFirestore(): Firestore {
  return getFirestore(getAdminApp());
}
