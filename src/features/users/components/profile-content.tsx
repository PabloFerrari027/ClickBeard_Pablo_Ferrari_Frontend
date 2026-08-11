"use client";

import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth-context";
import { useUser } from "../hooks/use-user";
import { ChangePasswordForm } from "./change-password-form";
import { ProfileCard } from "./profile-card";

/** `/profile` (spec §13.5): own account data (Dados) + change password (Segurança). */
export function ProfileContent() {
  const { user: authUser } = useAuth();
  const { data: user, isLoading, isError, refetch } = useUser(authUser?.id);

  return (
    <div className="max-w-2xl">
      <PageHeader title="Meu perfil" />
      <Tabs defaultValue="data">
        <TabsList>
          <TabsTrigger value="data">Dados</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>
        <TabsContent value="data" className="mt-4">
          {isLoading ? (
            <Skeleton className="h-48 w-full rounded-lg" aria-hidden="true" />
          ) : isError || !user ? (
            <ErrorState actionLabel="Tentar novamente" onAction={() => refetch()} />
          ) : (
            <ProfileCard user={user} />
          )}
        </TabsContent>
        <TabsContent value="security" className="mt-4">
          {authUser ? <ChangePasswordForm userId={authUser.id} /> : null}
        </TabsContent>
      </Tabs>
    </div>
  );
}
