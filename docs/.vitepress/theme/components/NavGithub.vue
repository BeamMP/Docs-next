<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useData } from 'vitepress'
import { Github, GitFork, Star } from 'lucide-vue-next'

/**
 * The repository card from the MkDocs Material header: the GitHub mark, the repository
 * name, and its stars and forks. The numbers come from GitHub's public API in the visitor's
 * browser and are kept for an hour, so the page makes at most one request an hour and the
 * site still works, without the numbers, if GitHub cannot be reached.
 * The repository is set in one place, .vitepress/site.ts, and read here from the theme config.
 * `screen` is the copy in the phone menu, which is a row instead of a header button.
 */
defineProps<{ screen?: boolean }>()

const { theme } = useData()
const REPO = computed<string>(() => theme.value.repo)
const CACHE_MS = 60 * 60 * 1000

const stars = ref<number | null>(null)
const forks = ref<number | null>(null)

const short = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, '')}k` : String(n))

onMounted(async () => {
  const repo = REPO.value
  const CACHE_KEY = `beammp-docs-repo:${repo}`
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null')
    if (cached && Date.now() - cached.at < CACHE_MS) {
      stars.value = cached.stars
      forks.value = cached.forks
      return
    }
  } catch {
    /* storage can be blocked */
  }
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}`, { headers: { Accept: 'application/vnd.github+json' } })
    if (!response.ok) return
    const data = await response.json()
    stars.value = data.stargazers_count
    forks.value = data.forks_count
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), stars: stars.value, forks: forks.value }))
    } catch {
      /* storage can be blocked */
    }
  } catch {
    /* offline, rate limited or blocked: the card shows just the name */
  }
})
</script>

<template>
  <a class="bm-repo" :class="{ 'bm-repo--screen': screen }" :href="`https://github.com/${REPO}`" target="_blank" rel="noopener noreferrer" :aria-label="`${REPO} on GitHub`">
    <Github class="bm-repo__mark" aria-hidden="true" />
    <span class="bm-repo__text">
      <span class="bm-repo__name">{{ REPO }}</span>
      <span v-if="stars !== null && forks !== null" class="bm-repo__facts">
        <span class="bm-repo__fact"><Star aria-hidden="true" />{{ short(stars) }}</span>
        <span class="bm-repo__fact"><GitFork aria-hidden="true" />{{ short(forks) }}</span>
      </span>
    </span>
  </a>
</template>
