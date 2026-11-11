# crypto-kit — API reference

**Version 1.0.0.** **The shared crypto core for drsamonline apps.** One file, no dependencies, built on the Web Crypto API.

Generated from the source in this repository: every name, argument and
note below is read out of the kit file, so it cannot describe a function
that is not there.

```js
<script src="crypto-kit.js"></script>
Kit.available(...)
// or: const Kit = require('./crypto-kit.js')
```

## The surface (13 entries)

| Name | Arguments | What it does |
|---|---|---|
| `Kit.available` | `()` | — |
| `Kit.bytes` | `()` | — |
| `Kit.randomBytes` | `(n)` | — |
| `Kit.deriveKey` | `(passphrase, salt, iterations)` | — |
| `Kit.newKey` | `()` | — |
| `Kit.exportKey` | `(key)` | — |
| `Kit.importKey` | `(raw)` | — |
| `Kit.encrypt` | `(key, plaintext, opts)` | — |
| `Kit.decrypt` | `(key, box, opts)` | — |
| `Kit.seal` | `(plaintext, passphrase, opts)` | — |
| `Kit.open` | `(envelope, passphrase, opts)` | — |
| `Kit.sealString` | `(text, passphrase, opts)` | — |
| `Kit.openString` | `(b64, passphrase, opts)` | — |

## Notes

- Zero dependencies, one file, no build step: it works from `file://`, from a
  `<script>` tag and from Node.
- The version above is the `VERSION` file in this repository; a pinned copy is
  what an app vendors.
