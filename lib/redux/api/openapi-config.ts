import type { ConfigFile } from '@rtk-query/codegen-openapi';

const config: ConfigFile = {
  schemaFile: `${process.env.BACKEND_URL}/api-docs.json`,
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
