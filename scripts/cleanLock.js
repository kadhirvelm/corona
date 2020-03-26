const execSync = require("child_process").execSync;

function testBasicCleanLock() {
  execSync("yarn", { stdio: "ignore" });
  const deduplicateDiff = execSync("npx yarn-deduplicate --list yarn.lock").toString();

  if (deduplicateDiff === "") {
    return;
  }
  console.log("The lockfile is not clean, please run 'yarn clean:lock' in the root directory.");

  const yarnDiff = execSync("git diff yarn.lock").toString();
  if (yarnDiff === "") {
    return;
  }

  console.log("The lockfile has changed, please run 'yarn' in the root folder and commit the changes.");
  throw new Error("The lockfile is not clean.");
}

function main() {
  try {
    testBasicCleanLock();
    process.exit(0);
  } catch {
    process.exit(1);
  }
}

main();
