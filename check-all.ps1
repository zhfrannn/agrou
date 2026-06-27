$dir = "D:\PWSZ\LOMBA\UTU 12th Awards\Agrou\agrou\src\components"

# Check all remaining old-style patterns across all 6 files
$files = @("GroAIPage.tsx", "BrandPage.tsx", "KoperasiPage.tsx", "TaniPage.tsx", "KatalogPage.tsx", "Header.tsx")
foreach ($f in $files) {
    $path = Join-Path $dir $f
    $content = Get-Content $path -Raw

    $varOld     = ([regex]::Matches($content, '\[var\(--color-')).Count
    $gradOld    = ([regex]::Matches($content, 'bg-gradient-to-')).Count
    $pxOld      = ([regex]::Matches($content, '\[\d+px\]')).Count
    $zOld       = ([regex]::Matches($content, 'z-\[\d+\]')).Count
    $strokeOld  = ([regex]::Matches($content, 'stroke-\[2\]')).Count
    $shadowOld  = ([regex]::Matches($content, 'shadow-black/\[0\.10\]')).Count
    $rightOld   = ([regex]::Matches($content, 'right-\[-5px\]')).Count
    $botOld     = ([regex]::Matches($content, '-bottom-\[\d+px\]')).Count

    Write-Host "$f : var=$varOld grad=$gradOld px=$pxOld z=$zOld stroke=$strokeOld shadow=$shadowOld right=$rightOld bot=$botOld"
}
