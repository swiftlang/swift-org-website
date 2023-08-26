set -eu
here="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$here/.."

bundle check
bundle exec jekyll doctor --source /srv/jekyll --destination /output
bundle exec jekyll build --source /srv/jekyll --destination /output

# This line runs broken link checks: https://github.com/gjtorikian/html-proofer
bundle exec htmlproofer \
    --ignore-status-codes "429" \
    --only-4xx \
    --no-enforce-https \
    --no-check-external-hash \
    --ignore-urls "/twitter.com/,/github.com/" \
    /output
