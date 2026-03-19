#!/usr/bin/env bash
set -euo pipefail

# ── VibeReader build script ──────────────────────────────────
# usage:
#   ./build.sh          build zip from manifest version
#   ./build.sh --check  dry run: validate + lint only, no zip
#   ./build.sh --lint   run lint checks only

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SRC_DIR="$SCRIPT_DIR"
MANIFEST="$SRC_DIR/manifest.json"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
NC='\033[0m'

pass() { echo -e "  ${GREEN}pass${NC}  $1"; }
warn() { echo -e "  ${YELLOW}warn${NC}  $1"; WARN_COUNT=$((WARN_COUNT + 1)); }
fail() { echo -e "  ${RED}FAIL${NC}  $1"; FAIL_COUNT=$((FAIL_COUNT + 1)); }

WARN_COUNT=0
FAIL_COUNT=0

# ── preflight ────────────────────────────────────────────────

if [ ! -f "$MANIFEST" ]; then
  echo -e "${RED}error:${NC} manifest.json not found at $MANIFEST"
  exit 1
fi

if command -v jq &>/dev/null; then
  VERSION=$(jq -r '.version' "$MANIFEST")
elif command -v python3 &>/dev/null; then
  VERSION=$(python3 -c "import json; print(json.load(open('$MANIFEST'))['version'])")
else
  echo -e "${RED}error:${NC} need jq or python3 to read manifest version"
  exit 1
fi

if [ -z "$VERSION" ] || [ "$VERSION" = "null" ]; then
  echo -e "${RED}error:${NC} could not read version from manifest.json"
  exit 1
fi

TAG="v${VERSION}"
ZIP_NAME="VibeReader-${TAG}.zip"
OUT_PATH="$SCRIPT_DIR/$ZIP_NAME"

echo -e "${CYAN}── VibeReader build ──${NC}"
echo "   version:  $VERSION"
echo "   tag:      $TAG"
echo "   output:   $ZIP_NAME"
echo ""

# ── 1. validate required files ───────────────────────────────

echo -e "${CYAN}── file check ──${NC}"

REQUIRED_FILES=(
  manifest.json
  background.js
  popup.html
  popup.js
  popup.css
  content.js
  options.html
  options.js
  api-utils.js
  i18n.js
  autosum.js
  autosum.css
  tab-picker.html
  tab-picker.js
)

for f in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "$SRC_DIR/$f" ]; then
    fail "$f missing"
  elif [ ! -s "$SRC_DIR/$f" ]; then
    fail "$f is empty (0 bytes)"
  else
    SIZE_B=$(wc -c < "$SRC_DIR/$f" | tr -d ' ')
    pass "$f (${SIZE_B}B)"
  fi
done

if [ ! -d "$SRC_DIR/icons" ]; then
  warn "icons/ directory not found"
else
  ICON_COUNT=$(find "$SRC_DIR/icons" -name '*.png' | wc -l | tr -d ' ')
  pass "icons/ ($ICON_COUNT png files)"
fi

echo ""

# ── 2. manifest schema check ────────────────────────────────

echo -e "${CYAN}── manifest check ──${NC}"

manifest_field() {
  if command -v jq &>/dev/null; then
    jq -r "$1" "$MANIFEST"
  else
    python3 -c "
import json, sys
d = json.load(open('$MANIFEST'))
keys = '$1'.strip('.').split('.')
v = d
for k in keys:
  if isinstance(v, dict) and k in v:
    v = v[k]
  else:
    print('null'); sys.exit()
print(v)
"
  fi
}

MV=$(manifest_field '.manifest_version')
if [ "$MV" = "3" ]; then
  pass "manifest_version: 3"
else
  fail "manifest_version should be 3, got: $MV"
fi

NAME=$(manifest_field '.name')
if [ -n "$NAME" ] && [ "$NAME" != "null" ]; then
  pass "name: $NAME"
else
  fail "name field is missing"
fi

