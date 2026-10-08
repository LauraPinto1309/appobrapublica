<#Requires -Version 5.1
<#
  Sube ObraGest a GitHub en un clic.
  Uso: clic derecho > Ejecutar con PowerShell, o:
    .\subir_a_github.ps1 -RepoUrl "https://github.com/TU-USUARIO/obragest.git"
  Si no pasas -RepoUrl, te la pide por pantalla.
#>
param([string]$RepoUrl = "")

$ErrorActionPreference = "Stop"
Set-Location -LiteralPath $PSScriptRoot

function Say($m) { Write-Host $m -ForegroundColor Cyan }
function Ok($m)  { Write-Host "OK: $m" -ForegroundColor Green }
function Fail($m){ Write-Host "ERROR: $m" -ForegroundColor Red; Read-Host "Pulsa ENTER para salir"; exit 1 }

# 1. Verificar git
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Say "Git no esta instalado. Intentando instalar con winget..."
  try {
    winget install --id Git.Git -e --source winget --accept-package-agreements --accept-source-agreements
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
      Fail "Git se instalo pero no esta en el PATH. Cierra y reabre la terminal y vuelve a ejecutar este script. O instalalo desde https://git-scm.com/download/win"
    }
  } catch {
    Fail "No se pudo instalar git automaticamente. Instalalo desde https://git-scm.com/download/win y reintenta."
  }
}
Ok ("git " + (git --version))

# 2. Pedir URL del repo si falta
if ([string]::IsNullOrWhiteSpace($RepoUrl)) {
  Write-Host ""
  Write-Host "Crea antes el repositorio vacio en https://github.com/new (sin README, sin .gitignore)." -ForegroundColor Yellow
  $RepoUrl = Read-Host "Pega la URL del repo (ej. https://github.com/TU-USUARIO/obragest.git)"
}
if ([string]::IsNullOrWhiteSpace($RepoUrl)) { Fail "URL vacia. Operacion cancelada." }
$RepoUrl = $RepoUrl.Trim()

# 3. Inicializar repo local si hace falta
if (-not (Test-Path ".git")) { git init; Ok "repo local iniciado" } else { Say "Ya existe .git, se reutiliza." }

# 4. Archivos basicos
git add -A
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
  Say "No hay cambios que confirmar (todo ya publicado)."
} else {
  git commit -m "ObraGest: app gestion obra publica (proyectos, subproyectos, Kanban, Gantt, avances)"
  Ok "commit creado"
}

git branch -M main

# 5. Remoto origin (crea o actualiza)
$existing = ""
try { $existing = (git remote get-url origin 2>$null) } catch { $existing = "" }
if ([string]::IsNullOrWhiteSpace($existing)) { git remote add origin $RepoUrl }
elseif ($existing -ne $RepoUrl) { git remote set-url origin $RepoUrl }
Ok "origin -> $RepoUrl"

# 6. Push
Say "Subiendo a GitHub (se abrira login la primera vez)..."
git push -u origin main
Ok "Subido. Activa Pages: GitHub > Settings > Pages > Deploy from a branch > main / (root)."
Write-Host ""
Write-Host "Tu app estara en: https://TU-USUARIO.github.io/TU-REPO/ (tarda 1-2 min)" -ForegroundColor Yellow
Read-Host "Pulsa ENTER para cerrar"
