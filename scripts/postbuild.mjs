// CommonJS consumers resolve types through `exports.require.types`, which must be a .d.cts file.
import { copyFileSync } from 'node:fs';

copyFileSync('dist/index.d.ts', 'dist/index.d.cts');
console.log('postbuild: wrote dist/index.d.cts');
