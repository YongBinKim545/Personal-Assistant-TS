<template>
  <div class="prose dark:prose-invert text-justify max-w-none w-full markdown-content" v-html="markdown.render(source)" />
</template>

<script setup lang="ts">
import MarkdownIt from "markdown-it"
import highlightjs from "highlight.js/lib/common"

const markdown: MarkdownIt = new MarkdownIt({
  // Enable HTML tags in source
  html: false,

  // Use '/' to close single tags (<br />).
  // This is only for full CommonMark compatibility.
  xhtmlOut: true,

  // Convert '\n' in paragraphs into <br>
  breaks: true,

  // CSS language prefix for fenced blocks. Can be
  // useful for external highlighters.
  langPrefix: 'language-',

  // Autoconvert URL-like text to links
  linkify: false,

  // Enable some language-neutral replacement + quotes beautification
  // For the full list of replacements, see https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.mjs
  typographer: false,

  // Double + single quotes replacement pairs, when typographer enabled,
  // and smartquotes on. Could be either a String or an Array.
  //
  // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
  // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
  quotes: '“”‘’',

  // Highlighter function. Should return escaped HTML,
  // or '' if the source string is not changed and should be escaped externally.
  // If result starts with <pre... internal wrapper is skipped.
  highlight: (str, lang) => {
    if (lang && highlightjs.getLanguage(lang)) {
      try {
        return (
          `<pre class="hljs relative"><code>${highlightjs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code>${copyButton}</pre>`
        );
      } catch (__) { }
    }
    return `<pre class="hljs relative"><code>${markdown.utils.escapeHtml(str)}</code>${copyButton}</pre>`;
  }
});

const copyButton = `<button class="absolute top-2 right-2">copy</button>`
defineProps({
  source: {
    type: String,
    default: ""
  }
});
</script>
<style scoped>
.markdown-content :deep(pre),
.markdown-content :deep(code) {
  white-space: pre-wrap;
  word-wrap: break-word;
  text-align: start;
}

.markdown-content :deep(pre) {
  overflow-x: auto;
}

.markdown-content :deep(.hljs) {
  padding: 1em;
  border-radius: 0.5em;
}
</style>