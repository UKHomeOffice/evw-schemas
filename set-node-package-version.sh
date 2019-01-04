
git fetch --tags
VERSION=`git describe --tags --match "v?.?"`
echo "last git tag found: $VERSION"

if [[ $VERSION == v?.?-* ]];  # v5.2-1-gitSha -> v5.2.1-gitsha
then
  VERSION=`echo $VERSION | sed 's/-/./'`
elif [[ $VERSION == v?.? ]];   # v5.2 -> v5.2.0
then
  VERSION=${VERSION}.0
fi;

# add branch if this is not the master branch
CURRENT_BRANCH=`git branch | grep --color=NEVER "*" | cut -c 3-`
if [[ "$CURRENT_BRANCH" != "master" ]];
then
  VERSION=${VERSION}-$CURRENT_BRANCH
fi;

# add -U to name if uncommitted changes in repo
git status | grep "nothing to commit"
if [[ $? -eq 1 ]];
then
  VERSION=${VERSION}-U
fi;

# remove leading v character from tag (v5.2 -> 5.2)
VERSION=`echo $VERSION | cut -c 2-`

echo "Setting version to $VERSION"
# update package file
sed -i "s/__BUILD_VERSION__/$VERSION/g" package.json
