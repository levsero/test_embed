#!/bin/bash
set -v

# Download source clear script and scan the current directory for security issues in Open Source Components.
curl -fsSL https://download.sourceclear.com/ci.sh | bash -x
