import { useState, type FormEvent } from "react";
import { Plus, Download, Edit2, Ban, PackagePlus, Box, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../hooks/useAuth";
import {
  useMyProducts,
  useUpdateProduct,
  useAddProduct,
  formatPrice,
} from "../../lib/queries/products";
import type { ProductCategory } from "../../lib/database.types";
import { TableRowSkeleton } from "../ui/LoadingSkeleton";
import { ErrorState } from "../ui/ErrorState";
import { EmptyState } from "../ui/EmptyState";
import ProductImageUpload from "../ui/ProductImageUpload";
import toast from "react-hot-toast";

const PRODUCT_CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: "padi", label: "Padi" },
  { value: "jagung", label: "Jagung" },
  { value: "kedelai", label: "Kedelai" },
  { value: "sayuran", label: "Sayuran" },
  { value: "buah", label: "Buah" },
  { value: "perkebunan", label: "Perkebunan" },
  { value: "peternakan", label: "Peternakan" },
  { value: "perikanan", label: "Perikanan" },
  { value: "lainnya", label: "Lainnya" },
];

interface AddProductForm {
  name: string;
  category: ProductCategory;
  price: string;
  stock: string;
  unit: string;
  description: string;
  images: string[];
}

const EMPTY_FORM: AddProductForm = {
  name: "",
  category: "lainnya",
  price: "",
  stock: "",
  unit: "kg",
  description: "",
  images: [],
};

function stockStatus(stock: number): { label: string; color: string } {
  if (stock === 0) return { label: "Habis", color: "bg-red-100 text-red-600" };
  if (stock <= 20)
    return { label: "Hampir Habis", color: "bg-orange-100 text-orange-600" };
  return { label: "Aman", color: "bg-green-100 text-green-700" };
}

