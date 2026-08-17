const securityHeaders = {
  "Content-Security-Policy": [
    "default-src 'self'",
    "base-uri 'none'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    "style-src 'self' 'unsafe-inline'",
    "script-src 'self'",
    "connect-src 'self'",
    "manifest-src 'self'",
    "worker-src 'self'",
    "upgrade-insecure-requests",
  ].join("; "),
  "Cross-Origin-Opener-Policy": "same-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

function acceptsHtml(request) {
  const accept = request.headers.get("accept");
  if (!accept) return false;

  return accept.split(",").some((range) => {
    const [type, ...parameters] = range.split(";").map((part) => part.trim().toLowerCase());
    const quality = parameters.find((parameter) => parameter.startsWith("q="));
    const value = quality ? Number.parseFloat(quality.slice(2)) : 1;
    return value > 0 && (type === "text/html" || type === "application/xhtml+xml");
  });
}

function cachePolicy(pathname, contentType, isFallback) {
  if (/^\/r\/v\/[^/]+\/[^/]+\.json$/.test(pathname)) {
    return "public, max-age=31536000, immutable";
  }
  if (/^\/r\/[^/]+\.json$/.test(pathname)) {
    return "public, max-age=0, must-revalidate";
  }
  if (pathname.startsWith("/assets/")) {
    return "public, max-age=31536000, immutable";
  }
  if (isFallback || pathname === "/" || pathname.endsWith(".html") || contentType.includes("text/html")) {
    return "no-cache";
  }
  return "public, max-age=3600";
}

function harden(response, requestUrl, isFallback = false) {
  const headers = new Headers(response.headers);
  const pathname = new URL(requestUrl).pathname;
  const contentType = headers.get("content-type") ?? "";

  for (const [name, value] of Object.entries(securityHeaders)) headers.set(name, value);
  headers.set("Cache-Control", cachePolicy(pathname, contentType, isFallback));

  if (isFallback || pathname === "/" || pathname.endsWith(".html") || contentType.includes("text/html")) {
    const vary = headers.get("Vary");
    headers.set("Vary", vary ? `${vary}, Accept` : "Accept");
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request, env) {
    const requestUrl = new URL(request.url);
    const response = await env.ASSETS.fetch(request);
    const isRegistryRoute = requestUrl.pathname === "/r" || requestUrl.pathname.startsWith("/r/");

    if (
      response.status !== 404 ||
      isRegistryRoute ||
      !acceptsHtml(request) ||
      !["GET", "HEAD"].includes(request.method)
    ) {
      return harden(response, request.url);
    }

    const indexUrl = new URL(request.url);
    indexUrl.pathname = "/index.html";
    indexUrl.search = "";
    const fallback = await env.ASSETS.fetch(new Request(indexUrl, request));
    return harden(fallback, request.url, true);
  },
};
