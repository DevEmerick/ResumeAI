// @jest-environment node
const fetch = require('node-fetch');

describe("DELETE /api/auth/delete", () => {
  const baseUrl = process.env.TEST_BASE_URL || "http://localhost:3000";

  afterAll(async () => {
    // Fecha conexões do Prisma para evitar vazamento de handles
    const { prisma } = require("@/lib/prisma");
    await prisma.$disconnect();
  });

  it("deve retornar 405 para método não permitido", async () => {
    const res = await fetch(`${baseUrl}/api/auth/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@email.com" }),
    });
    expect(res.status).toBe(405);
  });

  it("deve retornar 400 para dados inválidos", async () => {
    const res = await fetch(`${baseUrl}/api/auth/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "invalid" }),
    });
    expect(res.status).toBe(400);
  });

  it("deve retornar 404 para usuário não encontrado", async () => {
    const res = await fetch(`${baseUrl}/api/auth/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "naoexiste@email.com" }),
    });
    expect(res.status).toBe(404);
  });

  // Para testar exclusão real, crie um usuário antes
  // it("deve excluir usuário existente", async () => {
  //   await fetch(`${baseUrl}/api/auth/register`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ email: "delete@email.com", password: "12345678", confirmPassword: "12345678" }),
  //   });
  //   const res = await fetch(`${baseUrl}/api/auth/delete`, {
  //     method: "DELETE",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ email: "delete@email.com" }),
  //   });
  //   expect(res.status).toBe(200);
  // });
});
