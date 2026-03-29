"use client";
import { useState, useRef } from "react";
import { updateProfile, deleteAccount } from "@/services/authService";

import { useUser } from "@/hooks/useUser";
import { useTranslation } from "@/contexts/I18nContext";

interface SettingsFormProps {
	initialName?: string;
	initialEmail?: string;
	onSuccess?: (data: { name: string; email: string }) => void;
}

export default function SettingsForm({ initialName, initialEmail, onSuccess }: SettingsFormProps) {
	const user = useUser();
	const { t } = useTranslation();
	// Inputs começam vazios, placeholders mostram dados atuais
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	// ...existing code...
	const [success, setSuccess] = useState("");
	const [error, setError] = useState("");
	const [deleteLoading, setDeleteLoading] = useState(false);

	// ...existing code...

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		setSuccess("");

		// Monta apenas os campos preenchidos
		const updateData: Record<string, string> = {};
		if (name.trim()) updateData.name = name.trim();
		if (email.trim()) updateData.email = email.trim();

		if (password) {
			if (password !== confirmPassword) {
				setError(t("settings.passwordMismatch", "As novas senhas não coincidem."));
				setLoading(false);
				return;
			}
			if (password.length < 8) {
				setError(t("settings.passwordTooShort", "A nova senha deve ter no mínimo 8 caracteres."));
				setLoading(false);
				return;
			}
			updateData.password = password;
		}

		// Permite atualizar apenas o avatar
		if (Object.keys(updateData).length === 0) {
			setError(t("settings.fillFields", "Preencha nome ou email para atualizar."));
			setLoading(false);
			return;
		}

		try {
			// ...existing code...
			await updateProfile(updateData);
			setSuccess(t("settings.success", "Dados atualizados com sucesso!"));
			if (onSuccess) onSuccess({ name: updateData.name ?? "", email: updateData.email ?? "" });
		} catch (e: any) {
			setError(e.message || t("settings.error", "Erro de conexão. Tente novamente."));
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async () => {
		if (window.confirm(t("settings.confirmDelete", "Tem certeza que deseja excluir sua conta permanentemente? Esta ação apagará todos os seus dados e não pode ser desfeita."))) {
			setDeleteLoading(true);
			try {
				await deleteAccount();
				window.location.href = "/";
			} catch (e: any) {
				setError(e.message || t("settings.errorDelete", "Erro ao excluir conta. Tente novamente."));
				setDeleteLoading(false);
			}
		}
	};

	return (
	<form onSubmit={handleSubmit} className="w-full max-w-md mx-auto flex flex-col gap-5 sm:gap-6" aria-label="Editar perfil do usuário">
		<h3 className="text-2xl font-semibold text-white mb-2">Editar Perfil</h3>
		{/* Avatar removido */}
		<div className="flex flex-col gap-2">
			<label htmlFor="name" className="text-sm font-medium text-slate-300">Nome</label>
			<input
				id="name"
				type="text"
				className="w-full rounded-lg border border-slate-600 p-3 text-white bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-500 transition"
				value={name}
				onChange={e => setName(e.target.value)}
				aria-label="Nome"
				disabled={loading}
				autoComplete="name"
				placeholder={user?.name || "Digite seu nome"}
			/>
		</div>
		<div className="flex flex-col gap-2">
			<label htmlFor="email" className="text-sm font-medium text-slate-300">Email</label>
			<input
				id="email"
				type="email"
				className="w-full rounded-lg border border-slate-600 p-3 text-white bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-500 transition"
				value={email}
				onChange={e => setEmail(e.target.value)}
				aria-label="Email"
				disabled={loading}
				autoComplete="email"
				placeholder={user?.email || "Digite seu email"}
			/>
		</div>

		<div className="pt-4 mt-2 border-t border-slate-700 flex flex-col gap-5 sm:gap-6">
			<h4 className="text-lg font-semibold text-white">Alterar Senha</h4>
			<div className="flex flex-col gap-2">
				<label htmlFor="password" className="text-sm font-medium text-slate-300">Nova Senha</label>
				<input
					id="password"
					type="password"
					className="w-full rounded-lg border border-slate-600 p-3 text-white bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-500 transition"
					value={password}
					onChange={e => setPassword(e.target.value)}
					aria-label="Nova Senha"
					disabled={loading}
					autoComplete="new-password"
					placeholder="Deixe em branco para manter a atual"
				/>
			</div>
			<div className="flex flex-col gap-2">
				<label htmlFor="confirmPassword" className="text-sm font-medium text-slate-300">Confirmar Nova Senha</label>
				<input
					id="confirmPassword"
					type="password"
					className="w-full rounded-lg border border-slate-600 p-3 text-white bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-500 transition"
					value={confirmPassword}
					onChange={e => setConfirmPassword(e.target.value)}
					aria-label="Confirmar Nova Senha"
					disabled={loading}
					autoComplete="new-password"
					placeholder="Repita a nova senha"
				/>
			</div>
		</div>

		<button
			type="submit"
			className="bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg px-4 py-3 transition focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed"
			disabled={loading}
			aria-label="Salvar configurações"
		>
			{loading ? "Salvando..." : "Salvar alterações"}
		</button>
		{error && <div className="text-red-400 text-sm font-medium bg-red-900/20 p-3 rounded-lg border border-red-900/50 mt-2" role="alert">{error}</div>}
		{success && <div className="text-green-400 text-sm font-medium bg-green-900/20 p-3 rounded-lg border border-green-900/50 mt-2" role="status">{success}</div>}

		<div className="mt-4 pt-6 border-t border-slate-700 flex flex-col gap-3">
			<h4 className="text-lg font-semibold text-red-400">Zona de Perigo</h4>
			<button
				type="button"
				onClick={handleDelete}
				disabled={loading || deleteLoading}
				className="bg-red-900/20 hover:bg-red-900/40 border border-red-900/50 text-red-400 font-medium rounded-lg px-4 py-3 transition focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
			>
				{deleteLoading ? "Excluindo conta..." : "Excluir minha conta permanentemente"}
			</button>
		</div>
	</form>
	);
}
