const fs = require("fs");
const o = [];
const w = (s) => o.push(s);

// IMPORTS
w('import React, { useState, useRef, useEffect } from "react";');
w('import { motion, AnimatePresence } from "motion/react";');
w("import {");
w("  ArrowLeft, Camera, Upload, Send, ShoppingCart, Star, X,");
w("  Sprout, Sparkles, Menu, Plus, Search, MessageSquare,");
w("  Globe, Bug, Droplet, FlaskConical, Waves, HelpCircle, ShieldAlert,");
w('} from "lucide-react";');
w('import { useAuth } from "../hooks/useAuth";');
w('import { MODULES } from "../constants/gro-ai-modules";');
w('import { MOCK_PRODUCTS } from "../constants/gro-ai-products";');
w('import { callGroAI } from "../lib/groai-client";');
w('import { getModeASystemPrompt } from "../lib/groai-prompts";');
w('import { useConversations } from "../hooks/useConversations";');
w('import { MarkdownRenderer } from "./gro-ai/shared/MarkdownRenderer";');
w('import { MessageSkeleton } from "./gro-ai/shared/MessageSkeleton";');
w('import type { GroAIModule } from "../types/gro-ai";');
w('import sidebarKiriImg from "../assets/sidebar-kiri-a.png";');
w('import sidebarKananImg from "../assets/sidebar-kanan-a.png";');
w("");

// MODULE ICONS
w("// -- Module icon lookup map");
w("const MODULE_ICONS: Record<string, React.ReactNode> = {");
w("  foto: <Camera size={13} />,");
w("  tanaman: <Sprout size={13} />,");
w("  lahan: <Globe size={13} />,");
w("  hama: <Bug size={13} />,");
w("  air: <Droplet size={13} />,");
w("  pupuk: <FlaskConical size={13} />,");
w("  perikanan: <Waves size={13} />,");
w("};");
w("");

// INTERFACES
w("interface SidebarContentProps {");
w("  onBack: () => void;");
w("  activeModule: GroAIModule;");
w("  activeConversationId: string | null;");
w("  conversations: Array<{ id: string; title: string; moduleId: string }>;");
w("  searchQuery: string;");
w("  setSearchQuery: (v: string) => void;");
w(
  "  filteredConversations: Array<{ id: string; title: string; moduleId: string }>;",
);
w("  handleModuleClick: (mod: GroAIModule) => void;");
w("  setActiveConversationId: (id: string | null) => void;");
w("  setActiveModule: (mod: GroAIModule) => void;");
w("  setLeftOpen: (v: boolean) => void;");
w("}");
w("");
w("interface RightPanelContentProps {");
w("  showProducts: boolean;");
w("}");
w("");

