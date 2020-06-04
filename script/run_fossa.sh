#!/bin/bash
set -e

# Exit if download fails or host is not reachable.
set -o pipefail

# Download Fossa script and scan for licenses
curl -H 'Cache-Control:no-cache' https://raw.githubusercontent.com/fossas/fossa-cli/master/install.sh | BINDIR=$(pwd) bash
./fossa analyze
