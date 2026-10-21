param(
    [int]$Port = 3000,
    [string]$Root = $PSScriptRoot
)

if ([string]::IsNullOrWhiteSpace($Root)) {
    $Root = (Get-Location).Path
}

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Prefixes.Add("http://127.0.0.1:$Port/")

try {
    $listener.Start()
} catch {
    Write-Error "Não foi possível iniciar o servidor na porta $Port : $_"
    exit 1
}

Write-Output "Servidor HTTP local iniciado com sucesso!"
Write-Output "Acesse: http://localhost:$Port/"
Write-Output "Pressione Ctrl+C para encerrar."

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".webp" = "image/webp"
    ".ico"  = "image/x-icon"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
    ".ttf"  = "font/ttf"
}

$rootFullPath = [System.IO.Path]::GetFullPath($Root)

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        try {
            $request = $context.Request
            $response = $context.Response

            $urlPath = [System.Uri]::UnescapeDataString($request.Url.LocalPath)
            if ($urlPath -eq "/" -or [string]::IsNullOrWhiteSpace($urlPath)) {
                $pagesIndex = [System.IO.Path]::Combine($rootFullPath, "pages", "index.html")
                if ([System.IO.File]::Exists($pagesIndex)) {
                    $urlPath = "/pages/index.html"
                } else {
                    $urlPath = "/index.html"
                }
            }

            $cleanRelPath = $urlPath.TrimStart("/\").Replace("/", [System.IO.Path]::DirectorySeparatorChar)
            $filePath = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($rootFullPath, $cleanRelPath))

            if (-not $filePath.StartsWith($rootFullPath, [System.StringComparison]::OrdinalIgnoreCase)) {
                $response.StatusCode = 403
                $response.Close()
                continue
            }

            # Fallback inteligente: se o arquivo não estiver na raiz, procura em pages/, img/, css/, js/
            if (-not [System.IO.File]::Exists($filePath)) {
                $fallbackFolders = @("pages", "img", "css", "js")
                foreach ($folder in $fallbackFolders) {
                    $candidate = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($rootFullPath, $folder, $cleanRelPath))
                    if ([System.IO.File]::Exists($candidate) -and $candidate.StartsWith($rootFullPath, [System.StringComparison]::OrdinalIgnoreCase)) {
                        $filePath = $candidate
                        break
                    }
                }
            }

            if ([System.IO.File]::Exists($filePath)) {
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }

                $response.ContentType = $mime
                $response.AddHeader("Access-Control-Allow-Origin", "*")
                
                $fileBytes = [System.IO.File]::ReadAllBytes($filePath)
                $response.ContentLength64 = $fileBytes.Length
                $response.StatusCode = 200

                if ($request.HttpMethod -ne "HEAD") {
                    $response.OutputStream.Write($fileBytes, 0, $fileBytes.Length)
                }
            } else {
                $response.StatusCode = 404
                $msg = [System.Text.Encoding]::UTF8.GetBytes("<h1>404 - Arquivo n&#227;o encontrado</h1>")
                $response.ContentType = "text/html; charset=utf-8"
                $response.ContentLength64 = $msg.Length
                if ($request.HttpMethod -ne "HEAD") {
                    $response.OutputStream.Write($msg, 0, $msg.Length)
                }
            }

            $response.Close()
        } catch {
            Write-Warning "Erro ao processar requisição: $_"
            try { $context.Response.Close() } catch {}
        }
    }
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
    $listener.Close()
}