// SIDEBAR COMPONENT
w("function SidebarContent(");
w("  { onBack, activeModule, activeConversationId, conversations,");
w("    searchQuery, setSearchQuery, filteredConversations,");
w(
  "    handleModuleClick, setActiveConversationId, setActiveModule, setLeftOpen }",
);
w(": SidebarContentProps) {");
w("  return (");
w("    <div");
w('      className="flex flex-col h-full text-white/90"');
w("      style={{");
w("        backgroundImage: `url(${sidebarKiriImg})`,");
w("        backgroundSize: 'cover',");
w("        backgroundPosition: 'center',");
w("        backgroundRepeat: 'no-repeat',");
w("        backgroundColor: '#233226',");
w("      }}");
w("    >");
w(
  '      <div className="p-3 pb-2 border-b border-white/10 flex flex-col items-start">',
);
w("        <button");
w("          onClick={onBack}");
w(
  '          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 text-white/80 hover:text-white text-[10px] font-bold transition-all border border-white/10 shadow-xs cursor-pointer mb-2.5"',
);
w("        >");
w('          <ArrowLeft size={11} className="text-white/60" />');
w("          <span>Ganti Mode</span>");
w("        </button>");
w(
  '        <h2 className="font-display font-black text-white text-base leading-tight px-1.5 mt-0.5">',
);
w("          Crop &amp; Land AI");
w("        </h2>");
w('        <p className="text-white/40 text-[10px] px-1.5 mt-0.5">');
w("          Agrou for Petani");
w("        </p>");
w("      </div>");
w("");
w(
  '      <div className="pt-2 pb-2 flex-1 overflow-y-auto flex flex-col min-h-0 scrollbar-hide">',
);
w('        <div className="px-2.5 shrink-0">');
w("          <button");
w(
  "            onClick={() => { setActiveConversationId(null); setLeftOpen(false); }}",
);
w(
  '            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/15 hover:bg-white/10 text-white text-[10px] font-bold transition-all mb-2.5 w-full cursor-pointer bg-white/5 shrink-0"',
);
w("          >");
w('            <Plus size={12} className="text-white/60" />');
w("            <span>Chat Baru</span>");
w("          </button>");
w("        </div>");
w("");
w(
  '        <p className="text-white/30 text-[8px] font-black uppercase tracking-[0.15em] px-3.5 mb-1 mt-0.5 shrink-0">',
);
w("          PILIH MODUL");
w("        </p>");
w('        <div className="space-y-0.5 shrink-0">');
w("          {MODULES.map((mod) => {");
w(
  "            const isActive = activeConversationId !== null && activeModule.id === mod.id;",
);
w("            return (");
w("              <button");
w("                key={mod.id}");
w("                onClick={() => handleModuleClick(mod)}");
w("                className={");
w("                  isActive");
w(
  "                    ? 'flex items-center gap-2 px-3.5 py-1.5 bg-[#2d6a4f]/40 border-l-[3px] border-[#b5f23d] text-white font-bold text-xs w-full text-left transition-all mb-1 cursor-pointer rounded-none'",
);
w(
  "                    : 'flex items-center gap-2 px-3.5 py-1.5 text-white/60 font-medium text-xs w-full text-left hover:bg-white/5 hover:text-white/90 transition-all mb-1 cursor-pointer rounded-none border-l-[3px] border-transparent'",
);
w("                }");
w("              >");
w("                <div");
w("                  className={");
w("                    isActive");
w(
  "                      ? 'w-5 h-5 rounded-md bg-[#b5f23d]/20 flex items-center justify-center text-[#b5f23d] shrink-0'",
);
w(
  "                      : 'w-5 h-5 rounded-md bg-white/5 flex items-center justify-center text-white/40 shrink-0'",
);
w("                  }");
w("                >");
w("                  {MODULE_ICONS[mod.id] ?? <Sprout size={13} />}");
w("                </div>");
w('                <div className="flex flex-col items-start min-w-0">');
w(
  '                  <span className="truncate w-full leading-tight">{mod.label}</span>',
);
w("                  {isActive && (");
w(
  '                    <span className="text-[9px] text-[#b5f23d]/70 font-normal leading-tight truncate w-full">',
);
w("                      {mod.desc}");
w("                    </span>");
w("                  )}");
w("                </div>");
w("              </button>");
w("            );");
w("          })}");
w("        </div>");
w("");
w('        <div className="mt-3 pt-2.5 border-t border-white/10 px-2.5">');
w(
  '          <div className="flex items-center justify-between px-2 mb-1.5 shrink-0">',
);
w(
  '            <p className="text-white/30 text-[8px] font-black uppercase tracking-[0.15em]">RIWAYAT CHAT</p>',
);
w('            <MessageSquare size={9} className="text-white/30" />');
w("          </div>");
w(
  '          <div className="relative mb-1.5 px-0.5 shrink-0 flex items-center">',
);
w("            <input");
w('              type="text"');
w('              placeholder="Cari obrolan..."');
w("              value={searchQuery}");
w("              onChange={(e) => setSearchQuery(e.target.value)}");
w(
  '              className="w-full bg-white/5 border border-white/10 rounded-md py-1 px-2.5 pl-6.5 text-[9px] text-white placeholder:text-white/30 focus:outline-none focus:border-[#b5f23d] transition-all"',
);
w("            />");
w(
  '            <Search size={10} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />',
);
w("            {searchQuery && (");
w("              <button");
w("                onClick={() => setSearchQuery('')}");
w(
  '                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer"',
);
w("              >");
w("                <X size={9} />");
w("              </button>");
w("            )}");
w("          </div>");
w('          <div className="space-y-0.5 pr-0.5">');
w("            {filteredConversations.length === 0 ? (");
w(
  '              <p className="text-white/20 text-[9px] px-2 py-1.5 italic text-center">Belum ada obrolan</p>',
);
w("            ) : (");
w("              filteredConversations.map((conv) => {");
w("                const isActive = activeConversationId === conv.id;");
w("                return (");
w("                  <button");
w("                    key={conv.id}");
w("                    onClick={() => {");
w("                      setActiveConversationId(conv.id);");
w(
  "                      const mod = MODULES.find((m) => m.id === conv.moduleId);",
);
w("                      if (mod) setActiveModule(mod);");
w("                      setLeftOpen(false);");
w("                    }}");
w("                    className={");
w("                      isActive");
w(
  "                        ? 'flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-[#b5f23d]/15 border border-[#b5f23d]/20 text-white font-bold text-[11px] w-full text-left transition-all cursor-pointer'",
);
w(
  "                        : 'flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-white/50 font-medium text-[11px] w-full text-left hover:bg-white/5 hover:text-white/80 transition-all cursor-pointer'",
);
w("                    }");
w("                  >");
w(
  '                    <span className="shrink-0 text-white/30 text-[9px]">\u{1F4AC}</span>',
);
w('                    <span className="truncate flex-1">{conv.title}</span>');
w("                  </button>");
w("                );");
w("              })");
w("            )}");
w("          </div>");
w("        </div>");
w("      </div>");
w("    </div>");
w("  );");
w("}");
w("");

