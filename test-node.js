/* Node test for crypto-kit. Node 20 exposes globalThis.crypto.subtle. */
require(require("path").join(__dirname, "crypto-kit.js"));
const CK = global.CryptoKit;
const IT = 5000; // low iterations to keep the test fast

function bytesEqual(a, b) { if (a.length !== b.length) return false; for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false; return true; }

let pass = 0, fail = 0;
async function ok(name, fn) { try { await fn(); pass++; console.log("PASS  " + name); } catch (e) { fail++; console.log("FAIL  " + name + "  — " + e.message); } }
function shouldThrow(promise) { return promise.then(() => { throw new Error("expected rejection"); }, () => true); }

(async function () {
  await ok("encrypt/decrypt round-trip", async () => {
    const key = await CK.deriveKey("correct horse", CK.randomBytes(16), IT);
    const msg = CK.bytes.fromText("the quick brown fox");
    const box = await CK.encrypt(key, msg);
    const back = await CK.decrypt(key, box);
    if (!bytesEqual(msg, back)) throw new Error("mismatch");
  });

  await ok("wrong passphrase is rejected", async () => {
    const env = await CK.seal(CK.bytes.fromText("secret"), "right-pass", { iterations: IT });
    await shouldThrow(CK.open(env, "wrong-pass"));
  });

  await ok("tampering is detected", async () => {
    const env = await CK.seal(CK.bytes.fromText("secret"), "pw", { iterations: IT });
    env[env.length - 1] ^= 0xFF; // flip a ciphertext bit
    await shouldThrow(CK.open(env, "pw"));
  });

  await ok("AAD mismatch is rejected", async () => {
    const key = await CK.deriveKey("pw", CK.randomBytes(16), IT);
    const box = await CK.encrypt(key, CK.bytes.fromText("x"), { aad: CK.bytes.fromText("A") });
    await shouldThrow(CK.decrypt(key, box, { aad: CK.bytes.fromText("B") }));
  });

  await ok("sealString/openString round-trip", async () => {
    const b64 = await CK.sealString("hello world", "pw", { iterations: IT });
    const back = await CK.openString(b64, "pw");
    if (back !== "hello world") throw new Error("mismatch: " + back);
  });

  await ok("key export/import round-trip", async () => {
    const k1 = await CK.newKey();
    const raw = await CK.exportKey(k1);
    const k2 = await CK.importKey(raw);
    const box = await CK.encrypt(k1, CK.bytes.fromText("one-time view"));
    const back = await CK.decrypt(k2, box);
    if (CK.bytes.toText(back) !== "one-time view") throw new Error("mismatch");
  });

  await ok("unicode survives the round-trip", async () => {
    const s = "नमस्ते · કેમ છો · hello";
    const b64 = await CK.sealString(s, "pw", { iterations: IT });
    if (await CK.openString(b64, "pw") !== s) throw new Error("mismatch");
  });

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
