import fs from "node:fs";
const o = "src/components/GroAIModeA.tsx";
const b = String.fromCharCode(96);
const d = String.fromCharCode(36);

const src = [
// ===IMPORTS===
b+[
"import React, { useState, useRef, useEffect } from \"react\";",
"import { motion, AnimatePresence } from \"motion/react\";",
"import {",
"  ArrowLeft, Camera, Upload, Send, ShoppingCart, Star, X,",
"  Sprout, Sparkles, Menu, Plus, Search, MessageSquare,",
"  Globe, Bug, Droplet, FlaskConical, Waves, HelpCircle, ShieldAlert,",
"}  from \"lucide-react\";",
"import { useAuth } from \"../hooks/useAuth\";",
"import { MODULES } from \"../constants/gro-ai-modules\";",
"import { MOCK_PRODUCTS } from \"../constants/gro-ai-products\";",
"import { callGroAI } from \"../lib/groai-client\";",
"import { getModeASystemPrompt } from \"../lib/groai-prompts\";",
"import { useConversations } from \"../hooks/useConversations\";",
"import { MarkdownRenderer } from \"./gro-ai/shared/MarkdownRenderer\";",
"import { MessageSkeleton } from \"./gro-ai/shared/MessageSkeleton\";",
"import type { GroAIModule } from \"../types/gro-ai\";",
"import sidebarKiriImg from \"../assets/sidebar-kiri-a.png\";",
"import sidebarKananImg from \"../assets/sidebar-kanan-a.png\";",
"",
].join("
")+b
].join("
");
console.log(src.slice(0,200));