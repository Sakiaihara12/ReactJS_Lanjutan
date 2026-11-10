import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getUser, updateUser } from "../../../_services/users";
import Alert from "../../../components/alert";
import FormField from "../../../components/form-field";
import { formatTanggal } from "../../../utils/format";
import { normalizeRole } from "../../../utils/roles";
import { rules } from "../../../utils/validators";

const EMPTY = { name: "", email: "", username: "", password: "", password_confirmation: "" };

// Password bersifat opsional saat edit: hanya divalidasi jika diisi.
const validate = (v) => {
  const errors = {
    name: rules.name(v.name),
    email: rules.email(v.email),
    username: rules.username(v.username),
  };
  if (v.password || v.password_confirmation) {
    errors.password = rules.password(v.password);
    errors.password_confirmation = rules.password_confirmation(v.password_confirmation, v);
  }
  return Object.fromEntries(Object.entries(errors).filter(([, message]) => message));
};

export default function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [values, setValues] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUser(id);
        setAccount(data);
        setValues({ ...EMPTY, name: data.name ?? "", email: data.email ?? "", username: data.username ?? "" });
      } catch (err) {
        console.error("Gagal ambil user:", err);
        setMessage("Pengguna tidak ditemukan atau gagal dimuat.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const clientErrors = useMemo(() => validate(values), [values]);
  const errorOf = (field) =>
    (touched[field] || submitted ? clientErrors[field] : "") || serverErrors[field]?.[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setServerErrors((prev) => ({ ...prev, [name]: undefined }));
  };
  const handleBlur = (e) => setTouched((prev) => ({ ...prev, [e.target.name]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setMessage("");
    if (Object.keys(clientErrors).length > 0) return;

    const payload = {
      name: values.name.trim(),
      email: values.email.trim(),
      username: values.username.trim(),
    };
    if (values.password) {
      payload.password = values.password;
      payload.password_confirmation = values.password_confirmation;
    }

    setSaving(true);
    try {
      await updateUser(id, payload);
      navigate("/admin/users");
    } catch (err) {
      if (err.response?.status === 422) {
        setServerErrors(err.response.data.errors ?? {});
        setMessage(err.response.data.message || "Periksa kembali data yang kamu isi.");
      } else {
        setMessage(err.response?.data?.message || "Gagal menyimpan perubahan. Coba lagi.");
      }
    } finally {
      setSaving(false);
    }
  };

  const fieldProps = (field) => ({
    id: field,
    value: values[field],
    onChange: handleChange,
    onBlur: handleBlur,
    error: errorOf(field),
  });

  return (
    <section className="mx-auto max-w-2xl px-4 py-8">
      <Link to="/admin/users" className="text-sm text-gray-400 hover:text-indigo-400">
        &larr; Kembali ke daftar pengguna
      </Link>
      <h1 className="mb-1 mt-3 text-2xl font-bold text-gray-50">Edit pengguna</h1>
      <p className="mb-6 text-sm text-gray-400">Ubah data akun atau atur ulang password pengguna.</p>

      <Alert className="mb-4">{message}</Alert>

      {loading ? (
        <p className="text-sm text-gray-400">Memuat data...</p>
      ) : (
        account && (
          <form onSubmit={handleSubmit} noValidate className="space-y-5 rounded-lg bg-gray-800 p-6 ring-1 ring-gray-700/60">
            <p className="text-xs text-gray-400">
              Role: <span className="font-semibold text-gray-50">{normalizeRole(account)}</span> · Terdaftar{" "}
              {formatTanggal(account.created_at)}
            </p>

            <FormField {...fieldProps("name")} label="Nama lengkap" autoComplete="off" />
            <FormField {...fieldProps("email")} label="Email" type="email" autoComplete="off" />
            <FormField {...fieldProps("username")} label="Username" autoComplete="off" />

            <fieldset className="space-y-5 border-t border-gray-700 pt-5">
              <legend className="mb-1 text-sm font-semibold text-gray-50">Ganti password</legend>
              <p className="-mt-3 text-xs text-gray-400">Kosongkan jika tidak ingin mengubah password.</p>
              <FormField {...fieldProps("password")} label="Password baru" type="password" autoComplete="new-password" />
              <FormField {...fieldProps("password_confirmation")} label="Konfirmasi password baru" type="password" autoComplete="new-password" />
            </fieldset>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-300/40 disabled:opacity-60"
              >
                {saving ? "Menyimpan..." : "Simpan perubahan"}
              </button>
              <Link to="/admin/users" className="rounded-lg border border-gray-600 px-5 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-700">
                Batal
              </Link>
            </div>
          </form>
        )
      )}
    </section>
  );
}
