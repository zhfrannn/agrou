$dir = "D:\PWSZ\LOMBA\UTU 12th Awards\Agrou\agrou\src\components"

function Fix-Px {
    param([string]$file)
    $path = Join-Path $dir $file
    $c = Get-Content $path -Raw -Encoding UTF8

    # Map of exact literal replacements: [Xpx] -> Tailwind v4 equivalent
    $map = [ordered]@{
        # sizes in multiples of 4px (1 unit = 4px)
        'w-[80px]'        = 'w-20'
        'h-[80px]'        = 'h-20'
        'min-w-[42px]'    = 'min-w-10.5'
        'w-[180px]'       = 'w-45'
        'h-[120px]'       = 'h-30'
        'h-[2px]'         = 'h-0.5'
        'h-[3px]'         = 'h-0.75'
        'right-[-5px]'    = '-right-1.25'
        '-bottom-[11px]'  = '-bottom-2.75'
        'max-w-[1440px]'  = 'max-w-360'
        'top-[52px]'      = 'top-13'
        'min-h-[320px]'   = 'min-h-80'
        'max-w-[340px]'   = 'max-w-85'
        'min-h-[352px]'   = 'min-h-88'
        'min-h-[340px]'   = 'min-h-85'
        'min-h-[164px]'   = 'min-h-41'
        'min-h-[160px]'   = 'min-h-40'
        'min-h-[140px]'   = 'min-h-35'
        'min-h-[220px]'   = 'min-h-55'
        'max-h-[240px]'   = 'max-h-60'
        'h-[140px]'       = 'h-35'
        'h-[23px]'        = 'h-5.75'
        'w-[480px]'       = 'w-120'
        'w-[34px]'        = 'w-8.5'
        'h-[34px]'        = 'h-8.5'
        'w-[280px]'       = 'w-70'
        'min-h-[80px]'    = 'min-h-20'
        'min-h-[100px]'   = 'min-h-25'
        'h-[33px]'        = 'h-8.25'
        'w-[360px]'       = 'w-90'
        'max-h-[400px]'   = 'max-h-100'
        'h-[100vh]'       = 'h-screen'
        'w-[380px]'       = 'w-95'
        'min-w-[20px]'    = 'min-w-5'
        'max-w-[480px]'   = 'max-w-120'
        'max-w-[440px]'   = 'max-w-110'
        'rounded-[16px]'  = 'rounded-2xl'
        'h-[66px]'        = 'h-16.5'
        'lg:w-[220px]'    = 'lg:w-55'
        'xl:w-[250px]'    = 'xl:w-62.5'
        'top-[70px]'      = 'top-17.5'
    }

    foreach ($entry in $map.GetEnumerator()) {
        $c = $c.Replace($entry.Key, $entry.Value)
    }

    Set-Content $path $c -Encoding UTF8 -NoNewline
    Write-Host "Done: $file"
}

Fix-Px "TaniPage.tsx"
Fix-Px "BrandPage.tsx"
Fix-Px "KoperasiPage.tsx"
Fix-Px "Header.tsx"
Fix-Px "GroAIPage.tsx"
Fix-Px "KatalogPage.tsx"

Write-Host "All px replacements complete."
