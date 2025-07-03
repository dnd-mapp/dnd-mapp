/**
 * Runs on the BeforeBuild lifecycle hook of electron-builder.
 *
 * @param context {import('app-builder-lib').BeforeBuildContext}
 * @return {Promise<boolean>}
 */
async function beforeBuild(context) {
    // Return false for now in order to exclude all dependencies from the packaged app.
    // This results in skipping the installation and rebuilding of dependencies.
    // We don't need this at the moment since we don't use any native dependencies that need rebuilding or other
    // external dependencies that should be included in the packaged app.
    return false;
}

export default beforeBuild;
