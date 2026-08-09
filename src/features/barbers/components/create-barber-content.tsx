import { PageHeader } from "@/components/shared/page-header";
import { CreateBarberForm } from "./barber-form";

export function CreateBarberContent() {
  return (
    <div>
      <PageHeader
        title="Novo barbeiro"
        description="Vincule um usuário já existente (papel Barbeiro) a um perfil operacional."
      />
      <CreateBarberForm />
    </div>
  );
}
