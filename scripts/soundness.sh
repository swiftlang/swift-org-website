#!/bin/bash
##===----------------------------------------------------------------------===##
##
## This source file is part of the Swift.org open source project
##
## Copyright (c) 2022 Apple Inc. and the Swift.org project authors
## Licensed under Apache License v2.0
##
## See LICENSE.txt for license information
## See CONTRIBUTORS.txt for the list of Swift.org project authors
##
## SPDX-License-Identifier: Apache-2.0
##
##===----------------------------------------------------------------------===##

set -eu
here="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

function replace_acceptable_years() {
    # this needs to replace all acceptable forms with 'YEARS'
    sed -e 's/20[2][0123456789]-20[2][0123456789]/YEARS/' -e 's/20[2][0123456789]/YEARS/'
}

printf "=> Checking for unacceptable language... "
# This greps for unacceptable terminology. The square bracket[s] are so that
# "git grep" doesn't find the lines that greps :).
unacceptable_terms=(
    -e blacklis[t]
    -e whitelis[t]
    -e slav[e]
    -e sanit[y]
)

# We have to exclude the code of conduct as it gives examples of unacceptable language.
if git grep --color=never -i "${unacceptable_terms[@]}" -- . ":(exclude)code-of-conduct/index.md" ":(exclude)_config.yml" > /dev/null; then
    printf "\033[0;31mUnacceptable language found.\033[0m\n"
    git grep -i "${unacceptable_terms[@]}" -- . ":(exclude)code-of-conduct/index.md" ":(exclude)_config.yml"
    exit 1
fi
printf "\033[0;32mokay.\033[0m\n"

printf "=> Checking license headers... "
tmp=$(mktemp /tmp/.swift-org-soundness_XXXXXX)

for language in swift-or-c bash python; do
  declare -a matching_files
  declare -a exceptions
  exceptions=( )
  matching_files=( -name '*' )
  case "$language" in
      swift-or-c)
        exceptions=( -name "Package.swift" )
        matching_files=( -name '*.swift' -o -name '*.c' -o -name '*.h' )
        cat > "$tmp" <<"EOF"
//===----------------------------------------------------------------------===//
//
// This source file is part of the Swift.org open source project
//
// Copyright (c) YEARS Apple Inc. and the Swift.org project authors
// Licensed under Apache License v2.0
//
// See LICENSE.txt for license information
// See CONTRIBUTORS.txt for the list of Swift.org project authors
//
// SPDX-License-Identifier: Apache-2.0
//
//===----------------------------------------------------------------------===//
EOF
        ;;
      bash)
        exceptions=( -name "placeholder" )
        matching_files=( -name '*.sh' )
        cat > "$tmp" <<"EOF"
#!/bin/bash
##===----------------------------------------------------------------------===##
##
## This source file is part of the Swift.org open source project
##
## Copyright (c) YEARS Apple Inc. and the Swift.org project authors
## Licensed under Apache License v2.0
##
## See LICENSE.txt for license information
## See CONTRIBUTORS.txt for the list of Swift.org project authors
##
## SPDX-License-Identifier: Apache-2.0
##
##===----------------------------------------------------------------------===##
EOF
      ;;
      python)
        exceptions=( -name "placeholder" )
        matching_files=( -name '*.py' )
        cat > "$tmp" <<"EOF"
#!/usr/bin/env python
##===----------------------------------------------------------------------===##
##
## This source file is part of the Swift.org open source project
##
## Copyright (c) YEARS Apple Inc. and the Swift.org project authors
## Licensed under Apache License v2.0
##
## See LICENSE.txt for license information
## See CONTRIBUTORS.txt for the list of Swift.org project authors
##
## SPDX-License-Identifier: Apache-2.0
##
##===----------------------------------------------------------------------===##
EOF
      ;;
    *)
      echo >&2 "ERROR: unknown language '$language'"
      ;;
  esac

  expected_lines=$(cat "$tmp" | wc -l)
  expected_sha=$(cat "$tmp" | shasum)

  (
    cd "$here/.."
    {
        find . \
            \( \! -path './.build/*' -a \
            \( "${matching_files[@]}" \) -a \
            \( \! \( "${exceptions[@]}" \) \) \)

        if [[ "$language" = bash ]]; then
            # add everything with a shell shebang too
            git grep --full-name -l '#!/bin/bash'
            git grep --full-name -l '#!/bin/sh'
        fi
    } | while read line; do
      if [[ "$(cat "$line" | replace_acceptable_years | head -n $expected_lines | shasum)" != "$expected_sha" ]]; then
        printf "\033[0;31mmissing headers in file '$line'!\033[0m\n"
        diff -u <(cat "$line" | replace_acceptable_years | head -n $expected_lines) "$tmp"
        exit 1
      fi
    done
    printf "\033[0;32mokay.\033[0m\n"
  )
done

rm "$tmp"
