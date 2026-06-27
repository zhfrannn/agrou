$dir = "D:\PWSZ\LOMBA\UTU 12th Awards\Agrou\agrou\src\components"

function Fix-TailwindFile {
    param([string]$file)
    $content = Get-Content $file -Raw -Encoding UTF8

    # CSS var() shorthand replacements
    $patterns = @(
        @{ From = 'bg-\[var\((--color-[^)]+)\)\]';                   To = 'bg-($1)' },
        @{ From = 'text-\[var\((--color-[^)]+)\)\]';                 To = 'text-($1)' },
        @{ From = 'border-\[var\((--color-[^)]+)\)\]';               To = 'border-($1)' },
        @{ From = 'from-\[var\((--color-[^)]+)\)\]';                 To = 'from-($1)' },
        @{ From = 'to-\[var\((--color-[^)]+)\)\]';                   To = 'to-($1)' },
        @{ From = 'via-\[var\((--color-[^)]+)\)\]';                  To = 'via-($1)' },
        @{ From = 'fill-\[var\((--color-[^)]+)\)\]';                 To = 'fill-($1)' },
        @{ From = 'shadow-\[var\((--color-[^)]+)\)\]';               To = 'shadow-($1)' },
        @{ From = 'focus:ring-\[var\((--color-[^)]+)\)\]';           To = 'focus:ring-($1)' },
        @{ From = 'focus:border-\[var\((--color-[^)]+)\)\]';         To = 'focus:border-($1)' },
        @{ From = 'hover:bg-\[var\((--color-[^)]+)\)\]';             To = 'hover:bg-($1)' },
        @{ From = 'hover:text-\[var\((--color-[^)]+)\)\]';           To = 'hover:text-($1)' },
        @{ From = 'hover:border-\[var\((--color-[^)]+)\)\]';         To = 'hover:border-($1)' },
        @{ From = 'group-hover:text-\[var\((--color-[^)]+)\)\]';     To = 'group-hover:text-($1)' },
        @{ From = 'placeholder:text-\[var\((--color-[^)]+)\)\]';     To = 'placeholder:text-($1)' },
        # bg-gradient-to-X -> bg-linear-to-X
        @{ From = 'bg-gradient-to-([a-z]+)';                         To = 'bg-linear-to-$1' }
    )

    foreach ($p in $patterns) {
        $content = [regex]::Replace($content, $p.From, $p.To)
    }

    Set-Content $file $content -Encoding UTF8 -NoNewline
    Write-Host "Fixed: $file"
}

$files = @(
    "TaniPage.tsx",
    "BrandPage.tsx",
    "KoperasiPage.tsx",
    "Header.tsx",
    "GroAIPage.tsx",
    "KatalogPage.tsx"
)

foreach ($f in $files) {
    Fix-TailwindFile (Join-Path $dir $f)
}

Write-Host "Done with CSS var + gradient replacements."
