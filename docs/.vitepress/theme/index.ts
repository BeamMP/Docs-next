import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme-without-fonts'
import { h } from 'vue'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'
import AppFooter from './components/AppFooter.vue'
import NavGithub from './components/NavGithub.vue'
import './tokens.css'
import './custom.css'
import './layout.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h(NavGithub),
      'nav-screen-content-after': () => h(NavGithub, { screen: true }),
      'layout-bottom': () => h(AppFooter)
    })
  },
  enhanceApp({ app }) {
    enhanceAppWithTabs(app)
  },
} satisfies Theme
