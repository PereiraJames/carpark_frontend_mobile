@echo off
setlocal

cd /d "%~dp0"

set BUILD_TYPE=%1
if "%BUILD_TYPE%"=="" set BUILD_TYPE=debug

set ABI=%2
set GRADLE_ABI_ARG=
if not "%ABI%"=="" set GRADLE_ABI_ARG=-PreactNativeArchitectures=%ABI%

if not exist android (
    echo === Generating native android project via expo prebuild ===
    call npx expo prebuild --platform android --non-interactive
    if errorlevel 1 (
        echo Prebuild failed.
        exit /b 1
    )
)

echo === Building %BUILD_TYPE% APK ===

rem Force the JS bundle to be regenerated so .env changes always take effect.
rem Gradle's bundle task doesn't track .env as an input, so it can otherwise
rem stay cached and skip re-bundling even after env values change.
if /i "%BUILD_TYPE%"=="debug" (
    set BUILD_TYPE_CAP=Debug
) else (
    set BUILD_TYPE_CAP=Release
)
set BUNDLE_CACHE_DIR_1=android\app\build\generated\assets\createBundle%BUILD_TYPE_CAP%JsAndAssets
set BUNDLE_CACHE_DIR_2=android\app\build\intermediates\assets\%BUILD_TYPE%\merge%BUILD_TYPE_CAP%Assets
if exist "%BUNDLE_CACHE_DIR_1%" rmdir /s /q "%BUNDLE_CACHE_DIR_1%"
if exist "%BUNDLE_CACHE_DIR_2%" rmdir /s /q "%BUNDLE_CACHE_DIR_2%"

cd android

if /i "%BUILD_TYPE%"=="debug" (
    call .\gradlew.bat assembleDebug %GRADLE_ABI_ARG% --no-daemon
) else (
    call .\gradlew.bat assembleRelease %GRADLE_ABI_ARG% --no-daemon
)

if errorlevel 1 (
    echo Gradle build failed.
    cd ..
    exit /b 1
)

cd ..

set APK_SRC=android\app\build\outputs\apk\%BUILD_TYPE%\app-%BUILD_TYPE%.apk
set APK_DEST_DIR=apk-build\%BUILD_TYPE%

if not exist "%APK_DEST_DIR%" mkdir "%APK_DEST_DIR%"
copy /y "%APK_SRC%" "%APK_DEST_DIR%\app-%BUILD_TYPE%.apk" >nul

echo.
echo Build succeeded:
echo   %APK_SRC%
echo Copied to:
echo   %APK_DEST_DIR%\app-%BUILD_TYPE%.apk

endlocal
