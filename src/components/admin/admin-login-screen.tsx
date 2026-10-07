import Image from "next/image";

import { LoginForm } from "@/components/admin/login-form";

export function AdminLoginScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 shadow-sm">
        <div className="mb-8 flex items-center gap-3">
          <span className="relative size-10 shrink-0 overflow-hidden">
            <Image
              src="/brand/mahraj-mark.png"
              alt=""
              fill
              sizes="40px"
              className="object-cover object-top"
            />
          </span>
          <div>
            <p className="font-heading text-lg font-semibold text-ink">
              Mahraj <span className="text-brand">Arabia</span>
            </p>
            <p className="text-sm text-muted-foreground">Content management</p>
          </div>
        </div>
        <h1 className="font-heading text-2xl font-semibold">Sign in</h1>
        <p className="mt-1 mb-6 text-sm text-muted-foreground">
          Demo credentials:{" "}
          <span className="text-ink">admin@mahrajarabia.com</span> /{" "}
          <span className="text-ink">Admin@123</span>
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
