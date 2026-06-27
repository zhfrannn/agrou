import { useState } from "react";
import {
  UserCircle,
  CheckCircle2,
  XCircle,
  Award,
  X,
  Plus,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useMyKoperasi, useUpdateKoperasi } from "../lib/queries/koperasi";
import { TableRowSkeleton } from "./ui/LoadingSkeleton";
import { ErrorState } from "./ui/ErrorState";
import { EmptyState } from "./ui/EmptyState";
import AvatarUpload from "./ui/AvatarUpload";
import toast from "react-hot-toast";

export default function DashboardKoperasiProfile() {
  const { user } = useAuth();
  const {
    data: koperasi,
    isLoading,
    error,
    refetch,
  } = useMyKoperasi(user?.id ?? "");
  const updateKoperasi = useUpdateKoperasi();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    province: "",
  });
  const [synced, setSynced] = useState(false);
  const [komoditas, setKomoditas] = useState<string[]>([]);
  const [newKomoditas, setNewKomoditas] = useState("");

  // Sync form once koperasi data arrives
  if (koperasi && !synced) {
    setFormData({
      name: koperasi.name ?? "",
      description: koperasi.description ?? "",
      location: koperasi.location ?? "",
      province: koperasi.province ?? "",
    });
    setSynced(true);
  }

  const handleSave = () => {
    if (!koperasi) return;
    updateKoperasi.mutate(
      { id: koperasi.id, updates: formData },
      {
        onSuccess: () => toast.success("Profil koperasi berhasil disimpan"),
        onError: () => toast.error("Gagal menyimpan profil koperasi"),
      },
    );
  };

  const addKomoditas = () => {
    const trimmed = newKomoditas.trim();
    if (trimmed && !komoditas.includes(trimmed)) {
      setKomoditas((prev) => [...prev, trimmed]);
      setNewKomoditas("");
    }
  };

  const removeKomoditas = (item: string) => {
    setKomoditas((prev) => prev.filter((k) => k !== item));
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
      {/* HEADER */}
      <header className="h-20 bg-white border-b border-gray-100 px-8 flex items-center shrink-0 shadow-sm z-10 w-full">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900 flex items-center gap-3">
            <UserCircle className="text-[#38b000]" size={28} />
            Profil Koperasi
          </h1>
          <p className="text-sm font-medium text-gray-500">
            Kelola informasi dan pengaturan akun koperasi Anda.
          </p>
        </div>
      </header>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 w-full max-w-[1440px] mx-auto">
        {isLoading && <TableRowSkeleton rows={6} />}

        {error && (
          <ErrorState
            message={(error as Error).message}
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && !error && !koperasi && (
          <EmptyState
            icon={Award}
            title="Koperasi Belum Didaftarkan"
            description="Anda belum memiliki koperasi terdaftar di Agrou."
            action={{ label: "Daftarkan Koperasi", onClick: () => {} }}
          />
        )}

        {!isLoading && !error && koperasi && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-7 xl:col-span-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 xl:p-8">
                <h2 className="font-bold text-gray-900 text-[16px] mb-6">
                  Informasi Koperasi
                </h2>

                {/* Logo koperasi */}
                <div className="flex items-center gap-4 mb-6">
                  <AvatarUpload
                    currentUrl={koperasi.logo_url}
                    onUpload={(url) =>
                      updateKoperasi.mutate(
                        { id: koperasi.id, updates: { logo_url: url } },
                        {
                          onSuccess: () =>
                            toast.success("Logo koperasi diperbarui"),
                          onError: () => toast.error("Gagal menyimpan logo"),
                        },
                      )
                    }
                  />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {koperasi.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Logo Koperasi
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {(
                    [
                      {
                        label: "Nama Koperasi",
                        key: "name" as const,
                        type: "text",
                      },
                      {
                        label: "Lokasi",
                        key: "location" as const,
                        type: "text",
                      },
                      {
                        label: "Provinsi",
                        key: "province" as const,
                        type: "text",
                      },
                    ] as const
                  ).map(({ label, key, type }) => (
                    <div key={key}>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">
                        {label}
                      </label>
                      <input
                        type={type}
                        value={formData[key]}
                        onChange={(e) =>
                          setFormData({ ...formData, [key]: e.target.value })
                        }
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#38b000]/30 focus:border-[#38b000]"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">
                      Deskripsi
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#38b000]/30 focus:border-[#38b000] resize-none"
                    />
                  </div>

                  {/* Komoditas tags */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">
                      Komoditas Unggulan
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {komoditas.map((k) => (
                        <span
                          key={k}
                          className="flex items-center gap-1.5 bg-green-50 text-green-800 border border-green-200 text-xs font-bold px-3 py-1 rounded-full"
                        >
                          {k}
                          <button
                            onClick={() => removeKomoditas(k)}
                            className="text-green-500 hover:text-red-500 transition-colors"
                            aria-label={`Hapus ${k}`}
                          >
                            <X size={11} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newKomoditas}
                        onChange={(e) => setNewKomoditas(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addKomoditas()}
                        placeholder="Tambah komoditas..."
                        className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#38b000]/30"
                      />
                      <button
                        onClick={addKomoditas}
                        className="w-9 h-9 bg-[#38b000] hover:bg-[#2d8c00] text-white rounded-xl flex items-center justify-center transition-colors"
                        aria-label="Tambah komoditas"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  disabled={updateKoperasi.isPending}
                  className="w-full bg-[#38b000] hover:bg-[#2d8c00] disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {updateKoperasi.isPending
                    ? "Menyimpan..."
                    : "Simpan Perubahan"}
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN — Stats */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-6">
              {/* Verification status */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="font-bold text-gray-900 text-[15px] mb-4">
                  Status Verifikasi
                </h2>
                <div
                  className={`flex items-center gap-2 text-sm font-bold ${koperasi.is_verified ? "text-green-700" : "text-orange-600"}`}
                >
                  {koperasi.is_verified ? (
                    <>
                      <CheckCircle2 size={18} /> Terverifikasi
                    </>
                  ) : (
                    <>
                      <XCircle size={18} /> Belum Terverifikasi
                    </>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-3">
                <h2 className="font-bold text-gray-900 text-[15px] mb-4">
                  Statistik
                </h2>
                {[
                  {
                    icon: "👥",
                    label: "Anggota aktif",
                    value: `${koperasi.member_count} Anggota`,
                  },
                  {
                    icon: "⭐",
                    label: "Rating",
                    value: `${koperasi.rating.toFixed(1)}/5.0`,
                  },
                  {
                    icon: "📅",
                    label: "Bergabung",
                    value: new Date(koperasi.created_at).toLocaleDateString(
                      "id-ID",
                      { month: "long", year: "numeric" },
                    ),
                  },
                ].map(({ icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 text-gray-600 font-medium text-sm">
                      <span className="text-lg">{icon}</span> {label}:
                    </div>
                    <span className="font-bold text-gray-900 text-sm">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
