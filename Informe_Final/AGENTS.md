# AGENTS.md

## Compilación

- **Entrada:** `main.tex`
- **Salida:** `Informe.pdf`
- **Compilar:** `make.bat` (Windows) — ejecuta `latexmk -pdf -quiet -jobname=Informe main.tex`
- **Limpiar:** `make.bat clean` — elimina archivos auxiliares y el PDF
- **Purga:** `make.bat purge` — limpieza profunda via `latexmk -C`
- **Requisitos:** Distribución de LaTeX con `latexmk`, `biber` y los paquetes listados en `formato.sty`
- **Bibliografía:** Usa `biber` (estilo APA). Agrega `bibliografia.bib` en la raíz para activarla; el paquete la detecta automáticamente con `\IfFileExists`.

## Estructura

| Ruta | Propósito |
|---|---|
| `main.tex` | Punto de entrada del documento; configuración (`\documenttitle`, `\subject`, `\advisor`, `\semester`, `\addauthor`) |
| `portada.tex` | Portada |
| `formato.sty` | Paquete LaTeX personalizado — formato, paquetes, colores, estilos TikZ, configuración de bibliografía |
| `sections/` | Archivos de secciones: `01-Introduccion`, `02-MarcoTeorico`, `03-Desarrollo`, `Conclusiones` |
| `images/` | Logos (`Logo-UNSAAC.png`, `Logo-Informatica.png`) y capturas de pantalla de la interfaz usadas en `03-Desarrollo.tex` |
| `make.bat` | Automatización de compilación |

## Convenciones

- Las secciones se incluyen con `\input` desde `sections/` — agrega nuevas en `main.tex` entre `\startmain` y `\printreferences`
- Páginas preliminares (índice, resumen) usan numeración romana via `\startpreliminary`; el contenido principal usa arábiga via `\startmain`
- Estilo APA: cuerpo a doble espacio, sangría de párrafo de 1.27 cm, `\doublespacing`
- Bibliografía via `\printreferences[Título]` (usa `biblatex` con `biber`)
- Atajos de citación personalizados: `\citepage{clave}{p}`, `\citepages{clave}{pp}`, `\textualcite{clave}`, `\textualcitepage{clave}{p}`
- Figuras via `\apafigure[ubicación]{contenido}{leyenda}{etiqueta}`, tablas via `\apatable[ubicación]{contenido}{leyenda}{etiqueta}`
- Estilos TikZ predefinidos: `bloque`, `decision`, `flecha`
- Encabezados con logos e información del curso desde las variables de configuración del documento
