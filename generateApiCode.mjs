import { execSync } from "child_process";
import pkg from "fs-extra";

const { readFileSync, writeFileSync, existsSync } = pkg;

const configFilePath = ".prettierrc";
const lineToRemove =
  '"plugins": ["@trivago/prettier-plugin-sort-imports","prettier-plugin-tailwindcss"],';

let fileContent = null;
let hadPrettierFile = false;

// Step 1: Read the file if it exists
if (existsSync(configFilePath)) {
  fileContent = readFileSync(configFilePath, "utf8");
  hadPrettierFile = true;

  // Step 2: Remove the specified line
  const modifiedContent = fileContent
    .split("\n")
    .filter((line) => !line.includes(lineToRemove))
    .join("\n");

  // Step 3: Write the modified content back to the file
  writeFileSync(configFilePath, modifiedContent, "utf8");
} else {
  console.log("No .prettierrc file found, skipping prettier modification");
}

// Step 4: Run the codegen command
try {
  console.log("Running RTK Query codegen...");
  execSync(
    "npx @rtk-query/codegen-openapi lib/redux/api/openapi-config.ts",
    {
      stdio: "inherit",
    },
  );
  console.log("✅ Code generation completed successfully!");
} catch (error) {
  console.error("❌ Error executing codegen:", error.message);
  process.exit(1);
}

// Step 5: Restore original file contents if it existed
if (hadPrettierFile && fileContent) {
  writeFileSync(configFilePath, fileContent, "utf8");
}
