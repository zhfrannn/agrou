import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe, ArrowLeft, Star, Bookmark, MessageSquare, Send,
  FileCheck, Shield, CheckCircle2, Download, TrendingUp,
  Package, BadgeCheck, Award
} from 'lucide-react';

const TABS = ['Profil & Kebutuhan', 'Riwayat Pembelian', 'Ulasan & Rating', 'Dokumen & Sertifikasi'];

const KOMODITAS_OPTIONS = ['Kopi Arabika', 'Udang Vannamei', 'Sayuran Organik', 'Rempah-rempah', 'Kakao', 'Rumput Laut'];

const SIMILAR_IMPORTIR = [
  { flag: '🇯🇵', name: 'Yamamoto Trading Co.', country: 'Jepang', products: 'Kopi, Kakao' },
  { flag: '🇰🇷', name: 'Seoul Fresh Import', country: 'Korea', products: 'Sayuran, Buah' },
  { flag: '🇭🇰', name: 'HK Green Source', country: 'Hong Kong', products: 'Rempah, Herbal' },
];

const PURCHASE_HISTORY = [
  { date: 'Mar 2025', koperasi: 'KSU Maju Gayo', komoditas: 'Kopi Arabika', volume: '3.2 Ton', nilai: 'USD 13,440', status: 'selesai' },
  { date: 'Feb 2025', koperasi: 'KUD Nelayan Makassar', komoditas: 'Udang Vannamei', volume: '5.0 Ton', nilai: 'USD 34,000', status: 'selesai' },
  { date: 'Jan 2025', koperasi: 'Koperasi Tani Sehat', komoditas: 'Sayuran Mix', volume: '2.1 Ton', nilai: 'USD 4,410', status: 'selesai' },
  { date: 'Des 2024', koperasi: 'KSU Rempah Nusantara', komoditas: 'Lada Hitam', volume: '1.8 Ton', nilai: 'USD 14,400', status: 'selesai' },
  { date: 'Nov 2024', koperasi: 'KUD Pesisir Timur', komoditas: 'Udang Tiger', volume: '4.5 Ton', nilai: 'USD 31,500', status: 'proses' },
];

const REVIEWS = [
  { stars: 5, name: 'Pak Budi Santoso', org: 'KSU Maju Gayo', text: 'Pembeli sangat profesional, pembayaran tepat waktu, komunikasi jelas. Sudah 3x transaksi dan selalu memuaskan.' },
  { stars: 5, name: 'Ibu Sari Dewi', org: 'Koperasi Tani Sehat', text: 'SNI sangat membantu dalam proses sertifikasi. Mereka memberikan panduan teknis yang sangat bermanfaat.' },
  { stars: 5, name: 'Pak Hendra', org: 'KUD Nelayan Makassar', text: 'Harga kompetitif dan transparan. Tidak ada biaya tersembunyi. Sangat direkomendasikan untuk koperasi pemula ekspor.' },
  { stars: 4, name: 'Bu Rahayu', org: 'Koperasi Rempah Aceh', text: 'Proses negosiasi yang fair. Waktu pembayaran kadang mundur 1-2 hari tapi selalu terpenuhi.' },
];

const CERTIFICATIONS = [
  { icon: 'FileCheck', name: 'Import License', issuer: 'Ministry of Trade Singapore', validUntil: 'Des 2026' },
  { icon: 'Shield', name: 'ISO 9001:2015', issuer: 'SGS International', validUntil: 'Okt 2025' },
  { icon: 'Globe', name: 'CITES License', issuer: 'CITES Authority', validUntil: 'Mar 2026' },
  { icon: 'CheckCircle2', name: 'Food Safety Cert', issuer: 'SFA Singapore', validUntil: 'Jul 2025' },
];

