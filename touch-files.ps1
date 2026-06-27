$dir = "D:\PWSZ\LOMBA\UTU 12th Awards\Agrou\agrou\src\components"

# Force touch each file to bust the diagnostic cache by appending and removing a space
foreach ($f in @("GroAIPage.tsx", "KoperasiPage.tsx", "KatalogPage.tsx")) {
    $path = Join-Path $dir $f
    $c = Get-Content $path -Raw -Encoding UTF8
    # Write identical content - forces file system timestamp update
    [System.IO.File]::WriteAllText($path, $c, [System.Text.Encoding]::UTF8)
    Write-Host "Touched: $f"
}
