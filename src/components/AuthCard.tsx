import AuthForm from "./AuthForm";

interface AuthCardProps {
  type: "login" | "register";
}

export default function AuthCard({ type }: AuthCardProps) {
  return (
    <div
    className="max-w-md w-full mx-auto mt-24 bg-slate-800/50 rounded-2xl shadow-xl border border-slate-700 p-8 flex flex-col gap-4 text-slate-200"
      aria-label={type === "login" ? "Área de login" : "Área de registro"}
      tabIndex={0}
    >
    <h2 className="text-3xl font-semibold mb-6 text-white">
        {type === "login" ? "Login" : "Register"}
      </h2>
      <AuthForm type={type} />
    </div>
  );
}
