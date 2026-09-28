import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { Toaster } from "sonner";
import appCss from "../styles.css?url";

const APP_NAME = "Ya Olmasaydı";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "Hazır olun, dünyanın en ilginç hikayeleri sizlerle! Ya Olmasaydı serisinde sıra dışı konuları keşfedin.",
      },
      { name: "theme-color", content: "#ffffff" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/images/favicon.png" },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "shortcut icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", href: "/images/favicon.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;500;600;700&family=Open+Sans:ital,wght@0,400;0,600;0,700;1,400&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: APP_NAME,
          url: "https://yaolmasaydi.com/",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://yaolmasaydi.com/ara?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }),
      },
    ],
  }),
  component: () => (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
          <ScrollRestoration />
          <Toaster position="bottom-center" richColors />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
