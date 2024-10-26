import type { ConfigEnv, UserConfig } from 'vite';
import { defineConfig } from 'vite';
import { pluginExposeRenderer } from './vite.base.config';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
// import path from 'path'

// https://vitejs.dev/config
export default defineConfig((env) => {
  const forgeEnv = env as ConfigEnv<'renderer'>;
  const { root, mode, forgeConfigSelf } = forgeEnv;
  const name = forgeConfigSelf.name ?? '';

  return {
    root,
    mode,
    base: './',
    build: {
      outDir: `.vite/renderer/${name}`,
    },
    plugins: [
      pluginExposeRenderer(name),
      vue(),
      AutoImport({
        imports: [
          'vue',
          '@vueuse/core',
          'vue-router',
          {
            'vue-router': [
              'createRouter',
              'createWebHashHistory',
            ],
          },
        ],
        dts: 'types/auto-imports.d.ts',
        dirs: ['renderer/composables/**'],
        // resolvers:[Vuetify3Resolver()],
        eslintrc: {enabled: true},
        vueTemplate: true,
      }),
      Components({
        dts: 'types/components.d.ts',
        dirs: ['renderer/components/**'],
      }),
    ],
    resolve: {
      preserveSymlinks: true,
      alias: [
        { find: "@", replacement: "/renderer" },
      ],
    },
    clearScreen: false,
    // server: {
    //   proxy: {

    //   }
    // },
  } as UserConfig;
});
