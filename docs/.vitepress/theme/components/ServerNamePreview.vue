<script setup lang="ts">
import { computed, ref } from 'vue'

/**
 * Live preview of a server name or description with BeamMP format codes (^0-^f, ^l, ^o, ^n, ^m, ^r, ^p).
 * It runs entirely in the visitor's browser and copies how the mod draws server names:
 * the parser follows serverTitleMarkup() in ui/ui-vue/mods/BeamMP/views/BeamMPServersView.vue, and the
 * colours and effects follow ui/assets/BeamMP/shared_styles/formatCodes.css (BeamNG's --bng-* variables
 * resolved from the game's ui-vue/src/styles/modules/_colors.scss). Keep them in step if the mod changes.
 */

const COLORS: Record<string, string> = {
  '0': '#131313',
  '1': 'oklch(50.50% 0.2303 263.99)',
  '2': 'oklch(69.59% 0.1416 153.15)',
  '3': 'oklch(69.50% 0.1152 219.90)',
  '4': 'oklch(50.48% 0.17 30.36)',
  '5': 'oklch(56.46% 0.2621 326.42)',
  '6': 'oklch(69.58% 0.2043 43.49)',
  '7': '#aaaaaa',
  '8': '#555555',
  '9': 'oklch(61.98% 0.194 264.13)',
  a: 'oklch(79.81% 0.1703 153.54)',
  b: 'oklch(79.88% 0.0804 219.66)',
  c: '#ff4545',
  d: 'oklch(75.05% 0.2348 326.77)',
  e: 'oklch(90.11% 0.1706 100.06)',
  f: '#ffffff'
}

const EFFECTS: Record<string, string> = {
  l: 'bold',
  m: 'line-through',
  n: 'underline',
  o: 'italic'
}

type Part =
  | { kind: 'text'; text: string; color: string | null; effects: string[] }
  | { kind: 'break' }
  | { kind: 'icon'; name: string }

const input = ref('^l^6Beam^fMP ^r^7| ^bFreeroam ^r^7| ^aEveryone welcome')

const parts = computed<Part[]>(() => {
  const tokens = input.value.split(/(\^.)/g)
  const out: Part[] = []
  let color: string | null = null
  const effects = new Set<string>()

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i]
    if (!token) continue

    if (/^\^.$/.test(token)) {
      const code = token[1]
      if (code === 'r') {
        color = null
        effects.clear()
      } else if (code === 'p') {
        out.push({ kind: 'break' })
      } else if (code === '*') {
        // The next piece of text is a BeamNG icon name; the game swaps it for the icon.
        const name = (tokens[i + 1] || '').trim()
        if (name) out.push({ kind: 'icon', name })
        i += 1
      } else if (code in COLORS) {
        color = code
      } else if (code in EFFECTS) {
        effects.add(EFFECTS[code])
      }
      // Any other ^x is dropped, as it is in game.
      continue
    }

    out.push({ kind: 'text', text: token, color, effects: [...effects] })
  }
  return out
})

const isEmpty = computed(() => !parts.value.some((p) => p.kind !== 'text' || p.text.trim()))
</script>

<template>
  <div class="snp">
    <label class="snp-label" for="snp-input">Try it out</label>
    <textarea
      id="snp-input"
      v-model="input"
      class="snp-input"
      rows="2"
      spellcheck="false"
      autocomplete="off"
      placeholder="Type a server name, e.g. ^l^6My ^fServer"
    />
    <div class="snp-label" aria-hidden="true">Preview</div>
    <div class="snp-preview" aria-live="polite">
      <span v-if="isEmpty" class="snp-placeholder">Your server name will appear here</span>
      <template v-for="(part, i) in parts" v-else :key="i">
        <br v-if="part.kind === 'break'" />
        <span v-else-if="part.kind === 'icon'" class="snp-icon" :title="`BeamNG icon: ${part.name}`">{{ part.name }}</span>
        <span
          v-else
          :class="part.effects"
          :style="part.color ? { color: COLORS[part.color] } : undefined"
        >{{ part.text }}</span>
      </template>
    </div>
    <p class="snp-note">
      The preview uses the same colours as the in-game server list, so dark colours are just as hard to read here
      as they are in game.
    </p>
  </div>
</template>

<style scoped>
.snp {
  margin: 16px 0;
  padding: 16px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md, 8px);
  background-color: var(--card, transparent);
}

.snp-label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.875em;
  font-weight: 600;
}

.snp-input {
  display: block;
  box-sizing: border-box;
  width: 100%;
  margin-bottom: 14px;
  padding: 8px 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm, 4px);
  background-color: var(--background, transparent);
  color: inherit;
  font-family: var(--vp-font-family-mono);
  font-size: 0.9em;
  line-height: 1.5;
  resize: vertical;
}

.snp-input:focus-visible {
  outline: 2px solid var(--beammp-orange, var(--vp-c-brand-1));
  outline-offset: 1px;
}

/* Always the dark in-game look, in both site themes. */
.snp-preview {
  min-height: 2.5em;
  padding: 10px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm, 4px);
  background-color: #1c1c1c;
  color: #ffffff;
  font-size: 1.05em;
  line-height: 1.5;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.snp-placeholder {
  color: #8a8a8a;
}

.snp-icon {
  display: inline-block;
  margin: 0 2px;
  padding: 0 5px;
  border: 1px dashed #777777;
  border-radius: 4px;
  color: #aaaaaa;
  font-size: 0.8em;
  font-style: normal;
  font-weight: normal;
  text-decoration: none;
}

.snp-note {
  margin: 8px 0 0;
  font-size: 0.8em;
  opacity: 0.75;
}

/* Same rules and order as formatCodes.css, so ^m and ^n together behave as they do in game. */
.bold { font-weight: bold; }
.line-through { text-decoration: line-through; }
.underline { text-decoration: underline; }
.italic { font-style: italic; }
</style>
