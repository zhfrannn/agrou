$dir = "D:\PWSZ\LOMBA\UTU 12th Awards\Agrou\agrou\src\components"
$files = @("TaniPage.tsx", "BrandPage.tsx", "KoperasiPage.tsx", "Header.tsx", "GroAIPage.tsx", "KatalogPage.tsx")

foreach ($f in $files) {
    $path = Join-Path $dir $f
    $content = Get-Content $path -Raw -Encoding UTF8
    # Verify no old patterns remain
    $oldVar    = ([regex]::Matches($content, '\[var\(--color-')).Count
    $oldGrad   = ([regex]::Matches($content, 'bg-gradient-to-')).Count
    $oldZ      = ([regex]::Matches($content, 'z-\[\d+\]')).Count
    $oldStroke = ([regex]::Matches($content, 'stroke-\[2\]')).Count
    $oldShadow = ([regex]::Matches($content, 'shadow-black/\[0\.10\]')).Count
    $oldRight  = ([regex]::Matches($content, 'right-\[-5px\]')).Count
    # Specific px warnings from diagnostics
    $old1440   = ([regex]::Matches($content, 'max-w-\[1440px\]')).Count
    $old52     = ([regex]::Matches($content, 'top-\[52px\]')).Count
    $old70     = ([regex]::Matches($content, 'top-\[70px\]')).Count
    $old220    = ([regex]::Matches($content, 'lg:w-\[220px\]')).Count
    $old250    = ([regex]::Matches($content, 'xl:w-\[250px\]')).Count
    $old340    = ([regex]::Matches($content, 'max-w-\[340px\]')).Count
    $old352    = ([regex]::Matches($content, 'min-h-\[352px\]')).Count
    $old320    = ([regex]::Matches($content, 'min-h-\[320px\]')).Count
    $old280    = ([regex]::Matches($content, 'max-w-\[280px\]')).Count
    $old106    = ([regex]::Matches($content, 'top-\[106px\]')).Count
    $old30     = ([regex]::Matches($content, 'min-h-\[30px\]')).Count
    $old82     = ([regex]::Matches($content, 'min-h-\[82px\]')).Count
    $old24     = ([regex]::Matches($content, 'min-h-\[24px\]')).Count
    $old220b   = ([regex]::Matches($content, 'min-h-\[220px\]')).Count

    Write-Host ""
    Write-Host "=== $f ==="
    Write-Host "  [var(  : $oldVar   bg-gradient: $oldGrad   z-[N]: $oldZ   stroke-[2]: $oldStroke"
    Write-Host "  shadow-black/[0.10]: $oldShadow   right-[-5px]: $oldRight"
    Write-Host "  max-w-[1440px]: $old1440   top-[52px]: $old52   top-[70px]: $old70"
    Write-Host "  lg:w-[220px]: $old220   xl:w-[250px]: $old250"
    Write-Host "  max-w-[340px]: $old340   min-h-[352px]: $old352   min-h-[320px]: $old320"
    Write-Host "  max-w-[280px]: $old280   top-[106px]: $old106"
    Write-Host "  min-h-[30px]: $old30   min-h-[82px]: $old82   min-h-[24px]: $old24   min-h-[220px]: $old220b"
}
