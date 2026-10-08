# Guía rápida: subir ObraGest a GitHub (5 min)

## Opción A — automática (recomendada)

1. Crea el repositorio vacío en https://github.com/new:
   - Nombre: `obragest` (o el que quieras)
   - **No** marques "Add a README", ni `.gitignore`, ni licencia.
   - Copia la URL que te da (ej. `https://github.com/TU-USUARIO/obragest.git`).
2. En esta carpeta, haz **doble clic en `subir_a_github.bat`**.
3. Pega la URL cuando te la pida y pulsa ENTER.
   - Si no tienes Git, el script lo instala solo con `winget`. Si falla, instálalo desde https://git-scm.com/download/win y repite.
   - La primera vez GitHub pedirá login (usuario + token o navegador).
4. Activa la web pública: en el repo → **Settings → Pages → Deploy from a branch → `main` / `/ (root)` → Save**.
   - Además ya incluye workflow `.github/workflows/pages.yml` que despliega solo.
   - Tu URL será `https://TU-USUARIO.github.io/obragest/` (tarda 1–2 min).

## Opción B — manual (si el script falla)

```powershell
cd "ruta\a\App proyectos"
git init
git add -A
git commit -m "ObraGest: app gestion obra publica"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/obragest.git
git push -u origin main
```

## Opción C — sin Git (solo con navegador)

1. En https://github.com/new crea el repo `obragest`.
2. Pulsa **"uploading an existing file"** y arrastra todos los archivos de esta carpeta (`index.html`, `app.js`, `styles.css`, `README.md`, etc.).
3. Commit directo a `main` y activa Pages como en la opción A.

## Comprobación final

- El repo debe tener `index.html` en la raíz (ya está así).
- Tras activar Pages, verifica `https://TU-USUARIO.github.io/obragest/`.
- Actualizaciones futuras: edita archivos y repite `git add -A && git commit -m "..." && git push`.
