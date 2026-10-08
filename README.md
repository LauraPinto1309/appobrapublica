# 🏗️ ObraGest — Gestión de proyectos de obra pública en equipo

Aplicación web **lista para usar y publicar en GitHub**, sin dependencias ni build.
Gestión de **proyectos de obra pública**: reparto de tareas, adjudicación de subproyectos a miembros del equipo, control de tiempos y avances.

## ✨ Funcionalidades

- **Proyectos**: expediente, administración cliente, presupuesto, fechas, estado (licitación → finalizado), responsable.
- **Subproyectos adjudicables**: asigna cada lote a un miembro, con presupuesto, prioridad y fechas.
- **Tareas Kanban**: pendiente / en curso / en revisión / bloqueada / completada, con arrastrar y soltar, prioridad, horas estimadas, fecha límite y % avance. Detección de vencidas ⚠.
- **Tiempos**: imputación de horas por tarea/miembro, parte de horas, Gantt simplificado con línea de "hoy", desviación real vs estimado, coste de mano de obra (horas × €/h).
- **Avances**: bitácora de % por proyecto / subproyecto / tarea, con autor y comentarios. Avance ponderado automático.
- **Equipo**: roles de obra (jefa de obra, encargado, topógrafa, PRL…), carga de trabajo, adjudicaciones.
- **Informes**: resumen ejecutivo imprimible (PDF), export CSV de tareas y horas, backup/restore JSON, buscador global (`/`), filtros por proyecto.

## 🚀 Ejecución local (sin instalar nada)

Opción 1 — doble clic en `index.html`.

Opción 2 — servidor estático (recomendado para evitar restricciones del navegador):

```bash
# Python
python -m http.server 8000
# o Node
npx serve .
```

Abre http://localhost:8000

Los datos se guardan en `localStorage` del navegador. Incluye datos demo realistas (reasfaltado CV-95, red de agua, reurbanización).

## 📤 Subir a GitHub + activar GitHub Pages

```bash
git init
git add .
git commit -m "ObraGest: app gestión obra pública"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/obragest.git
git push -u origin main
```

Luego en GitHub: **Settings → Pages → Deploy from a branch → `main` / `/ (root)`**.
El workflow `.github/workflows/pages.yml` también despliega automáticamente. La URL quedará como `https://TU-USUARIO.github.io/obragest/`.

## 🗂 Estructura

```
├── index.html   # SPA (vista)
├── styles.css   # Tema oscuro obra
├── app.js       # Lógica completa sin dependencias
├── README.md
├── LICENSE
├── .gitignore
└── .github/workflows/pages.yml
```

## ⌨ Atajos y trucos

- Pulsa `/` para buscar.
- Kanban: arrastra tarjetas entre columnas.
- “⏭ Avanzar estado” mueve la tarea al siguiente estado.
- Exporta `JSON` como copia de seguridad; `CSV` para Excel.
- “↺ Restablecer demo” restaura los datos de ejemplo.

## 🔒 Notas

- 100% front-end: no hay backend ni cuentas; ideal para equipos pequeños o como prototipo. Para multiusuario real, conectar a Firebase/Supabase o un API.
- Para presupuestos/certificaciones oficiales, valida los CSV exportados con tu ERP.

MIT © ObraGest.