const DOCUMENTS = [
  { name: 'Company Profile 2024', size: 'PDF, 2.4 MB' },
  { name: 'Bank Reference Letter — Verified', size: 'PDF, 0.8 MB' },
  { name: 'Letter of Credit Sample', size: 'PDF, 1.2 MB' },
];

export default function ImportirProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Profil & Kebutuhan');
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isTabLoading, setIsTabLoading] = useState(false);
  const [offerKomoditas, setOfferKomoditas] = useState('');
  const [offerVolume, setOfferVolume] = useState('');
  const [offerHarga, setOfferHarga] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (tab: string) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setIsTabLoading(true);
    setTimeout(() => setIsTabLoading(false), 600);
  };

  const CertIcon = ({ icon }: { icon: string }) => {
    if (icon === 'FileCheck') return <FileCheck size={22} className='text-[#1a6b8a]' />;
    if (icon === 'Shield') return <Shield size={22} className='text-[#1a6b8a]' />;
    if (icon === 'Globe') return <Globe size={22} className='text-[#1a6b8a]' />;
    return <CheckCircle2 size={22} className='text-[#1a6b8a]' />;
  };

  return (
    <div className='w-full bg-[#FFFDF7] min-h-screen pb-24'>

      {/* HERO */}
      <section className='w-full h-[320px] relative bg-[#1a1a2e]'>
        <img src='https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1920' alt='Singapore Port' className='w-full h-full object-cover opacity-80' />
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent'></div>
        <div className='absolute inset-0 bg-gradient-to-b from-black/30 to-transparent h-32'></div>
        <button onClick={() => navigate('/connect')} className='absolute top-6 left-8 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center gap-2 border border-white/30 transition-all duration-200'>
          <ArrowLeft size={16} />
          <span className='text-sm font-medium'>Kembali</span>
        </button>
        <div className='absolute top-6 right-8 bg-gradient-to-r from-[#1a6b8a] to-[#0e4d6e] text-white px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 border border-white/20 backdrop-blur-md'>
          <Globe size={16} />
          <span className='font-bold text-sm tracking-wide'>🌍 Verified Global Buyer — Aktif</span>
        </div>
      </section>

      <div className='max-w-[1440px] mx-auto px-4 lg:px-8 relative -mt-16'>

        {/* IDENTITY CARD */}
        <div className='bg-white rounded-[2rem] p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-8'>
          <div className='flex flex-col lg:flex-row gap-6 lg:items-end'>
            <div className='w-[100px] h-[100px] lg:w-[120px] lg:h-[120px] rounded-full border-[6px] border-white overflow-hidden bg-white shadow-lg shrink-0 -mt-20 lg:-mt-24 relative z-10'>
              {isPageLoading ? (
                <div className='w-full h-full bg-gray-200 animate-pulse'></div>
              ) : (
                <img src='https://ui-avatars.com/api/?name=SNI&background=1a6b8a&color=fff&size=100' alt='SNI' className='w-full h-full object-cover' />
              )}
            </div>
            <div className='space-y-2'>
              {isPageLoading ? (
                <div className='animate-pulse space-y-2'>
                  <div className='h-7 bg-gray-200 rounded-lg w-72'></div>
                  <div className='h-5 bg-gray-100 rounded-lg w-56'></div>
                  <div className='flex gap-2'><div className='h-6 bg-gray-200 rounded-full w-24'></div><div className='h-6 bg-gray-200 rounded-full w-16'></div><div className='h-6 bg-gray-200 rounded-full w-28'></div></div>
                </div>
              ) : (
                <>
                  <h1 className='text-2xl lg:text-3xl font-bold text-gray-900'>PT. Sinar Niaga Internasional</h1>
                  <p className='text-gray-500 flex items-center gap-1.5 text-sm'><Globe size={15} className='text-[#1a6b8a]' />🇸🇬 Singapura · Beroperasi di 12 Negara</p>
                  <div className='flex flex-wrap gap-2 pt-1'>
                    <span className='inline-flex items-center gap-1 bg-blue-50 text-[#1a6b8a] text-xs font-semibold px-3 py-1 rounded-full border border-blue-100'><BadgeCheck size={13} /> Terverifikasi</span>
                    <span className='inline-flex items-center gap-1 bg-amber-50 text-amber-600 text-xs font-semibold px-3 py-1 rounded-full border border-amber-100'><Star size={13} className='fill-amber-400 text-amber-400' /> 4.9</span>
                    <span className='inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-100'><Award size={13} /> Premium Buyer</span>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className='flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end shrink-0'>
            {isPageLoading ? (
              <div className='animate-pulse space-y-2'><div className='h-10 bg-gray-200 rounded-xl w-44'></div><div className='h-10 bg-gray-100 rounded-xl w-44'></div><div className='h-10 bg-gray-100 rounded-xl w-44'></div></div>
            ) : (
              <>
                <button className='bg-[#1B4D3E] hover:bg-[#163d31] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 justify-center'><Send size={15} /> Kirim Penawaran</button>
                <button className='border-2 border-[#1B4D3E] text-[#1B4D3E] hover:bg-[#1B4D3E]/5 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 justify-center'><MessageSquare size={15} /> Hubungi via Pesan</button>
                <button className='border border-gray-200 text-gray-600 hover:bg-gray-50 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 justify-center'><Bookmark size={15} /> Simpan Profil</button>
              </>
            )}
          </div>
        </div>

        {/* STATS ROW */}
        {!isPageLoading && (
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
            {[
              { label: 'Total Pembelian', value: '2.847 Ton' },
              { label: 'Negara Sumber', value: '12' },
              { label: 'Sukses', value: '98.4%' },
              { label: 'Bergabung', value: '2019' },
            ].map((stat) => (
              <div key={stat.label} className='bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100'>
                <p className='text-xs text-gray-400 font-medium mb-1'>{stat.label}</p>
                <p className='text-xl font-bold text-gray-900'>{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* TAB NAV */}
        <div className='bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100 mb-8 overflow-hidden'>
          <div className='flex overflow-x-auto'>
            {TABS.map((tab) => (
              <button key={tab} onClick={() => handleTabChange(tab)} className={'relative px-6 py-4 text-sm font-semibold whitespace-nowrap transition-all duration-200 ' + (activeTab === tab ? 'text-[#F77F00]' : 'text-gray-500 hover:text-gray-700')}>
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId='importirTabIndicator' className='absolute bottom-0 left-0 right-0 h-0.5 bg-[#F77F00]' transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* TAB CONTENTS */}
        <AnimatePresence mode='wait'>
          {/* TAB 1: PROFIL & KEBUTUHAN */}
          {activeTab === 'Profil & Kebutuhan' && (
            <motion.div key='profil' initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
              <div className='lg:col-span-8 space-y-8'>
                {isPageLoading || isTabLoading ? (
                  <div className='animate-pulse space-y-4'><div className='h-8 bg-gray-200 rounded-lg w-48'></div><div className='h-32 bg-gray-100 rounded-2xl'></div><div className='h-8 bg-gray-200 rounded-lg w-56'></div></div>
                ) : (
                  <>
                    <div className='bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100'>
                      <h2 className='text-lg font-bold text-gray-900 mb-4'>Tentang Perusahaan</h2>
                      <p className='text-gray-600 leading-relaxed text-sm'>PT. Sinar Niaga Internasional adalah importir produk pertanian premium berbasis di Singapura dengan pengalaman lebih dari 15 tahun. Kami berkomitmen mendukung pertanian berkelanjutan Indonesia melalui kemitraan jangka panjang dengan koperasi-koperasi terpilih.</p>
                    </div>
                    <div className='bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100'>
                      <h2 className='text-lg font-bold text-gray-900 mb-4'>Komoditas yang Dicari</h2>
                      <div className='flex gap-3 overflow-x-auto pb-2'>{KOMODITAS_OPTIONS.map((k) => (<span key={k} className='shrink-0 bg-[#F77F00]/10 text-[#F77F00] border border-[#F77F00]/20 text-sm font-semibold px-4 py-2 rounded-full'>{k}</span>))}</div>
                    </div>
                    <div className='bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100'>
                      <h2 className='text-lg font-bold text-gray-900 mb-5'>Kebutuhan Rutin</h2>
                      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        {[{emoji:'🫘',name:'Kopi Arabika Grade 1',volume:'5-10 Ton/bulan',price:'USD 3.80-4.50/kg',cert:'GlobalGAP, Rainforest Alliance'},{emoji:'🦐',name:'Udang Vannamei Size 30/40',volume:'8-15 Ton/bulan',price:'USD 5.50-7.00/kg',cert:'HACCP, ASC'},{emoji:'🥬',name:'Sayuran Organik Mix',volume:'2-4 Ton/minggu',price:'USD 1.80-2.50/kg',cert:'Organik Tersertifikasi'}].map((item) => (
                          <div key={item.name} className='border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow duration-200'>
                            <div className='text-2xl mb-2'>{item.emoji}</div>
                            <h3 className='font-bold text-gray-900 text-sm mb-2'>{item.name}</h3>
                            <p className='text-xs text-gray-500 mb-1'>{item.volume}</p>
                            <p className='text-xs text-emerald-700 font-semibold mb-1'>{item.price}</p>
                            <p className='text-xs text-gray-400 mb-3'>Standar: {item.cert}</p>
                            <button className='w-full bg-[#1B4D3E] hover:bg-[#163d31] text-white text-xs font-semibold py-2 rounded-lg transition-colors duration-200'>Ajukan Penawaran</button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className='bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100'>
                      <h2 className='text-lg font-bold text-gray-900 mb-4'>Preferensi Kerjasama</h2>
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>{[{label:'Syarat Pembayaran',value:'LC 30 hari, T/T 50% DP'},{label:'Minimum Order',value:'1 Ton per pengiriman'},{label:'Pengiriman',value:'FOB Tanjung Priok / CIF Singapore'},{label:'Sertifikasi Diperlukan',value:'GlobalGAP, HACCP, Organik'}].map((item) => (<div key={item.label} className='bg-gray-50 rounded-xl p-4'><p className='text-xs text-gray-400 font-medium mb-1'>{item.label}</p><p className='text-sm font-semibold text-gray-800'>{item.value}</p></div>))}</div>
                    </div>
                  </>
                )}
              </div>
              <div className='lg:col-span-4 space-y-6'>
                {!isPageLoading && !isTabLoading && (
                  <>
                    <div className='bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100 lg:sticky lg:top-24'>
                      <h3 className='text-base font-bold text-gray-900 mb-4'>Kirim Penawaran Sekarang</h3>
                      <div className='space-y-3'>
                        <div><label className='text-xs font-medium text-gray-500 mb-1 block'>Komoditas</label><select value={offerKomoditas} onChange={(e) => setOfferKomoditas(e.target.value)} className='w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/30'><option value=''>Pilih komoditas...</option>{KOMODITAS_OPTIONS.map((k) => (<option key={k} value={k}>{k}</option>))}</select></div>
                        <div><label className='text-xs font-medium text-gray-500 mb-1 block'>Volume (Ton)</label><input type='number' value={offerVolume} onChange={(e) => setOfferVolume(e.target.value)} placeholder='contoh: 5' className='w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/30' /></div>
                        <div><label className='text-xs font-medium text-gray-500 mb-1 block'>Harga Target</label><input type='text' value={offerHarga} onChange={(e) => setOfferHarga(e.target.value)} placeholder='contoh: USD 4.00/kg' className='w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/30' /></div>
                        <button className='w-full bg-[#1B4D3E] hover:bg-[#163d31] text-white font-semibold py-3 rounded-xl text-sm transition-colors duration-200 flex items-center justify-center gap-2'><Send size={15} /> Kirim Penawaran</button>
                        <p className='text-xs text-gray-400 text-center'>Respon biasanya dalam 1x24 jam</p>
                      </div>
                    </div>
                    <div className='bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100'>
                      <h3 className='text-base font-bold text-gray-900 mb-4'>Importir Serupa</h3>
                      <div className='space-y-3'>{SIMILAR_IMPORTIR.map((imp) => (<div key={imp.name} className='flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-150 cursor-pointer'><span className='text-2xl'>{imp.flag}</span><div className='flex-1 min-w-0'><p className='text-sm font-semibold text-gray-800 truncate'>{imp.name}</p><p className='text-xs text-gray-400'>{imp.country} · {imp.products}</p></div><Package size={14} className='text-gray-300 shrink-0' /></div>))}</div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 2: RIWAYAT PEMBELIAN */}
          {activeTab === 'Riwayat Pembelian' && (
            <motion.div key='riwayat' initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {isTabLoading ? (
                <div className='animate-pulse bg-white rounded-2xl h-64'></div>
              ) : (
                <>
                  <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
                    {[{label:'Total Transaksi',value:'47'},{label:'Total Volume',value:'2.847 Ton'},{label:'Total Nilai',value:'Rp 58.4 Miliar'},{label:'Rating',value:'4.9 ★'}].map((s) => (<div key={s.label} className='bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100'><p className='text-xs text-gray-400 font-medium mb-1'>{s.label}</p><p className='text-xl font-bold text-gray-900'>{s.value}</p></div>))}
                  </div>
                  <div className='bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden'>
                    <div className='overflow-x-auto'>
                      <table className='w-full text-sm'>
                        <thead><tr className='bg-gray-50 border-b border-gray-100'><th className='text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider'>Tanggal</th><th className='text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider'>Koperasi</th><th className='text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider'>Komoditas</th><th className='text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider'>Volume</th><th className='text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider'>Nilai</th><th className='text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider'>Status</th></tr></thead>
                        <tbody className='divide-y divide-gray-50'>
                          {PURCHASE_HISTORY.map((row, i) => (
                            <tr key={i} className='hover:bg-gray-50 transition-colors duration-150'>
                              <td className='px-6 py-4 text-gray-600'>{row.date}</td>
                              <td className='px-6 py-4 font-medium text-gray-900'>{row.koperasi}</td>
                              <td className='px-6 py-4 text-gray-600'>{row.komoditas}</td>
                              <td className='px-6 py-4 text-gray-600'>{row.volume}</td>
                              <td className='px-6 py-4 font-semibold text-gray-900'>{row.nilai}</td>
                              <td className='px-6 py-4'>{row.status === 'selesai' ? (<span className='inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full'>✅ Selesai</span>) : (<span className='inline-flex items-center gap-1 bg-amber-50 text-amber-600 text-xs font-semibold px-2.5 py-1 rounded-full'>🔄 Proses</span>)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* TAB 3: ULASAN & RATING */}
          {activeTab === 'Ulasan & Rating' && (
            <motion.div key='ulasan' initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {isTabLoading ? (
                <div className='animate-pulse bg-white rounded-2xl h-64'></div>
              ) : (
                <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
                  <div className='lg:col-span-4'>
                    <div className='bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100 text-center'>
                      <div className='text-6xl font-bold text-gray-900 mb-1'>4.9</div>
                      <div className='text-2xl text-amber-400 mb-2'>★★★★★</div>
                      <p className='text-sm text-gray-400 mb-6'>dari 47 ulasan</p>
                      <div className='space-y-2'>
                        {[{star:5,pct:89},{star:4,pct:8},{star:3,pct:2},{star:2,pct:1},{star:1,pct:0}].map((r) => (
                          <div key={r.star} className='flex items-center gap-3'>
                            <span className='text-xs text-gray-500 w-4'>{r.star}</span>
                            <Star size={12} className='text-amber-400 fill-amber-400 shrink-0' />
                            <div className='flex-1 bg-gray-100 rounded-full h-2'><div className='bg-amber-400 h-2 rounded-full' style={{ width: r.pct + '%' }}></div></div>
                            <span className='text-xs text-gray-400 w-8 text-right'>{r.pct}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className='lg:col-span-8 space-y-4'>
                    {REVIEWS.map((rev, i) => (
                      <div key={i} className='bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100'>
                        <div className='flex items-start justify-between mb-3'>
                          <div>
                            <p className='font-semibold text-gray-900'>{rev.name}</p>
                            <p className='text-xs text-gray-400'>{rev.org}</p>
                          </div>
                          <div className='flex gap-0.5'>{Array.from({length:5}).map((_,s) => (<Star key={s} size={14} className={s < rev.stars ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'} />))}</div>
                        </div>
                        <p className='text-sm text-gray-600 leading-relaxed'>{rev.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 4: DOKUMEN & SERTIFIKASI */}
          {activeTab === 'Dokumen & Sertifikasi' && (
            <motion.div key='dokumen' initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {isTabLoading ? (
                <div className='animate-pulse bg-white rounded-2xl h-64'></div>
              ) : (
                <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
                  <div className='lg:col-span-8 space-y-6'>
                    <div className='bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100'>
                      <h2 className='text-lg font-bold text-gray-900 mb-5'>Sertifikasi Aktif</h2>
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        {CERTIFICATIONS.map((cert) => (
                          <div key={cert.name} className='flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-[#1a6b8a]/30 hover:bg-blue-50/30 transition-all duration-200'>
                            <div className='w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0'><CertIcon icon={cert.icon} /></div>
                            <div className='flex-1 min-w-0'>
                              <p className='font-semibold text-gray-900 text-sm'>{cert.name}</p>
                              <p className='text-xs text-gray-400 mt-0.5'>{cert.issuer}</p>
                              <p className='text-xs text-gray-400'>Berlaku hingga: {cert.validUntil}</p>
                            </div>
                            <span className='shrink-0 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full'>✅ Aktif</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className='bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100'>
                      <h2 className='text-lg font-bold text-gray-900 mb-5'>Dokumen Pendukung</h2>
                      <div className='space-y-3'>
                        {DOCUMENTS.map((doc) => (
                          <div key={doc.name} className='flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors duration-150'>
                            <div className='flex items-center gap-3'>
                              <div className='w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center'><FileCheck size={16} className='text-red-500' /></div>
                              <div><p className='text-sm font-semibold text-gray-900'>{doc.name}</p><p className='text-xs text-gray-400'>{doc.size}</p></div>
                            </div>
                            <button className='flex items-center gap-1.5 text-[#1a6b8a] hover:text-[#0e4d6e] text-xs font-semibold transition-colors duration-150'><Download size={14} /> Unduh</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className='lg:col-span-4'>
                    <div className='bg-gradient-to-br from-[#1a6b8a]/10 to-[#0e4d6e]/5 rounded-2xl p-6 border border-[#1a6b8a]/20'>
                      <div className='w-12 h-12 rounded-2xl bg-[#1a6b8a] flex items-center justify-center mb-4'><Shield size={22} className='text-white' /></div>
                      <h3 className='font-bold text-gray-900 mb-2'>Kepatuhan Terverifikasi</h3>
                      <p className='text-sm text-gray-500 leading-relaxed mb-4'>Semua dokumen telah diverifikasi oleh tim Agrou. Importir ini memenuhi standar kepatuhan internasional.</p>
                      <div className='flex items-center gap-2 text-emerald-700 text-sm font-semibold'><CheckCircle2 size={16} /> 4 Sertifikasi Aktif</div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
