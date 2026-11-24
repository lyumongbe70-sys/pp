@echo off
chcp 65001 > nul
title GitHub Portfolio Push
echo ========================================================
echo   김평 포트폴리오를 GitHub (lyumongbe70-sys/pp)로 업로드합니다
echo ========================================================
echo.
cd /d "c:\vibe_coding\pp"

echo [1/2] Git 상태를 확인합니다...
git status

echo.
echo [2/2] GitHub로 업로드를 시작합니다...
echo ※ 만약 로그인 팝업 창이 뜨면 [Sign in with your browser]를 클릭해주세요.
echo.
git push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo   ★ 업로드 성공!
    echo   Vercel (https://pp-ashy-two.vercel.app/)에 자동 배포됩니다!
    echo ========================================================
) else (
    echo ========================================================
    echo   업로드 중 오류가 발생했습니다. 안내 메시지를 확인해주세요.
    echo ========================================================
)
echo.
pause
