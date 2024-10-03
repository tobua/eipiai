import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'

export const rsbuild = defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: {
      index: './index.tsx',
    },
  },
  html: {
    title: 'eipiai Demo',
    favicon: '../logo.png',
  },
  output: {
    // Only applied in production, GitHub pages in this case.
    assetPrefix: '/eipiai/',
    // To check if no server files landed in the bundle, disable for size comparison.
    minify: false,
  },
  tools: {
    rspack: {
      resolve: {
        alias: {
          react: 'epic-jsx',
          'react/jsx-runtime': 'epic-jsx',
          'react/jsx-dev-runtime': 'epic-jsx',
        },
      },
    },
  },
})

export const gitignore = 'bundle'
export const vscode = 'biome'
export const biome = {
  extends: 'recommended',
  files: {
    ignore: ['rsbuild.config.ts'],
  },
}

export const typescript = {
  extends: 'web',
  files: ['index.tsx'],
}
