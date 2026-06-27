$dir = "D:\PWSZ\LOMBA\UTU 12th Awards\Agrou\agrou\src\components"

# Check if old patterns still exist
$files = @("GroAIPage.tsx", "BrandPage.tsx", "KoperasiPage.tsx", "TaniPage.tsx", "KatalogPage.tsx")
foreach ($f in $files) {
    $path = Join-Path $dir $f
    $content = Get-Content $path -Raw
    $oldCount = ([regex]::Matches($content, 'bg-\[var\(')).Count
    $newCount = ([regex]::Matches($content, 'bg-\(--color-')).Count
    Write-Host "$f : old_pattern=$oldCount  new_pattern=$newCount"
}
