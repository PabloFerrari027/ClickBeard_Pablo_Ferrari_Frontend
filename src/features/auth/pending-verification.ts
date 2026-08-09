/**
 * Estado transitório entre /login e /login/verify (spec §12.1): guardado em memória,
 * NUNCA persistido — se o usuário recarregar a página em /login/verify, este módulo
 * reseta e a tela redireciona de volta para /login (não há como recuperar isso da
 * API sem repetir o login).
 */
export interface PendingVerification {
  userId: string;
  email: string;
  name: string;
}

let pending: PendingVerification | null = null;

export function setPendingVerification(value: PendingVerification | null): void {
  pending = value;
}

export function getPendingVerification(): PendingVerification | null {
  return pending;
}
