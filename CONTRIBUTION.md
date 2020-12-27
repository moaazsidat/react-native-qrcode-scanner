## To contribute and test your changes.

### How to contribute

1. Clone https://github.com/moaazsidat/react-native-qrcode-scanner
2. Make changes
3. Clone https://github.com/moaazsidat/react-native-qrcode-scanner-demo
4. Test your changes by doing one of the following
   - Linking your local version of `react-native-qrcode-scanner` to `react-native-qrcode-scanner-demo` using `npm link`
   - Make changes to the local file `qrcodeScanner.js`, and import it https://github.com/moaazsidat/react-native-qrcode-scanner-demo/blob/master/index.ios.js#L17-L18
5. Once tested, make a pull request against https://github.com/moaazsidat/react-native-qrcode-scanner
6. Await review, and upon accepted review, merge to master.

### Where can I find stuff to contribute?

Navigate to Issues and filter by `good first issue` or `help wanted` labels

- https://github.com/moaazsidat/react-native-qrcode-scanner/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22
- https://github.com/moaazsidat/react-native-qrcode-scanner/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22

### Active contributor

This project is looking for active contributors, especially those well-versed with Android.
If you're interested in becoming an active contributor with write access, create an issue titled 'Active contributor', and create a pull request to address a couple of issues. If it goes well, I'd be happy to give write access to merge PRs to master.

### Formatting for commit messages for merge commits

Any merges to the `master` branch will publish a new version of the NPM package.

This is done using [semantic-release](https://github.com/semantic-release/semantic-release), and therefore, merge commits must follow [the default semantic-release commit message format](https://github.com/semantic-release/semantic-release#commit-message-format) in order for the CI to pick up changes and publish the correct version bump.
