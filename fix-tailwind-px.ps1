$dir = "D:\PWSZ\LOMBA\UTU 12th Awards\Agrou\agrou\src\components"

function ReplaceAll {
    param([string]$content, [string]$from, [string]$to)
    return $content.Replace($from, $to)
}

# ── TaniPage.tsx ─────────────────────────────────────────────────────────────
$file = Join-Path $dir "TaniPage.tsx"
$c = Get-Content $file -Raw -Encoding UTF8
$c = ReplaceAll $c 'w-[80px]'     'w-20'
$c = ReplaceAll $c 'h-[80px]'     'h-20'
$c = ReplaceAll $c 'min-w-[42px]' 'min-w-10.5'
$c = ReplaceAll $c 'w-[180px]'    'w-45'
$c = ReplaceAll $c 'h-[120px]'    'h-30'
$c = ReplaceAll $c 'max-w-[1440px]' 'max-w-360'
$c = ReplaceAll $c 'h-[2px]'      'h-0.5'
$c = ReplaceAll $c 'right-[-5px]' '-right-1.25'
Set-Content $file $c -Encoding UTF8 -NoNewline
Write-Host "PX fixed: TaniPage.tsx"

# ── BrandPage.tsx ─────────────────────────────────────────────────────────────
$file = Join-Path $dir "BrandPage.tsx"
$c = Get-Content $file -Raw -Encoding UTF8
$c = ReplaceAll $c 'top-[52px]'     'top-13'
$c = ReplaceAll $c 'max-w-[1440px]' 'max-w-360'
$c = ReplaceAll $c 'min-h-[320px]'  'min-h-80'
$c = ReplaceAll $c 'max-w-[340px]'  'max-w-85'
$c = ReplaceAll $c 'min-h-[352px]'  'min-h-88'
$c = ReplaceAll $c 'right-[-5px]'   '-right-1.25'
Set-Content $file $c -Encoding UTF8 -NoNewline
Write-Host "PX fixed: BrandPage.tsx"

# ── KoperasiPage.tsx ──────────────────────────────────────────────────────────
$file = Join-Path $dir "KoperasiPage.tsx"
$c = Get-Content $file -Raw -Encoding UTF8
$c = ReplaceAll $c 'max-w-[1440px]' 'max-w-360'
Set-Content $file $c -Encoding UTF8 -NoNewline
Write-Host "PX fixed: KoperasiPage.tsx"

# ── KatalogPage.tsx ───────────────────────────────────────────────────────────
$file = Join-Path $dir "KatalogPage.tsx"
$c = Get-Content $file -Raw -Encoding UTF8
$c = ReplaceAll $c 'max-w-[1440px]' 'max-w-360'
$c = ReplaceAll $c 'lg:w-[220px]'   'lg:w-55'
$c = ReplaceAll $c 'xl:w-[250px]'   'xl:w-62.5'
$c = ReplaceAll $c 'top-[70px]'     'top-17.5'
Set-Content $file $c -Encoding UTF8 -NoNewline
Write-Host "PX fixed: KatalogPage.tsx"

# ── GroAIPage.tsx ─────────────────────────────────────────────────────────────
$file = Join-Path $dir "GroAIPage.tsx"
$c = Get-Content $file -Raw -Encoding UTF8
$c = ReplaceAll $c 'max-w-[1440px]' 'max-w-360'
Set-Content $file $c -Encoding UTF8 -NoNewline
Write-Host "PX fixed: GroAIPage.tsx"

# ── Header.tsx ────────────────────────────────────────────────────────────────
$file = Join-Path $dir "Header.tsx"
$c = Get-Content $file -Raw -Encoding UTF8

# z-index literals
$c = ReplaceAll $c 'z-[60]'  'z-60'
$c = ReplaceAll $c 'z-[70]'  'z-70'
$c = ReplaceAll $c 'z-[80]'  'z-80'
$c = ReplaceAll $c 'z-[90]'  'z-90'
$c = ReplaceAll $c 'z-[100]' 'z-100'
$c = ReplaceAll $c 'z-[110]' 'z-110'

# shadow opacity
$c = ReplaceAll $c 'shadow-black/[0.10]' 'shadow-black/10'

# stroke
$c = ReplaceAll $c 'stroke-[2]' 'stroke-2'

# px sizes
$c = ReplaceAll $c 'h-[23px]'    'h-5.75'
$c = ReplaceAll $c 'w-[480px]'   'w-120'
$c = ReplaceAll $c 'w-[34px]'    'w-8.5'
$c = ReplaceAll $c 'h-[34px]'    'h-8.5'
$c = ReplaceAll $c 'w-[280px]'   'w-70'
$c = ReplaceAll $c 'min-h-[80px]'  'min-h-20'
$c = ReplaceAll $c 'max-w-[1440px]' 'max-w-360'
$c = ReplaceAll $c 'h-[33px]'    'h-8.25'
$c = ReplaceAll $c 'min-h-[100px]' 'min-h-25'
$c = ReplaceAll $c 'w-[360px]'   'w-90'
$c = ReplaceAll $c 'max-h-[400px]' 'max-h-100'
$c = ReplaceAll $c 'h-[100vh]'   'h-screen'
$c = ReplaceAll $c 'w-[380px]'   'w-95'
$c = ReplaceAll $c 'min-w-[20px]' 'min-w-5'
$c = ReplaceAll $c 'max-w-[480px]' 'max-w-120'
$c = ReplaceAll $c 'max-w-[440px]' 'max-w-110'
$c = ReplaceAll $c 'rounded-[16px]' 'rounded-2xl'
$c = ReplaceAll $c 'w-[280px]'   'w-70'
$c = ReplaceAll $c 'h-[66px]'    'h-16.5'

Set-Content $file $c -Encoding UTF8 -NoNewline
Write-Host "PX fixed: Header.tsx"

Write-Host "Done with all px/unit replacements."
