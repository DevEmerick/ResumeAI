export const login = async (credentials: Record<string, string>) => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro ao fazer login");
  return data;
};

export const register = async (userData: Record<string, string>) => {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro ao registrar usuário");
  return data;
};

export const updateProfile = async (updateData: Record<string, string>) => {
  const res = await fetch("/api/auth/update", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro ao atualizar perfil");
  return data;
};

export const deleteAccount = async () => {
  const res = await fetch("/api/auth/delete", {
    method: "DELETE",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro ao excluir conta");
  return data;
};