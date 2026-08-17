import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";
import worker from "../worker/index.js";

const requiredSecurityHeaders = {
  "content-security-policy": "default-src 'self'",
  "cross-origin-opener-policy": "same-origin",
  "permissions-policy": "camera=()",
  "referrer-policy": "strict-origin-when-cross-origin",
  "strict-transport-security": "max-age=63072000",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
};

function assertSecurityHeaders(response) {
  for (const [name, expected] of Object.entries(requiredSecurityHeaders)) {
    assert.match(response.headers.get(name) ?? "", new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
}

test("serves existing static assets without a fallback", async () => {
  const calls = [];
  const response = await worker.fetch(new Request("https://example.test/assets/app.js"), {
    ASSETS: {
      fetch: async (request) => {
        calls.push(new URL(request.url).pathname);
        return new Response("asset", { status: 200 });
      },
    },
  });

  assert.equal(response.status, 200);
  assert.deepEqual(calls, ["/assets/app.js"]);
  assert.equal(response.headers.get("cache-control"), "public, max-age=31536000, immutable");
  assertSecurityHeaders(response);
});

test("falls back to index.html for an unknown app route", async () => {
  const calls = [];
  const response = await worker.fetch(
    new Request("https://example.test/flow/step-two?source=share", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async (request) => {
          const url = new URL(request.url);
          calls.push(url.pathname + url.search);
          return new Response(url.pathname === "/index.html" ? "app" : "missing", {
            status: url.pathname === "/index.html" ? 200 : 404,
          });
        },
      },
    },
  );

  assert.equal(response.status, 200);
  assert.deepEqual(calls, ["/flow/step-two?source=share", "/index.html"]);
  assert.equal(response.headers.get("cache-control"), "no-cache");
  assert.match(response.headers.get("vary") ?? "", /Accept/);
  assertSecurityHeaders(response);
});

test("does not turn missing registry, API, quality-zero HTML, or write requests into the app shell", async () => {
  for (const request of [
    new Request("https://example.test/r/v/0.1.0-rc.8/missing.json", { headers: { accept: "text/html" } }),
    new Request("https://example.test/api/missing", { headers: { accept: "application/json" } }),
    new Request("https://example.test/flow", { headers: { accept: "text/html;q=0, application/json" } }),
    new Request("https://example.test/flow", { method: "POST", headers: { accept: "text/html" } }),
  ]) {
    let calls = 0;
    const response = await worker.fetch(request, {
      ASSETS: {
        fetch: async () => {
          calls += 1;
          return new Response("missing", { status: 404 });
        },
      },
    });

    assert.equal(response.status, 404);
    assert.equal(calls, 1);
    assertSecurityHeaders(response);
  }
});

test("uses separate mutable and immutable registry cache policies", async () => {
  for (const [pathname, expected] of [
    ["/r/button.json", "public, max-age=0, must-revalidate"],
    ["/r/v/0.1.0-rc.8/button.json", "public, max-age=31536000, immutable"],
  ]) {
    const response = await worker.fetch(new Request(`https://example.test${pathname}`), {
      ASSETS: {
        fetch: async () => new Response("{}", { status: 200, headers: { "content-type": "application/json" } }),
      },
    });

    assert.equal(response.headers.get("cache-control"), expected);
    assertSecurityHeaders(response);
  }
});

test("emits the files required by Sites packaging", async () => {
  await access(new URL("../dist/client/index.html", import.meta.url));
  await access(new URL("../dist/server/index.js", import.meta.url));
  await access(new URL("../dist/.openai/hosting.json", import.meta.url));
});
