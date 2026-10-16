#!/usr/bin/env bash
# Copy the five GreenRah screenshots into assets/app/ with the names the deck expects.
# Usage: tools/add-screens.sh /path/to/attachments
set -euo pipefail
SRC="${1:?attachments folder}"; DST="$(cd "$(dirname "$0")/.." && pwd)/assets/app"
cp "$SRC/38a27db45bfbb502965215b45d5dfe0daa89a1621fffd3d22e247e8f17e059f9.png" "$DST/plan-heat.png"
cp "$SRC/f12327577d1bc27311d2a9a7888b97d82f048a60eee930d84a9374da0febfc09.png" "$DST/plan-accessible.png"
cp "$SRC/9d7effdcfabf8d6f00ecc8a8d5cf0efdccf35aecf2c4120a553ef3326d635e17.png" "$DST/barcelona-result.png"
cp "$SRC/1682545aa24c41394a40422fe5703b88a73c8538017b14ba06e9c91d15045d39.png" "$DST/barcelona-3d.png"
cp "$SRC/06e2a398191c438b4cc5908f0763485a3f46041b9f4adba63c699f020126b644.png" "$DST/lisbon-3d.png"
echo "Copied 5 screenshots to $DST"
