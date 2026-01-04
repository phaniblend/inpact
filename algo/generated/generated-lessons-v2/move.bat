@echo off
setlocal enabledelayedexpansion

REM ===== CONFIG =====
set REPORT=lesson_text_fix_report.txt

mkdir GOOD_AS_IS 2>nul
mkdir NEEDS_AI_FIX 2>nul
mkdir FIXED_BY_AI 2>nul

REM ===== PASS 1: lessons that NEED AI FIX (FIX attempted) =====
for /f "tokens=2 delims= " %%A in ('findstr /R /C:"^\[FIX\] lesson-" %REPORT%') do (
    if exist %%A (
        move %%A NEEDS_AI_FIX\
    )
)

REM ===== PASS 2: lessons that were SKIPPED and not already moved =====
for /f "tokens=2 delims= " %%A in ('findstr /R /C:"^\[SKIP\] lesson-" %REPORT%') do (
    if exist %%A (
        move %%A GOOD_AS_IS\
    )
)

echo.
echo ===============================
echo Lesson organization complete.
echo GOOD_AS_IS      -> stable lessons
echo NEEDS_AI_FIX    -> flagged but AI failed
echo FIXED_BY_AI     -> (currently empty)
echo ===============================
echo.

pause
