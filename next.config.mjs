/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async headers() {
    // Next.js's dev module loader relies on eval-backed chunk evaluation, so a
    // fully lock-down CSP without 'unsafe-eval' breaks client modules (and with
    // it Firebase Auth) while running `next dev`. Production is unaffected.
    const isDev = process.env.NODE_ENV === "development";
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // Google's OAuth returns its token through a popup opened from the
          // app, and Firebase Auth polls `window.opener.closed` to detect the
          // popup state. A `same-origin` COOP here would tear down that
          // reference ("Cross-Origin-Opener-Policy policy would block the
          // window.closed call"). We keep the header (hardening) but relax it
          // to `cross-origin` on the auth routes only, so the popup handshake
          // keeps its opener handle.
          { key: "Cross-Origin-Opener-Policy", value: "cross-origin" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://apis.google.com https://ssl.gstatic.com https://www.googletagmanager.com https://accounts.google.com https://gsi.gstatic.com`,
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data:",
              "img-src 'self' data: blob: https://res.cloudinary.com https://lh3.googleusercontent.com",
              "connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://firebase.googleapis.com https://firebaseinstallations.googleapis.com https://www.googleapis.com https://apis.google.com https://www.googletagmanager.com https://www.google-analytics.com https://region1.google-analytics.com https://stats.g.doubleclick.net https://learning-832c9.firebasestorage.app",
              // Firebase Auth's popup flow embeds a hidden OAuth helper iframe
              // from the project authDomain (learning-832c9.firebaseapp.com),
              // and Google's account chooser is framed via accounts.google.com.
              "frame-src https://accounts.google.com https://gsi.gstatic.com https://learning-832c9.firebaseapp.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;