DESC=$(manifest_field '.description')
if [ -n "$DESC" ] && [ "$DESC" != "null" ]; then
  DESC_LEN=${#DESC}
  if [ "$DESC_LEN" -gt 132 ]; then
    warn "description is ${DESC_LEN} chars (Chrome Web Store limit: 132)"
  else
    pass "description: ${DESC_LEN} chars"
  fi
else
  warn "description field is missing"
fi

SW=$(manifest_field '.background.service_worker')
if [ "$SW" = "background.js" ]; then
  pass "service_worker: background.js"
else
  fail "service_worker expected background.js, got: $SW"
fi

echo ""

# ── 3. manifest cross-reference ──────────────────────────────

echo -e "${CYAN}── cross-reference check ──${NC}"

check_file_ref() {
  local label="$1"
  local path="$2"
  if [ -f "$SRC_DIR/$path" ]; then
    pass "$label → $path"
  else
    fail "$label → $path (file not found)"
  fi
}

check_file_ref "service_worker" "background.js"
check_file_ref "side_panel" "popup.html"
check_file_ref "options_ui" "options.html"

for ICON_KEY in 16 48 128; do
  ICON_PATH=$(manifest_field ".icons.\"$ICON_KEY\"")
  if [ -n "$ICON_PATH" ] && [ "$ICON_PATH" != "null" ]; then
    check_file_ref "icon ${ICON_KEY}px" "$ICON_PATH"
  fi
done

WEB_RES=$(manifest_field '.web_accessible_resources')
if [ "$WEB_RES" != "null" ]; then
  if command -v jq &>/dev/null; then
    jq -r '.web_accessible_resources[].resources[]' "$MANIFEST" 2>/dev/null | while read -r RES; do
      check_file_ref "web_resource" "$RES"
    done
  fi
fi

echo ""

# ── 4. javascript syntax check ──────────────────────────────

echo -e "${CYAN}── javascript syntax ──${NC}"

JS_FILES=$(find "$SRC_DIR" -maxdepth 1 -name '*.js' -type f)

if command -v node &>/dev/null; then
  for JS in $JS_FILES; do
    BASENAME=$(basename "$JS")
    if node --check "$JS" 2>/dev/null; then
      pass "$BASENAME"
    else
      fail "$BASENAME has syntax errors"
    fi
  done
else
  warn "node not found, skipping JS syntax check"
fi

echo ""

# ── 5. json validation ──────────────────────────────────────

echo -e "${CYAN}── json validation ──${NC}"

if command -v jq &>/dev/null; then
  if jq empty "$MANIFEST" 2>/dev/null; then
    pass "manifest.json is valid JSON"
  else
    fail "manifest.json is not valid JSON"
  fi
elif command -v python3 &>/dev/null; then
  if python3 -c "import json; json.load(open('$MANIFEST'))" 2>/dev/null; then
    pass "manifest.json is valid JSON"
  else
    fail "manifest.json is not valid JSON"
  fi
fi

echo ""

# ── 6. css brace balance ────────────────────────────────────

echo -e "${CYAN}── css brace check ──${NC}"

CSS_FILES=$(find "$SRC_DIR" -maxdepth 1 -name '*.css' -type f)

for CSS in $CSS_FILES; do
  BASENAME=$(basename "$CSS")
  OPEN=$(tr -cd '{' < "$CSS" | wc -c | tr -d ' ')
  CLOSE=$(tr -cd '}' < "$CSS" | wc -c | tr -d ' ')
  if [ "$OPEN" -eq "$CLOSE" ]; then
    pass "$BASENAME ({$OPEN} pairs balanced)"
  else
    fail "$BASENAME braces unbalanced: { ×$OPEN vs } ×$CLOSE"
  fi
done

echo ""

# ── 7. html structure check ─────────────────────────────────

echo -e "${CYAN}── html structure ──${NC}"

HTML_FILES=$(find "$SRC_DIR" -maxdepth 1 -name '*.html' -type f)

for HTML in $HTML_FILES; do
  BASENAME=$(basename "$HTML")
  ISSUES=""

  if ! grep -q '<!DOCTYPE html>' "$HTML" 2>/dev/null; then
    if ! grep -qi '<!doctype' "$HTML" 2>/dev/null; then
      ISSUES="${ISSUES}missing DOCTYPE; "
    fi
  fi

  if ! grep -q '<meta charset' "$HTML" 2>/dev/null; then
    ISSUES="${ISSUES}missing charset meta; "
  fi

  SCRIPT_TAGS=$(grep -c '<script' "$HTML" 2>/dev/null || true)
  SCRIPT_CLOSE=$(grep -c '</script>' "$HTML" 2>/dev/null || true)
  if [ "$SCRIPT_TAGS" -ne "$SCRIPT_CLOSE" ]; then
    ISSUES="${ISSUES}script tag mismatch ($SCRIPT_TAGS open / $SCRIPT_CLOSE close); "
  fi

  if [ -z "$ISSUES" ]; then
    pass "$BASENAME"
  else
    warn "$BASENAME — $ISSUES"
  fi
done

echo ""

# ── 8. dangerous patterns ───────────────────────────────────

echo -e "${CYAN}── code hygiene ──${NC}"

HYGIENE_PASS=1

check_pattern() {
  local label="$1"
  local pattern="$2"
  local severity="$3"
  local glob="$4"
  local whitelist="${5:-}"

  MATCHES=$(grep -rn "$pattern" "$SRC_DIR" --include="$glob" 2>/dev/null || true)
  if [ -n "$whitelist" ] && [ -n "$MATCHES" ]; then
    MATCHES=$(echo "$MATCHES" | grep -v "$whitelist" || true)
  fi
  COUNT=$(echo "$MATCHES" | grep -c . 2>/dev/null || true)
  if [ -z "$MATCHES" ]; then
    COUNT=0
  fi

  if [ "$COUNT" -gt 0 ]; then
    HYGIENE_PASS=0
    if [ "$severity" = "warn" ]; then
      warn "$label ($COUNT hit)"
    else
      fail "$label ($COUNT hit)"
    fi
    echo "$MATCHES" | head -5 | while IFS= read -r line; do
      local relpath="${line#$SRC_DIR/}"
      echo -e "        ${YELLOW}$relpath${NC}"
    done
    if [ "$COUNT" -gt 5 ]; then
      echo -e "        ... and $((COUNT - 5)) more"
    fi
  fi
}

check_pattern "console.log (remove before release)" \
  'console\.log(' "warn" "*.js"

check_pattern "debugger statement" \
  'debugger' "fail" "*.js"

check_pattern "TODO/FIXME/HACK/XXX" \
  '\(TODO\|FIXME\|HACK\|XXX\)' "warn" "*.js"

check_pattern "hardcoded API key pattern" \
  '\(sk-[a-zA-Z0-9]\{10,\}\|key-[a-zA-Z0-9]\{10,\}\|Bearer [a-zA-Z0-9]\{20,\}\)' "fail" "*.js"

check_pattern "hardcoded localhost with unexpected port" \
  'localhost:[0-9]\{4,5\}' "warn" "*.js" "localhost:11434\|localhost:1234"

check_pattern "eval() usage" \
  'eval(' "fail" "*.js"

check_pattern "innerHTML from untrusted source" \
  '\.innerHTML\s*=' "warn" "*.js"

if [ "$HYGIENE_PASS" -eq 1 ]; then
  pass "no dangerous patterns found"
fi

echo ""

# ── 9. file size sanity ──────────────────────────────────────

echo -e "${CYAN}── file size check ──${NC}"

MAX_SINGLE_FILE_KB=500
MAX_TOTAL_KB=2048

TOTAL_SIZE=0
ALL_FILES=$(find "$SRC_DIR" -maxdepth 2 -type f \
  ! -name '.DS_Store' ! -name '._*' ! -name 'README.md' \
  ! -name 'build.sh' ! -name '*.zip' ! -path '*/.git/*')

while IFS= read -r f; do
  FSIZE=$(wc -c < "$f" | tr -d ' ')
  FSIZE_KB=$((FSIZE / 1024))
  TOTAL_SIZE=$((TOTAL_SIZE + FSIZE))
  FNAME=$(basename "$f")
  if [ "$FSIZE_KB" -gt "$MAX_SINGLE_FILE_KB" ]; then
    warn "$FNAME is ${FSIZE_KB} KB (threshold: ${MAX_SINGLE_FILE_KB} KB)"
  fi
done <<< "$ALL_FILES"

TOTAL_KB=$((TOTAL_SIZE / 1024))
if [ "$TOTAL_KB" -gt "$MAX_TOTAL_KB" ]; then
  warn "total extension size: ${TOTAL_KB} KB (threshold: ${MAX_TOTAL_KB} KB)"
else
  pass "total size: ${TOTAL_KB} KB"
fi

echo ""

# ── lint summary ─────────────────────────────────────────────

echo -e "${CYAN}── summary ──${NC}"
echo -e "   ${GREEN}pass${NC}: checks passed"
if [ "$WARN_COUNT" -gt 0 ]; then
  echo -e "   ${YELLOW}warn${NC}: $WARN_COUNT warning(s)"
fi
if [ "$FAIL_COUNT" -gt 0 ]; then
  echo -e "   ${RED}FAIL${NC}: $FAIL_COUNT error(s)"
  echo ""
  echo -e "${RED}build aborted due to lint errors${NC}"
  exit 1
fi
echo ""

# ── exit early for check / lint modes ────────────────────────

if [ "${1:-}" = "--check" ] || [ "${1:-}" = "--lint" ]; then
  echo "lint passed (no zip created)"
  exit 0
fi

# ── package ──────────────────────────────────────────────────

echo -e "${CYAN}── packaging ──${NC}"

if [ -f "$OUT_PATH" ]; then
  rm "$OUT_PATH"
  echo "   removed old $ZIP_NAME"
fi

cd "$SRC_DIR"
zip -r "$OUT_PATH" . \
  -x '*.DS_Store' \
  -x '._*' \
  -x '*.git*' \
  -x 'README.md' \
  -x 'build.sh' \
  -x '*.zip'
cd "$SCRIPT_DIR"

echo ""
echo -e "${CYAN}── package contents ──${NC}"
unzip -l "$OUT_PATH" | grep -v '^\(Archive\|  Length\| ------\|$\)' | sed '/^[[:space:]]*-/d'

SIZE=$(wc -c < "$OUT_PATH" | tr -d ' ')
SIZE_KB=$((SIZE / 1024))
echo ""
echo -e "${GREEN}── done ──${NC}"
echo "   $ZIP_NAME ($SIZE_KB KB)"
echo ""
echo "   install:"
echo "     1. open chrome://extensions/"
echo "     2. enable Developer mode"
echo "     3. click 'Load unpacked' → select vibe_reader/ folder"
echo ""
echo "   or distribute $ZIP_NAME for manual install"
