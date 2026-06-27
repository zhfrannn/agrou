$dir = "D:\PWSZ\LOMBA\UTU 12th Awards\Agrou\agrou\src\components"

# BrandPage: min-h-[30px]=min-h-7.5, min-h-[82px]=min-h-20.5, min-h-[24px]=min-h-6
$f = Join-Path $dir "BrandPage.tsx"
$c = Get-Content $f -Raw -Encoding UTF8
$c = $c.Replace('min-h-[30px]', 'min-h-7.5')
$c = $c.Replace('min-h-[82px]', 'min-h-20.5')
$c = $c.Replace('min-h-[24px]', 'min-h-6')
Set-Content $f $c -Encoding UTF8 -NoNewline
Write-Host "Fixed BrandPage.tsx"

# KoperasiPage: top-[106px]=top-26.5
$f = Join-Path $dir "KoperasiPage.tsx"
$c = Get-Content $f -Raw -Encoding UTF8
$c = $c.Replace('top-[106px]', 'top-26.5')
Set-Content $f $c -Encoding UTF8 -NoNewline
Write-Host "Fixed KoperasiPage.tsx"

Write-Host "Done."
