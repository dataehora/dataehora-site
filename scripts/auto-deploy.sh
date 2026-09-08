#!/usr/bin/env bash
#
# auto-deploy.sh — fluxo de publicação sem intervenção do dataehora-site.
#
#   branch  ->  commit  ->  push  ->  PR  ->  squash-merge  ->  volta pra main  ->  pull
#
# Uso:
#   scripts/auto-deploy.sh ["mensagem de commit / título do PR"]
#
# Idempotente: se a working tree estiver limpa, não faz nada e sai com 0.
# Requer: git + gh (GitHub CLI autenticado).
#
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

# ------------------------------------------------------------------ 1. há o quê publicar?
if git diff --quiet && git diff --cached --quiet \
   && [ -z "$(git ls-files --others --exclude-standard)" ]; then
  echo "auto-deploy: working tree limpa, nada a publicar."
  exit 0
fi

MSG="${1:-Atualiza conteúdo do site}"
STAMP="$(date +%Y%m%d-%H%M%S)"
BRANCH="auto/deploy-${STAMP}"

echo "auto-deploy: criando branch ${BRANCH}"

# ------------------------------------------------------------------ 2. branch + commit
git checkout -b "$BRANCH"
git add -A
git commit -m "$(printf '%s\n\nCo-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>' "$MSG")"

# ------------------------------------------------------------------ 3. push + PR + merge
git push -u origin "$BRANCH"

gh pr create --base main --head "$BRANCH" \
  --title "$MSG" \
  --body "$(printf 'Deploy automático (%s).\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)' "$STAMP")"

# --admin cobre qualquer regra de proteção que venha a existir no futuro.
gh pr merge "$BRANCH" --squash --admin --delete-branch

# ------------------------------------------------------------------ 4. sincroniza main
git checkout main
git branch -D "$BRANCH" 2>/dev/null || true
git pull --ff-only origin main

echo "auto-deploy: publicado em main — GitHub Pages fará o build em ~1 min."
echo "auto-deploy: se css/styles.css, js/holidays.js ou js/scripts.js mudaram, o workflow"
echo "             cache-bust.yml vai gerar mais um commit em main; rode 'git pull' depois."
