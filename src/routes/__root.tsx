import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { AdminProvider } from "@/lib/admin-context";
import { ContentProvider } from "@/lib/content";
import { AdminBar } from "@/components/AdminBar";
import { LoginModal } from "@/components/LoginModal";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-strong rounded-3xl p-8 max-w-md text-center">
        <h1 className="text-6xl font-extrabold gradient-title">404</h1>
        <p className="mt-3 text-muted-foreground">الصفحة غير موجودة</p>
        <a href="/" className="mt-6 inline-block gradient-cta px-5 py-2.5 rounded-xl font-semibold">العودة للرئيسية</a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-strong rounded-3xl p-8 max-w-md text-center">
        <h1 className="text-xl font-semibold">حدث خطأ</h1>
        <p className="mt-2 text-sm text-muted-foreground">تعذّر تحميل الصفحة.</p>
        <button onClick={() => { router.invalidate(); reset(); }} className="mt-5 gradient-cta px-5 py-2.5 rounded-xl font-semibold">إعادة المحاولة</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ملف التدريب الميداني" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AdminProvider>
        <ContentProvider>
          <Outlet />
          <AdminBar />
          <LoginModal />
        </ContentProvider>
      </AdminProvider>
    </QueryClientProvider>
  );
}
