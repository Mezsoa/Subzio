import crypto from "node:crypto";

function b64url(buf: Buffer) {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export type StatePayload = { uid: string; nonce: string; exp: number };

export function signState(payload: StatePayload): string {
  const secret = process.env.TINK_STATE_SECRET || "";
  const header = b64url(Buffer.from(JSON.stringify({ alg: "HS256", typ: "STATE" })));
  const body = b64url(Buffer.from(JSON.stringify(payload)));
  const data = `${header}.${body}`;
  const sig = b64url(crypto.createHmac("sha256", secret).update(data).digest());
  return `${data}.${sig}`;
}

export function verifyState(token: string): StatePayload | null {
  try {
    const [h, b, s] = token.split(".");
    if (!h || !b || !s) return null;
    const secret = process.env.TINK_STATE_SECRET || "";
    const expected = b64url(crypto.createHmac("sha256", secret).update(`${h}.${b}`).digest());
    if (expected !== s) return null;
    const payload = JSON.parse(Buffer.from(b, "base64").toString()) as StatePayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

