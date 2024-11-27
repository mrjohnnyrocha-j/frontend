// src/utils/jtmlSnippets.js

/**
 * Custom JTML Snippets for Auto-Completion in Ace Editor
 */
export const jtmlSnippets = [
  {
    name: "Section",
    value: `<section id="\${1:section-id}">
  <h2>\${2:Heading}</h2>
  <p>\${3:Your content here}</p>
</section>`,
    description: "Insert a JTML section",
  },
  {
    name: "Component",
    value: `<component name="\${1:component-name}">
  \${2:Component content}
</component>`,
    description: "Insert a JTML component",
  },
  {
    name: "Header",
    value: `<header>
  <h1>\${1:Title}</h1>
</header>`,
    description: "Insert a JTML header",
  },
  {
    name: "Footer",
    value: `<footer>
  <p>\${1:Footer content}</p>
</footer>`,
    description: "Insert a JTML footer",
  },
  // Add more snippets as needed
];
