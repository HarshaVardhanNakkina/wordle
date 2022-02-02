import { terser } from 'rollup-plugin-terser';

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/wordle.js',
        banner: '#!/usr/bin/env node',
        format: 'es',
        plugins: [terser()]
    }
};