// RIGHT PANEL COMPONENT
w("function RightPanelContent({ showProducts }: RightPanelContentProps) {");
w("  return (");
w('    <div className="flex flex-col gap-4 text-white">');
w("      {showProducts ? (");
w("        <>");
w('          <div className="flex items-center justify-between">');
w(
  '            <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.15em]">REKOMENDASI PRODUK</p>',
);
w(
  '            <span className="bg-[#b5f23d]/15 border border-[#b5f23d]/30 text-[#b5f23d] text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">AI Pick</span>',
);
w("          </div>");
w('          <div className="flex flex-col gap-3">');
w("            {MOCK_PRODUCTS.map((product) => (");
w("              <div");
w("                key={product.id}");
w(
  '                className="bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/8 transition-colors flex flex-col gap-2"',
);
w("              >");
w('                <div className="flex gap-3">');
w(
  '                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-2xl shrink-0">',
);
w("                    \u{1F33F}");
w("                  </div>");
w('                  <div className="flex-1 min-w-0">');
w(
  '                    <span className="text-[#b5f23d] text-[9px] font-bold uppercase tracking-wider">{product.category}</span>',
);
w(
  '                    <p className="font-bold text-xs text-white leading-snug mt-0.5 truncate">{product.name}</p>',
);
w('                    <div className="flex items-center gap-1.5 mt-1">');
w(
  '                      <Star size={10} className="text-[#f77f00] fill-[#f77f00]" />',
);
w(
  '                      <span className="text-white text-xs font-bold">{product.rating}</span>',
);
w(
  '                      <span className="text-white/40 text-[9px]">({product.sold} terjual)</span>',
);
w("                    </div>");
w("                  </div>");
w("                </div>");
w(
  '                <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-1">',
);
w("                  <div>");
w(
  '                    <span className="text-[#b5f23d] font-black text-xs">{product.price}</span>',
);
w(
  '                    <span className="text-white/40 text-[9px]">{product.unit}</span>',
);
w("                  </div>");
w(
  '                  <button className="bg-[#b5f23d] text-black text-[10px] font-black px-2.5 py-1 rounded-lg hover:bg-[#a2db34] transition-all flex items-center gap-1 cursor-pointer">',
);
w("                    <ShoppingCart size={10} />");
w("                    Beli");
w("                  </button>");
w("                </div>");
w("              </div>");
w("            ))}");
w("          </div>");
w(
  '          <button className="w-full text-center text-[#b5f23d] hover:text-[#a2db34] font-bold text-xs py-2.5 border border-white/10 rounded-xl bg-white/5 hover:bg-white/8 transition-all cursor-pointer">',
);
w("            Lihat semua di Agrou Tani \u2192");
w("          </button>");
w("        </>");
w("      ) : (");
w(
  '        <div className="p-4 text-center flex flex-col items-center justify-center min-h-[300px]">',
);
w(
  '          <div className="w-12 h-12 rounded-2xl bg-[#b5f23d]/15 flex items-center justify-center mb-3 animate-pulse">',
);
w('            <Sprout size={22} className="text-[#b5f23d]" />');
w("          </div>");
w(
  '          <p className="font-bold text-sm text-white mb-2">Rekomendasi Produk</p>',
);
w(
  '          <p className="text-white/50 text-xs leading-relaxed max-w-[200px]">',
);
w(
  "            Kirim pertanyaan dulu \u2014 Gro AI akan merekomendasikan produk yang tepat dari Agrou Tani di sini.",
);
w("          </p>");
w("        </div>");
w("      )}");
w("    </div>");
w("  );");
w("}");
w("");

