/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

declare module '@kagenti/adk-lint-config/eslint' {
  import type { Linter } from 'eslint';

  const config: Linter.Config[];
  const nextConfig: Linter.Config[];

  export { nextConfig };
  export default config;
}

declare module '@kagenti/adk-lint-config/prettier' {
  import type { Config } from 'prettier';

  const config: Config;

  export default config;
}

declare module '@kagenti/adk-lint-config/stylelint' {
  import type { Config } from 'stylelint';

  const config: Config;

  export default config;
}