export default function DashboardBrandStock() {
  const { user } = useAuth();
  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = useMyProducts(user?.id ?? "");
  const updateProduct = useUpdateProduct();
  const addProduct = useAddProduct();

  const [showModal, setShowModal] = useState(false);
  // A stable temp ID for the upload path — replaced by real row id on save
  const [tempProductId] = useState(() => crypto.randomUUID());
  const [form, setForm] = useState<AddProductForm>(EMPTY_FORM);

  const openModal = () => {
    setForm(EMPTY_FORM);
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  const handleField = <K extends keyof AddProductForm>(
    key: K,
    value: AddProductForm[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const price = parseFloat(form.price);
    const stock = parseInt(form.stock, 10);

    if (!form.name.trim()) {
      toast.error("Nama produk wajib diisi.");
      return;
    }
    if (isNaN(price) || price <= 0) {
      toast.error("Harga harus berupa angka positif.");
      return;
    }
    if (isNaN(stock) || stock < 0) {
      toast.error("Stok harus berupa angka.");
      return;
    }

    addProduct.mutate(
      {
        seller_id: user.id,
        name: form.name.trim(),
        category: form.category,
        price,
        stock,
        unit: form.unit.trim() || "kg",
        description: form.description.trim() || null,
        images: form.images,
        min_order: 1,
        is_active: true,
      },
      {
        onSuccess: () => {
          toast.success("Produk berhasil ditambahkan!");
          closeModal();
        },
        onError: (err) =>
          toast.error((err as Error).message ?? "Gagal menambahkan produk."),
      },
    );
  };

  const handleToggleActive = (id: string, current: boolean) => {
    updateProduct.mutate(
      { id, updates: { is_active: !current } },
      {
        onSuccess: () =>
          toast.success(current ? "Produk dinonaktifkan" : "Produk diaktifkan"),
        onError: () => toast.error("Gagal mengubah status produk"),
      },
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
      {/* HEADER */}
      <header className="h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between shrink-0 shadow-sm z-10 w-full">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900 flex items-center gap-3">
            <Box className="text-[#2D6A4F]" size={28} />
            Stok & Produk
          </h1>
          <p className="text-sm font-medium text-gray-500">
            Kelola inventaris dan produk yang Anda jual.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-xl text-sm font-bold transition-colors">
            <Download size={15} /> Export
          </button>
          <button
            onClick={openModal}
            className="flex items-center gap-2 bg-[#1B4332] hover:bg-[#2D6A4F] text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm"
          >
            <PackagePlus size={15} /> Tambah Produk
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 w-full max-w-[1440px] mx-auto space-y-6">
        {isLoading && <TableRowSkeleton cols={5} />}

        {error && (
          <ErrorState
            message={(error as Error).message}
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && !error && (!products || products.length === 0) && (
          <EmptyState
            icon={Box}
            title="Belum Ada Produk"
            description="Mulai tambahkan produk yang ingin Anda jual."
          />
        )}

        {!isLoading && !error && products && products.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Summary bar */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-6 text-sm font-medium text-gray-500">
              <span>{products.length} produk</span>
              <span className="text-green-700 font-bold">
                {products.filter((p) => p.stock > 20).length} aman
              </span>
              <span className="text-orange-600 font-bold">
                {products.filter((p) => p.stock > 0 && p.stock <= 20).length}{" "}
                hampir habis
              </span>
              <span className="text-red-600 font-bold">
                {products.filter((p) => p.stock === 0).length} habis
              </span>
            </div>

            <div className="divide-y divide-gray-50">
              {products.map((product, i) => {
                const { label, color } = stockStatus(product.stock);
                const image = product.images?.[0];

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-slate-50 transition-colors"
                  >
                    {/* Image + Name */}
                    <div className="col-span-5 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        {image ? (
                          <img
                            src={image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                            <Box size={18} />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-900 leading-tight">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-400 font-medium capitalize mt-0.5">
                          {product.category}
                        </p>
                      </div>
                    </div>

                    {/* Stock */}
                    <div className="col-span-2">
                      <p className="font-bold text-sm text-gray-800">
                        {product.stock} {product.unit}
                      </p>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${color}`}
                      >
                        {label}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="col-span-2">
                      <p className="font-bold text-sm text-[#2D6A4F]">
                        {formatPrice(product.price)}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        /{product.unit}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="col-span-1">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${product.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                      >
                        {product.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex items-center justify-end gap-1">
                      <button
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                        aria-label="Edit produk"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() =>
                          handleToggleActive(product.id, product.is_active)
                        }
                        disabled={updateProduct.isPending}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"
                        aria-label={
                          product.is_active ? "Nonaktifkan" : "Aktifkan"
                        }
                      >
                        <Ban size={14} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── ADD PRODUCT MODAL ─────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={closeModal}
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 32 }}
              transition={{ type: "spring", stiffness: 340, damping: 30 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="add-product-title"
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
                {/* Modal header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
                  <h2
                    id="add-product-title"
                    className="font-bold text-gray-900 text-lg flex items-center gap-2"
                  >
                    <PackagePlus size={20} className="text-[#2D6A4F]" />
                    Tambah Produk
                  </h2>
                  <button
                    onClick={closeModal}
                    aria-label="Tutup modal"
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Modal body */}
                <form
                  id="add-product-form"
                  onSubmit={handleSubmit}
                  className="flex-1 overflow-y-auto px-6 py-5 space-y-4"
                >
                  {/* Foto produk */}
                  <ProductImageUpload
                    value={form.images[0] ?? null}
                    onChange={(url) => handleField("images", url ? [url] : [])}
                  />

                  {/* Nama */}
                  <div>
                    <label
                      htmlFor="prod-name"
                      className="block text-xs font-semibold text-gray-600 mb-1"
                    >
                      Nama Produk <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="prod-name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => handleField("name", e.target.value)}
                      placeholder="Contoh: Beras Putih Premium"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/40 focus:border-[#2D6A4F] transition"
                    />
                  </div>

                  {/* Kategori */}
                  <div>
                    <label
                      htmlFor="prod-category"
                      className="block text-xs font-semibold text-gray-600 mb-1"
                    >
                      Kategori <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="prod-category"
                      value={form.category}
                      onChange={(e) =>
                        handleField(
                          "category",
                          e.target.value as ProductCategory,
                        )
                      }
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/40 focus:border-[#2D6A4F] transition bg-white"
                    >
                      {PRODUCT_CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Harga & Satuan */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="prod-price"
                        className="block text-xs font-semibold text-gray-600 mb-1"
                      >
                        Harga (Rp) <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="prod-price"
                        type="number"
                        required
                        min={0}
                        value={form.price}
                        onChange={(e) => handleField("price", e.target.value)}
                        placeholder="10000"
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/40 focus:border-[#2D6A4F] transition"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="prod-unit"
                        className="block text-xs font-semibold text-gray-600 mb-1"
                      >
                        Satuan
                      </label>
                      <input
                        id="prod-unit"
                        type="text"
                        value={form.unit}
                        onChange={(e) => handleField("unit", e.target.value)}
                        placeholder="kg"
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/40 focus:border-[#2D6A4F] transition"
                      />
                    </div>
                  </div>

                  {/* Stok */}
                  <div>
                    <label
                      htmlFor="prod-stock"
                      className="block text-xs font-semibold text-gray-600 mb-1"
                    >
                      Stok <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="prod-stock"
                      type="number"
                      required
                      min={0}
                      value={form.stock}
                      onChange={(e) => handleField("stock", e.target.value)}
                      placeholder="0"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/40 focus:border-[#2D6A4F] transition"
                    />
                  </div>

                  {/* Deskripsi */}
                  <div>
                    <label
                      htmlFor="prod-desc"
                      className="block text-xs font-semibold text-gray-600 mb-1"
                    >
                      Deskripsi
                    </label>
                    <textarea
                      id="prod-desc"
                      rows={3}
                      value={form.description}
                      onChange={(e) =>
                        handleField("description", e.target.value)
                      }
                      placeholder="Jelaskan produk Anda..."
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/40 focus:border-[#2D6A4F] transition resize-none"
                    />
                  </div>
                </form>

                {/* Modal footer */}
                <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 shrink-0">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    form="add-product-form"
                    disabled={addProduct.isPending}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-sm font-bold transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Plus size={15} />
                    {addProduct.isPending ? "Menyimpan..." : "Simpan Produk"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
