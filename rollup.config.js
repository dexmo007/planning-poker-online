import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';
import { config } from 'dotenv';
import * as path from 'path';
import css from 'rollup-plugin-css-only';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/build/bundle.js',
  },
  plugins: [
    replace({
      preventAssignment: true,
      values: {
      'process.env': JSON.stringify({
        mode: production ? 'production' : 'development',
        ...config({ path: path.resolve(process.cwd(), '.env') }).parsed,
        ...config({ path: path.resolve(process.cwd(), '.env.local') }).parsed,
      }),
    }}),
    svelte({
      compilerOptions: {
              // enable run-time checks when not in production
      dev: !production,
        hydratable: true,
      },
    }),
         // we'll extract any component CSS out into
      // a separate file - better for performance
    css({ output: 'bundle.css'}),
    resolve({
      browser: true,
      dedupe: (importee) =>
        importee === 'svelte' || importee.startsWith('svelte/'),
      mainFields: ['main', 'module'],
    }),
    commonjs(),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload('public'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};

function serve() {
  let started = false;

  return {
    writeBundle() {
      if (!started) {
        started = true;

        require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
          stdio: ['ignore', 'inherit', 'inherit'],
          shell: true,
        });
      }
    },
  };
}
