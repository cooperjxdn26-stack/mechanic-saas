import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UserForm } from "@/components/admin/user-form";

export default function NewUserPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild size="icon" variant="outline">
          <Link href="/dashboard/users">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nuevo usuario</h1>
          <p className="mt-1 text-muted-foreground">
            Registra un usuario y asígnale un rol dentro del sistema.
          </p>
        </div>
      </div>

      <UserForm />
    </div>
  );
}
