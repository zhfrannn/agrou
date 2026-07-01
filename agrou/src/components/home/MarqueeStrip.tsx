export default function MarqueeStrip() {
  const items = [
    "Verified Protected Farm",
    "Diagnosis Lahan AI",
    "2.400+ Koperasi Aktif",
    "Bundle Proteksi Hemat",
    "Pengiriman ke Seluruh Indonesia",
    "Revenue Split Otomatis",
    "47 Komoditas Tersedia",
    "Rating 4.8/5"
  ];

  const doubleItems = [...items, ...items];

  return (
    <div className="max-w-[1440px] mx-auto px-8 mt-0 mb-1 z-20">
      <div 
        className="w-full h-[44px] py-1 relative overflow-hidden flex items-center"
        style={{
          backgroundColor: "var(--color-lime)",
          borderRadius: "var(--radius-pill)",
          maskImage: "linear-gradient(to right, transparent, white 80px, white calc(100% - 80px), transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, white 80px, white calc(100% - 80px), transparent)"
        }}
      >
        <style>{`
          @keyframes marquee-scroll {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-marquee-scroll {
            display: flex;
            width: max-content;
            animation: marquee-scroll 30s linear infinite;
          }
        `}</style>

        {/* Scrolling Content */}
        <div className="animate-marquee-scroll flex items-center gap-0">
          {doubleItems.map((item, idx) => (
            <div 
              key={idx} 
              className="flex items-center shrink-0"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: "11px",
                textTransform: "uppercase" as const,
                letterSpacing: "0.06em",
                color: "var(--color-forest-dark)",
              }}
            >
              <span className="px-4">{item}</span>
              <span style={{ opacity: 0.5 }}>✦</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
