@echo off
if /I "%1"=="clean" goto clean
if /I "%1"=="purge" goto purge

latexmk -pdf -quiet -jobname=Informe main.tex >nul 2>&1
if %errorlevel% equ 0 (
    latexmk -c -quiet -jobname=Informe main.tex >nul 2>&1
    if exist "Informe.bbl" del /F "Informe.bbl" >nul
    echo listo
) else (
    echo error
)
exit /b

:clean
latexmk -c -quiet -jobname=Informe main.tex >nul 2>&1
if exist "Informe.pdf" del /F "Informe.pdf" >nul
if exist "Informe.bbl" del /F "Informe.bbl" >nul
echo listo
exit /b

:purge
latexmk -C -quiet -jobname=Informe main.tex >nul 2>&1
if exist "Informe.pdf" del /F "Informe.pdf" >nul
if exist "Informe.bbl" del /F "Informe.bbl" >nul
echo listo
exit /b
