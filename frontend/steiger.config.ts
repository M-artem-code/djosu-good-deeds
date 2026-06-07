import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

/**
 * Steiger enforces the core FSD guardrail for this repo: the layer dependency
 * direction (`fsd/forbidden-imports`). Convention rules that clash with the
 * project's deliberate choices are disabled and documented below.
 */
export default defineConfig([
  ...fsd.configs.recommended,
  {
    ignores: ["**/*.test.ts", "**/*.test.tsx"],
  },
  {
    rules: {
      // `views` is used as the pages layer (see docs/FSD.md). Steiger does not
      // recognise it, so it cannot trace references from screens and wrongly
      // marks feature slices as unused.
      "fsd/insignificant-slice": "off",
      // The project uses grouped slices (e.g. `features/auth/login`) with the
      // standard `ui`/`model`/`lib` segments inside each leaf slice.
      "fsd/no-reserved-folder-names": "off",
      // Grouped slices are imported as `@/features/auth/<slice>`, which Steiger
      // treats as a public-API sidestep on the `auth` group.
      "fsd/no-public-api-sidestep": "off",
      // Each leaf slice keeps its own index.ts; grouped slices (`features/auth`)
      // intentionally have no group-level public API.
      "fsd/public-api": "off",
    },
  },
  {
    // The RTK store eagerly imports entity/feature endpoint modules purely for
    // their `injectEndpoints` side effects. Intentional registration pattern.
    files: ["./src/shared/api/rtk/**", "./src/shared/api/store-provider.tsx"],
    rules: {
      "fsd/forbidden-imports": "off",
    },
  },
]);
