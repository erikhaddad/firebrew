#!/bin/bash
PATH=$PATH:$(npm bin)
set -x

# Run command found in package.json to generate sw files
npm run build-ngsw

# Serve
cd dist
angular-http-server