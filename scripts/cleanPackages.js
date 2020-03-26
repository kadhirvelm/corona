const execSync = require("child_process").execSync;

function cleanPackage(packageName) {
  execSync(`cd packages/${packageName} && (rm -r dist || true) && (rm -r node_modules || true)`, { stdio: "ignore" });
  console.log(`\t\x1b[37mCleaned ${packageName}\x1b[0m`);
}

function getPackageNames() {
  const rawPackageNames = execSync("cd packages && ls");
  return rawPackageNames.toString().split("\n").filter(packageName => packageName !== "");
}

getPackageNames().forEach(packageName => cleanPackage(packageName));