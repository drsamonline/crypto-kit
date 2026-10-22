# crypto-kit

[![live](https://img.shields.io/badge/live-online-22c55e)](https://drsamonline.github.io/crypto-kit/)
[![license](https://img.shields.io/badge/license-MIT-blue)](LICENSE)


**The shared crypto core for drsamonline apps.** One file, no dependencies,
built on the Web Crypto API.

Apps should never hand-roll cryptography. This is the one place it lives — the
browser-side counterpart to what `lockhtml` does on the command line:

- **AES-256-GCM** — authenticated encryption, so tampering is detected;
- **passphrase keys** via **PBKDF2-SHA256**;
- a portable **sealed envelope** (`salt + iv + ciphertext`) as bytes or base64;
- a **one-time-view** helper (seal with a random key, delete it after first open);
- byte / text / base64 helpers.

## Use it

```js
// passphrase-sealed note
const b64 = await CryptoKit.sealString("meet me at 7", "correct horse");
const text = await CryptoKit.openString(b64, "correct horse");   // -> "meet me at 7"

// or a key you manage yourself
const key = await CryptoKit.newKey();
const box = await CryptoKit.encrypt(key, CryptoKit.bytes.fromText("hi"));
const back = await CryptoKit.decrypt(key, box);
```

## API

| Call | Does |
|---|---|
| `CryptoKit.seal(bytes, passphrase, opts)` | Returns the sealed envelope (Uint8Array). |
| `CryptoKit.open(envelope, passphrase, opts)` | Decrypts; **throws** on wrong passphrase or tampering. |
| `CryptoKit.sealString` / `openString` | The same, as base64 strings. |
| `CryptoKit.deriveKey(pass, salt, iters)` | A PBKDF2 AES-256 key. |
| `CryptoKit.encrypt` / `decrypt` | AES-GCM with a key you hold. |
| `CryptoKit.newKey` / `exportKey` / `importKey` | Random keys, for one-time view. |
| `CryptoKit.randomBytes(n)` | Cryptographically random bytes. |

`opts.aad` adds associated data (bound to the ciphertext, not encrypted).
`opts.iterations` sets the PBKDF2 cost (default 250,000).

## One-time view

Seal with a random key, give the key out-of-band, and delete it after the first
`open`. `crypto-kit` gives you the primitives; the app owns the "used once" state.

## Secure context

Web Crypto needs **https or localhost**. GitHub Pages is https, so deployed apps
are fine; opening a page from `file://` may not be.

## Verified

```
node test-node.js
7 passed, 0 failed
```

Covers: round-trip, wrong passphrase rejected, tampering detected, AAD mismatch
rejected, base64 round-trip, key export/import, and unicode.

## Licence

MIT. (c) 2026 Dr Sohil Momin. Part of the Forge system — kits open, orchestrator licensed.