// MAIN COMPONENT
w("export default function GroAIModeA({ onBack }: { onBack: () => void }) {");
w("  const { user, profile } = useAuth();");
w("  const [activeModule, setActiveModule] = useState<GroAIModule>(MODULES[0]);");
w("  const [leftOpen, setLeftOpen] = useState(false);");
w("  const [rightOpen, setRightOpen] = useState(false);");
w("  const [input, setInput] = useState('');");
w("  const [loading, setLoading] = useState(false);");
w("  const [showProducts, setShowProducts] = useState(false);");
w("  const [imagePreview, setImagePreview] = useState<string | null>(null);");
w("  const [searchQuery, setSearchQuery] = useState('');");
w("  const messagesEndRef = useRef<HTMLDivElement>(null);");
w("  const fileInputRef = useRef<HTMLInputElement>(null);");
w("  const cameraInputRef = useRef<HTMLInputElement>(null);");
w("");
w("  const {");
w("    conversations,");
w("    activeId: activeConversationId,");
w("    setActiveId: setActiveConversationId,");
w("    activeConversation,");
w("    createConversation,");
w("    appendMessage,");
w("  } = useConversations({ filterByModuleId: undefined });");
w("");
w("  const filteredConversations = conversations.filter((c) =>");
w("    c.title.toLowerCase().includes(searchQuery.toLowerCase())");
w("  );");
w("");
w("  const messageCount = (activeConversation?.messages ?? []).length;");
w("");
w("  useEffect(() => {");
w("    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });");
w("  }, [messageCount, activeConversationId]);");
w("");
w("  useEffect(() => {");
w("    const msgs = activeConversation?.messages ?? [];");
w("    setShowProducts(activeConversationId !== null && msgs.length > 2);");
w("  }, [activeConversationId, activeConversation]);");
w("");
w("  const handleModuleClick = (mod: GroAIModule) => {");
w("    setActiveModule(mod);");
w("    setLeftOpen(false);");
w("    const existing = conversations.find((c) => c.moduleId === mod.id);");
w("    if (existing) {");
w("      setActiveConversationId(existing.id);");
w("    } else {");
w("      setActiveConversationId(null);");
w("    }");
w("  };");
w("");
w("  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {");
w("    const file = e.target.files?.[0];");
w("    if (!file) return;");
w("    const reader = new FileReader();");
w("    reader.onload = (ev) => setImagePreview(ev.target?.result as string);");
w("    reader.readAsDataURL(file);");
w("  };");
w("");
w("  const sendMessage = async (text: string, image?: string) => {");
w("    if (!text.trim() && !image) return;");
w("    setInput('');");
w("    setImagePreview(null);");
w("    setLoading(true);");
w("");
w("    const userMsg = { role: 'user' as const, content: text, image: image || undefined };");
w("    let convId = activeConversationId;");
w("    let history: Array<{ role: 'user' | 'assistant'; content: string }>;");
w("");
w("    if (!convId) {");
w("      const title = text.length > 30 ? text.slice(0, 30) + '...' : text || 'Analisis Gambar';");
w("      const welcomeMsg = { role: 'assistant' as const, content: 'Halo! Saya Gro AI, asisten pertanian dan perikanan Agrou. 🌱' };");
w("      convId = createConversation(title, activeModule.id, welcomeMsg);");
w("      appendMessage(convId, userMsg);");
w("      history = [welcomeMsg, userMsg];");
w("    } else {");
w("      appendMessage(convId, userMsg);");
w("      history = [...(activeConversation?.messages ?? []), userMsg];");
w("    }");
w("");
w("    try {");
w("      const result = await callGroAI({");
w("        message: text,");
w("        systemPrompt: getModeASystemPrompt(activeModule),");
w("        history: history.slice(-8).map((m) => ({ role: m.role, content: m.content })),");
w("      });");
w("      appendMessage(convId, { role: 'assistant', content: result.reply });");
w("      setShowProducts(true);");
w("    } catch {");
w("      appendMessage(convId, { role: 'assistant', content: '⚠️ Koneksi ke Gro AI bermasalah. Pastikan internet tersambung dan coba lagi.' });");
w("    } finally {");
w("      setLoading(false);");
w("    }");
w("  };");
w("");
w("  const currentMessages = activeConversation?.messages ?? [];");
w("  const avatarInitial = profile?.full_name");
w("    ? profile.full_name.charAt(0).toUpperCase()");
w("    : user?.email?.charAt(0).toUpperCase() ?? 'U';");
w("");
w("  return (");
w("    <div");
w("      className="flex overflow-hidden w-full bg-white animate-fade-in"");
w("      style={{ height: 'calc(100vh - 53px)' }}");
w("    >");
w("      {/* LEFT SIDEBAR desktop */}");
w("      <div className="w-[200px] shrink-0 hidden lg:flex flex-col h-full border-r border-white/10 bg-[#233226]">");
w("        <SidebarContent");
w("          onBack={onBack}");
w("          activeModule={activeModule}");
w("          activeConversationId={activeConversationId}");
w("          conversations={conversations}");
w("          searchQuery={searchQuery}");
w("          setSearchQuery={setSearchQuery}");
w("          filteredConversations={filteredConversations}");
w("          handleModuleClick={handleModuleClick}");
w("          setActiveConversationId={setActiveConversationId}");
w("          setActiveModule={setActiveModule}");
w("          setLeftOpen={setLeftOpen}");
w("        />");
w("      </div>");
w("");
w("      {/* LEFT SIDEBAR mobile overlay */}");
w("      <AnimatePresence>");
w("        {leftOpen && (");
w("          <motion.div");
w("            className="fixed inset-0 z-50 lg:hidden"");
w("            initial={{ opacity: 0 }}");
w("            animate={{ opacity: 1 }}");
w("            exit={{ opacity: 0 }}");
w("          >");
w("            <div className="absolute inset-0 bg-black/60" onClick={() => setLeftOpen(false)} />");
w("            <motion.div");
w("              className="absolute left-0 top-0 bottom-0 w-[200px] border-r border-white/10 overflow-y-auto bg-[#233226]"");
w("              initial={{ x: -280 }}");
w("              animate={{ x: 0 }}");
w("              exit={{ x: -280 }}");
w("              transition={{ type: 'tween', duration: 0.25 }}");
w("            >");
w("              <SidebarContent");
w("                onBack={onBack}");
w("                activeModule={activeModule}");
w("                activeConversationId={activeConversationId}");
w("                conversations={conversations}");
w("                searchQuery={searchQuery}");
w("                setSearchQuery={setSearchQuery}");
w("                filteredConversations={filteredConversations}");
w("                handleModuleClick={handleModuleClick}");
w("                setActiveConversationId={setActiveConversationId}");
w("                setActiveModule={setActiveModule}");
w("                setLeftOpen={setLeftOpen}");
w("              />");
w("            </motion.div>");
w("          </motion.div>");
w("        )}");
w("      </AnimatePresence>");
w("");
w("      {/* MAIN CONTENT */}");
w("      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">");
w("        {/* Mobile header */}");
w("        <div");
w("          className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-black/8 lg:hidden"");
w("          style={{ background: 'var(--color-cream)' }}");
w("        >");
w("          <button");
w("            onClick={() => setLeftOpen(true)}");
w("            className="lg:hidden p-1.5 rounded-lg bg-black/5 border border-black/8 text-black/50 hover:text-(--color-forest-dark)"");
w("          >");
w("            <Menu size={16} />");
w("          </button>");
w("          <div className="text-center">");
w("            <p className="text-(--color-forest-dark) font-semibold text-sm capitalize">{activeModule.label}</p>");
w("            <p className="text-black/40 text-[10px]">Gro AI Petani</p>");
w("          </div>");
w("          <button");
w("            onClick={() => setRightOpen(true)}");
w("            className="lg:hidden p-1.5 rounded-lg bg-black/5 border border-black/8 text-black/50 hover:text-(--color-forest-dark)"");
w("          >");
w("            <Sprout size={16} />");
w("          </button>");
w("        </div>");
w("");
w("        {/* Chat Panel Content */}");
w("        <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">");
w("          <div className="flex-1 flex flex-col h-full overflow-hidden bg-white min-w-0">");
w("");
w("            {/* Quick prompts bar */}");
w("            {activeConversationId !== null && (");
w("              <div className="px-4 py-3 border-b border-(--color-border) bg-(--color-cream) shrink-0">");
w("                <p className="text-[10px] font-black text-(--color-text-secondary) uppercase tracking-widest mb-2">");
w("                  Pertanyaan Cepat — {activeModule.label}");
w("                </p>");
w("                <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>");
w("                  {activeModule.prompts.map((p, i) => (");
w("                    <button");
w("                      key={i}");
w("                      onClick={() => sendMessage(p)}");
w("                      className="shrink-0 bg-white border border-(--color-border) text-(--color-text-primary) text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap hover:border-(--color-forest) hover:text-(--color-forest) transition-all cursor-pointer shadow-2xs"");
w("                    >");
w("                      {p}");
w("                    </button>");
w("                  ))}");
w("                </div>");
w("              </div>");
w("            )}");
