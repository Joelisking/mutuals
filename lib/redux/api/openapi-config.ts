import type { ConfigFile } from '@rtk-query/codegen-openapi';

const config: ConfigFile = {
  schemaFile: `http://localhost:4000/api-docs.json`,
  apiFile: './index.ts',
  apiImport: 'api',
  outputFile: 'openapi.generated.ts',
  exportName: 'api',
  hooks: {
    queries: true,
    lazyQueries: true,
    mutations: true,
  },
  tag: true,
};

export default config;
