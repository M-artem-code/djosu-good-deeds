import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SRC = path.join(path.dirname(fileURLToPath(import.meta.url)), "../src");

const REPLACEMENTS = [
  [/@\/shared\/ui\/loader/g, "@/shared/ui"],
  [/@\/shared\/ui\/primary-button/g, "@/shared/ui"],
  [/@\/shared\/ui\/text-field/g, "@/shared/ui"],
  [/@\/shared\/ui\/text-button/g, "@/shared/ui"],
  [/@\/shared\/ui\/text-area-field/g, "@/shared/ui"],
  [/@\/shared\/ui\/deed-skeleton-card/g, "@/shared/ui"],
  [/@\/shared\/ui\/friend-skeleton-card/g, "@/shared/ui"],
  [/@\/shared\/ui\/profile-skeleton-card/g, "@/shared/ui"],
  [/@\/shared\/ui\/error-banner/g, "@/shared/ui"],
  [/@\/shared\/ui\/empty-state/g, "@/shared/ui"],
  [/@\/shared\/ui\/confirm-dialog/g, "@/shared/ui"],
  [/@\/shared\/ui\/form-error-banner/g, "@/shared/ui"],
  [/@\/widgets\/app-nav/g, "@/widgets"],
  [/@\/widgets\/list-query-state/g, "@/widgets"],
  [/@\/widgets\/page-header/g, "@/widgets"],
  [/@\/widgets\/page-shell/g, "@/widgets"],
  [/@\/shared\/lib\/auth\/token/g, "@/shared/lib"],
  [/@\/shared\/lib\/normalize-tag/g, "@/shared/lib"],
  [/@\/shared\/lib\/use-collapsible-form/g, "@/shared/lib"],
  [/@\/shared\/api\/auth-form-errors/g, "@/shared/api"],
  [/@\/shared\/api\/form-mutation-errors/g, "@/shared/api"],
  [/@\/shared\/api\/validation-errors/g, "@/shared/api"],
  [/@\/shared\/api\/errors/g, "@/shared/api"],
  [/@\/shared\/api\/rtk\/clear-auth-session/g, "@/shared/api"],
  [/@\/shared\/api\/rtk\/auth-slice/g, "@/shared/api"],
  [/@\/shared\/api\/rtk\/ui-slice/g, "@/shared/api"],
  [/@\/shared\/api\/rtk\/base-api/g, "@/shared/api"],
  [/@\/shared\/api\/store-provider/g, "@/shared/api"],
  [/\{ TextButton \} from "\.\.\/text-button"/g, '{ TextButton } from "@/shared/ui"'],
];

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) {
      walk(full);
      continue;
    }
    if (!/\.(tsx?)$/.test(name)) continue;
    if (name.endsWith(".test.ts")) continue;
    let content = fs.readFileSync(full, "utf8");
    let next = content;
    for (const [from, to] of REPLACEMENTS) {
      next = next.replace(from, to);
    }
    if (next !== content) {
      fs.writeFileSync(full, next);
      console.log(path.relative(SRC, full));
    }
  }
}

walk(SRC);
console.log("Done.");
