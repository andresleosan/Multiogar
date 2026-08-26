import { createHash } from "node:crypto";
import type { Firestore } from "firebase-admin/firestore";

export interface RateLimitPolicy {
  limit: number;
  windowMs: number;
  minIntervalMs?: number;
}

export interface RateLimitState {
  count: number;
  windowStartedAt: number;
  lastRequestAt: number;
}

export interface RateLimitDecision {
  allowed: boolean;
  retryAfterSeconds: number;
  nextState: RateLimitState;
}

export function nextRateLimitState(
  current: RateLimitState | null,
  now: number,
  policy: RateLimitPolicy,
): RateLimitDecision {
  const isNewWindow = !current || now - current.windowStartedAt >= policy.windowMs;
  const state = isNewWindow
    ? { count: 0, windowStartedAt: now, lastRequestAt: 0 }
    : current;

  const minIntervalRemaining = Math.max(
    0,
    (policy.minIntervalMs ?? 0) - (now - state.lastRequestAt),
  );
  if (state.lastRequestAt > 0 && minIntervalRemaining > 0) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil(minIntervalRemaining / 1000)),
      nextState: state,
    };
  }

  if (state.count >= policy.limit) {
    const remaining = policy.windowMs - (now - state.windowStartedAt);
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil(remaining / 1000)),
      nextState: state,
    };
  }

  return {
    allowed: true,
    retryAfterSeconds: 0,
    nextState: {
      count: state.count + 1,
      windowStartedAt: state.windowStartedAt,
      lastRequestAt: now,
    },
  };
}

export async function consumeRateLimit(
  db: Firestore,
  key: string,
  policy: RateLimitPolicy,
): Promise<RateLimitDecision> {
  const documentId = createHash("sha256").update(key).digest("hex");
  const reference = db.collection("chatRateLimits").doc(documentId);

  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(reference);
    const data = snapshot.data();
    const current = snapshot.exists
      ? {
          count: Number(data?.count ?? 0),
          windowStartedAt: Number(data?.windowStartedAt ?? 0),
          lastRequestAt: Number(data?.lastRequestAt ?? 0),
        }
      : null;
    const decision = nextRateLimitState(current, Date.now(), policy);

    if (decision.allowed) {
      transaction.set(reference, decision.nextState, { merge: true });
    }
    return decision;
  });
}
