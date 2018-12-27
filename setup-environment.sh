#!/bin/bash

export NVM_DIR="$HOME/.nvm"

pluck_version() {
  ruby -e "require 'json'; puts JSON.parse(STDIN.read)['engines']['$1'].gsub(/[^0-9.]/, '')" < package.json
}

nvm_version="$(pluck_version 'nvm')"
node_version="$(pluck_version 'node')"
npm_version="$(pluck_version 'npm')"
nvm_node_version="$(tr -d 'v' < .nvmrc)"

if [ "$node_version" != "$nvm_node_version" ]
then
  echo ""
  echo "WARNING: Node.js version in 'package.json' file ($node_version) does not match that in the '.nvmrc' file ($nvm_node_version)."
  echo "To remove this warning, please make sure that both of these files contain the same Node.js version."
  echo "*** This script will use the version in the '.nvmrc' file ($nvm_node_version). ***"
  echo ""
fi

# shellcheck source=/dev/null
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
installed_nvm_version=$(command -v nvm >/dev/null 2>&1 && nvm --version)

if [ "$installed_nvm_version" = "$nvm_version" ]
then
  echo "NVM version up to date ($nvm_version)"
else
  echo "NVM version needs updated to $nvm_version (on $installed_nvm_version)"
  curl "https://raw.githubusercontent.com/creationix/nvm/v$nvm_version/install.sh" | sh
fi

# shellcheck source=/dev/null
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use --delete-prefix default --silent

installed_node_version=$(command -v node >/dev/null 2>&1 && node --version | tr -d 'v')

if [ "$installed_node_version" = "$nvm_node_version" ]
then
  echo "Node.js version up to date ($nvm_node_version)"
else
  echo "Node.js version needs updated to $nvm_node_version (on $installed_node_version)"
  nvm install
  nvm use --delete-prefix "$nvm_node_version" --silent
  nvm alias default "$nvm_node_version"

  node_binary_file_path=$(nvm which "$nvm_node_version")
  node_bin_directory_path=$(sed "s/bin\/node/bin/" <<< "$node_binary_file_path")
  node_directory_path=$(sed "s/bin\/node//" <<< "$node_binary_file_path")

  PATH=$node_bin_directory_path:$PATH
  export NODE=$node_binary_file_path
  export npm_config_node_version=$nvm_node_version
  export npm_config_prefix=$node_directory_path
  export npm_node_execpath=$node_binary_file_path
fi

node_binary_file_path=$(nvm which "$nvm_node_version")
npm_command="${node_binary_file_path%node}npm"
installed_npm_version=$(command -v npm >/dev/null 2>&1 && $npm_command --version)

if [ "$installed_npm_version" = "$npm_version" ]
then
  echo "npm version up to date ($npm_version)"
else
  echo "npm version needs updated to $npm_version (on $installed_npm_version)"
  $npm_command install -g npm@"$npm_version"
fi

current_npm_user="$($npm_command whoami 2>/dev/null)"

if [ "$installed_node_version" = "$nvm_node_version" ]
then
  echo "Confirming application dependencies are up to date"
  $npm_command install
  echo "Ensuring package-lock uses https"
  $npm_command run post-install
else
  echo "Node.js version has changed from $installed_node_version to $nvm_node_version, re-installing application dependencies"
  $npm_command rm -rf node_modules && npm install
  $npm_command run post-install
fi


node --version > ./node_modules/.version

if [ "$installed_nvm_version" != "$nvm_version" ]
then
  echo ""
  echo "*** Please close this terminal and open a new one to source the newly installed version of NVM ***"
fi
