# ClaudeReqSys 技能链接脚本 (Windows PowerShell)
# 将 skills/ 目录中的技能链接到 .claude/skills/

$ErrorActionPreference = "Stop"

$Repo = Split-Path -Parent $PSScriptRoot
$Dest = Join-Path $Repo ".claude\skills"

Write-Host "🔗 ClaudeReqSys 技能链接" -ForegroundColor Cyan
Write-Host "源目录: $Repo\skills"
Write-Host "目标目录: $Dest"
Write-Host ""

# 创建目标目录
if (-not (Test-Path $Dest)) {
    New-Item -ItemType Directory -Path $Dest -Force | Out-Null
}

# 查找所有技能文件
$SkillDirs = Get-ChildItem -Path "$Repo\skills" -Directory -Exclude "README"

foreach ($SkillDir in $SkillDirs) {
    $Name = $SkillDir.Name
    $Target = Join-Path $Dest $Name

    # 如果目标存在且不是符号链接，先删除
    if (Test-Path $Target) {
        $Item = Get-Item $Target
        if ($Item.LinkType -ne "SymbolicLink") {
            Write-Host "⚠️  删除现有目录: $Name" -ForegroundColor Yellow
            Remove-Item -Path $Target -Recurse -Force
        }
    }

    # 创建符号链接（需要管理员权限）
    try {
        New-Item -ItemType SymbolicLink -Path $Target -Target $SkillDir.FullName -Force | Out-Null
        Write-Host "✓ $name → $($SkillDir.FullName)" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  创建符号链接失败: $Name" -ForegroundColor Yellow
        Write-Host "  提示: Windows 需要管理员权限创建符号链接" -ForegroundColor Gray
        Write-Host "  或以管理员身份运行 PowerShell" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "✅ 链接完成!" -ForegroundColor Green
Write-Host "技能已安装到: $Dest"
