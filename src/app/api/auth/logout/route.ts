export async function POST() {
  // Remove o token do cookie
  return new Response(
    JSON.stringify({ success: true }),
    {
      status: 200,
      headers: {
        "Set-Cookie": "token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict; Secure",
        "Content-Type": "application/json"
      }
    }
  );
}