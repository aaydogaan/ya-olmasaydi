Add-Type -AssemblyName System.Drawing

$srcFile = Join-Path $PSScriptRoot "..\public\images\favicon.png"
$publicDir = Join-Path $PSScriptRoot "..\public"

$sizes = @(16, 32, 48, 96, 180, 192)
foreach ($s in $sizes) {
    $src = [System.Drawing.Image]::FromFile($srcFile)
    $dest = New-Object System.Drawing.Bitmap($s, $s)
    $dest.SetResolution($src.HorizontalResolution, $src.VerticalResolution)
    $g = [System.Drawing.Graphics]::FromImage($dest)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.DrawImage($src, 0, 0, $s, $s)
    $g.Dispose()
    $src.Dispose()

    if ($s -eq 180) {
        $outFile = Join-Path $publicDir "apple-touch-icon.png"
    } else {
        $outFile = Join-Path $publicDir "favicon-$($s)x$($s).png"
    }
    $dest.Save($outFile, [System.Drawing.Imaging.ImageFormat]::Png)
    Write-Host "Created: $outFile"
    $dest.Dispose()
}

# Duplicate 192x192 to favicon.png and images/favicon.png
Copy-Item (Join-Path $publicDir "favicon-192x192.png") (Join-Path $publicDir "favicon.png") -Force
Copy-Item (Join-Path $publicDir "favicon-192x192.png") (Join-Path $publicDir "images\favicon.png") -Force
Write-Host "Updated favicon.png and images\favicon.png"
