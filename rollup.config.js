// https://rollupjs.org/
// https://code.lengstorf.com/learn-rollup-js/

// rollup.config.js
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import serve from 'rollup-plugin-serve'
import copy from "rollup-plugin-copy";

export default {
    input: 'src/main.js',
    output: {
        file: 'build/bundle.js',
        format: 'cjs'
    },
    plugins: [
        json(),
        resolve({
            jsnext: true,
            main: true
        }),
        commonjs({ include: 'node_modules/**' }),
        serve({ open: true, contentBase: 'build' }),
        copy({
            flatten: false,
            targets: [{
                src: 'resources/**', 
                dest: 'build/resources/'
            }] 
        })
    ]
};