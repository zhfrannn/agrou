Set-Location "D:\PWSZ\LOMBA\UTU 12th Awards\Agrou\agrou"

# Remove all temp part files
Remove-Item "src\components\_dash_part1.tsx" -Force -ErrorAction SilentlyContinue
Remove-Item "src\components\_dash_part2.tsx" -Force -ErrorAction SilentlyContinue
Remove-Item "src\components\_dash_part3.tsx" -Force -ErrorAction SilentlyContinue
Remove-Item "src\components\_dash_part4.tsx" -Force -ErrorAction SilentlyContinue
Remove-Item "src\components\_dash_part5.tsx" -Force -ErrorAction SilentlyContinue
Remove-Item "src\components\_dashboard_chunk1.tsx" -Force -ErrorAction SilentlyContinue
Remove-Item "src\components\_dashboard_chunk2.tsx" -Force -ErrorAction SilentlyContinue
Remove-Item "src\components\_dashboard_chunk3.tsx" -Force -ErrorAction SilentlyContinue
Remove-Item "src\components\_assemble.ps1" -Force -ErrorAction SilentlyContinue
Remove-Item "src\components\_copy.ps1" -Force -ErrorAction SilentlyContinue
Remove-Item "src\components\_tsccheck.ps1" -Force -ErrorAction SilentlyContinue
Write-Host "Cleaned up temp files"

# Run tsc
$out = & npx tsc --noEmit 2>&1
if ($out) {
    $out | ForEach-Object { Write-Host $_ }
} else {
    Write-Host "TSC: no errors"
}
