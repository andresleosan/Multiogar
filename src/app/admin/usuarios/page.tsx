"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, LoaderCircle, RefreshCw, Save, ShieldCheck, UsersRound } from "lucide-react";
import { getIdToken } from "firebase/auth";
import { useAuth } from "@/components/auth/AuthProvider";
import { auth } from "@/lib/firebase";
import type { AppRole } from "@/lib/auth-roles";

type ManagedUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  disabled: boolean;
  role: AppRole;
};

const roleLabels: Record<AppRole, string> = {
  superadmin: "Superadmin",
  vendedor: "Vendedor",
  cliente: "Cliente",
};

async function requestWithToken(path: string, init?: RequestInit): Promise<Response> {
  if (!auth?.currentUser) throw new Error("La sesión expiró. Inicia sesión nuevamente.");
  const token = await getIdToken(auth.currentUser, true);
  return fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  });
}

export default function AdminUsersPage() {
  const { role } = useAuth();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [pendingRoles, setPendingRoles] = useState<Record<string, AppRole>>({});
  const [loading, setLoading] = useState(true);
  const [savingUid, setSavingUid] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await requestWithToken("/api/admin/users");
      const payload = await response.json() as { users?: ManagedUser[]; error?: string };
      if (!response.ok) throw new Error(payload.error || "No fue posible cargar las cuentas.");
      const nextUsers = payload.users ?? [];
      setUsers(nextUsers);
      setPendingRoles(Object.fromEntries(nextUsers.map((user) => [user.uid, user.role])));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "No fue posible cargar las cuentas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (role === "superadmin") {
      void Promise.resolve().then(loadUsers);
    }
  }, [loadUsers, role]);

  const saveRole = async (user: ManagedUser) => {
    const nextRole = pendingRoles[user.uid] ?? user.role;
    if (nextRole === user.role) return;
    setSavingUid(user.uid);
    setError("");
    setNotice("");
    try {
      const response = await requestWithToken("/api/admin/users", {
        method: "PATCH",
        body: JSON.stringify({ uid: user.uid, role: nextRole }),
      });
      const payload = await response.json() as { user?: ManagedUser; error?: string };
      if (!response.ok || !payload.user) throw new Error(payload.error || "No fue posible guardar el permiso.");
      setUsers((current) => current.map((item) => item.uid === user.uid ? payload.user! : item));
      setPendingRoles((current) => ({ ...current, [user.uid]: payload.user!.role }));
      setNotice(`Permiso actualizado para ${user.email ?? "la cuenta seleccionada"}.`);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "No fue posible guardar el permiso.");
    } finally {
      setSavingUid(null);
    }
  };

  if (role !== "superadmin") {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-2xl border border-rose-200 bg-white p-8 text-center dark:border-rose-900/60 dark:bg-slate-900">
        <div>
          <ShieldCheck className="mx-auto mb-3 h-8 w-8 text-rose-500" />
          <h1 className="text-lg font-black text-slate-900 dark:text-white">Acceso restringido</h1>
          <p className="mt-1 text-sm text-slate-500">Solo un superadmin puede administrar permisos.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <UsersRound className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wide">Equipo Multiogar</span>
          </div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">Permisos del equipo</h1>
          <p className="mt-1 max-w-2xl text-xs text-slate-500 sm:text-sm">Asigna el nivel de acceso de cada cuenta registrada. Los cambios se aplican al próximo inicio de sesión.</p>
        </div>
        <button type="button" onClick={() => void loadUsers()} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-600 disabled:cursor-wait disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Actualizar
        </button>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-xs text-blue-800 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-200">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
        <p>Los permisos se gestionan con Firebase Authentication. Esta pantalla nunca muestra ni cambia contraseñas.</p>
      </div>

      {error && <div role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200"><AlertCircle className="h-4 w-4 shrink-0" />{error}</div>}
      {notice && <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200"><CheckCircle2 className="h-4 w-4 shrink-0" />{notice}</div>}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800 sm:px-6">
          <h2 className="text-sm font-black text-slate-900 dark:text-white">Cuentas registradas <span className="ml-1 font-normal text-slate-400">({users.length})</span></h2>
        </div>
        {loading ? (
          <div className="flex min-h-48 items-center justify-center gap-2 text-sm font-semibold text-slate-500"><LoaderCircle className="h-5 w-5 animate-spin text-blue-500" />Cargando cuentas...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">No hay cuentas registradas todavía.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-xs">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500 dark:bg-slate-950/40">
                <tr><th className="px-4 py-3 font-bold sm:px-6">Cuenta</th><th className="px-4 py-3 font-bold">Estado</th><th className="px-4 py-3 font-bold">Nivel de acceso</th><th className="px-4 py-3 text-right font-bold sm:px-6">Acción</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((user) => {
                  const selectedRole = pendingRoles[user.uid] ?? user.role;
                  const changed = selectedRole !== user.role;
                  const saving = savingUid === user.uid;
                  return (
                    <tr key={user.uid} className="align-middle">
                      <td className="px-4 py-4 sm:px-6"><div className="font-bold text-slate-900 dark:text-white">{user.displayName || "Sin nombre"}</div><div className="mt-0.5 text-slate-500">{user.email || "Sin correo"}</div></td>
                      <td className="px-4 py-4"><span className={`inline-flex items-center gap-1.5 font-semibold ${user.disabled ? "text-rose-500" : "text-emerald-600 dark:text-emerald-400"}`}><span className={`h-1.5 w-1.5 rounded-full ${user.disabled ? "bg-rose-500" : "bg-emerald-500"}`} />{user.disabled ? "Deshabilitada" : "Activa"}</span></td>
                      <td className="px-4 py-4"><label className="sr-only" htmlFor={`role-${user.uid}`}>Nivel para {user.email || user.uid}</label><select id={`role-${user.uid}`} value={selectedRole} onChange={(event) => setPendingRoles((current) => ({ ...current, [user.uid]: event.target.value as AppRole }))} className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 font-semibold text-slate-700 outline-none ring-blue-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">{(Object.keys(roleLabels) as AppRole[]).map((option) => <option key={option} value={option}>{roleLabels[option]}</option>)}</select></td>
                      <td className="px-4 py-4 text-right sm:px-6"><button type="button" onClick={() => void saveRole(user)} disabled={!changed || saving} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"><Save className="h-3.5 w-3.5" />{saving ? "Guardando" : "Guardar"}</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
