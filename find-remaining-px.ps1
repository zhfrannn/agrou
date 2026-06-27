$dir = "D:\PWSZ\LOMBA\UTU 12th Awards\Agrou\agrou\src\components"
$files = @("GroAIPage.tsx", "BrandPage.tsx", "KoperasiPage.tsx", "TaniPage.tsx", "KatalogPage.tsx", "Header.tsx")

foreach ($f in $files) {
    $path = Join-Path $dir $f
    $lines = Get-Content $path
    Write-Host "=== $f ==="
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match '\[\d+px\]') {
            Write-Host "  L$($i+1): $($lines[$i].Trim())"
        }
    }
}
