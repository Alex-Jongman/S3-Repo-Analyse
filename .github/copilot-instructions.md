# Naming Instructions for Copilot

- All new files must have descriptive, meaningful names that clearly indicate their purpose or content (e.g., `user-profile.js`, `data-fetcher.js`).
- Functions and variables must use clear, self-explanatory names that reflect their role and behavior (e.g., `fetchUserData`, `calculatePortfolioValue`).
- Avoid generic names like `temp`, `test`, `foo`, `bar`, or similar.
- Use camelCase for variables and functions in JavaScript, and kebab-case for filenames.
- When creating components, include their domain or feature in the name (e.g., `portfolioChart`, `repoList`).
- Prefer explicitness over brevity if it improves clarity.

## Design System Guidelines

- All UI must use the MDUI Material Design library (https://www.mdui.org/en/). Use MDUI classes and components for layout, buttons, lists, and all visual elements.
- Apply MDUI styles and structure to all web components and pages for a consistent Material Design look and feel.
- Use CSS Grid for layout where possible, instead of Flexbox. When using CSS Grid, prefer `grid-template-areas` with readable, meaningful names for each cell (e.g., 'sidebar', 'main-content', 'header', 'footer').
- Prefer meaningful semantic HTML tags (such as `main`, `nav`, `aside`, `section`, `header`, `footer`, `ul`, `li`, `button`, etc.) over `div` and `span`. Use `div` and `span` only when there is no meaningful semantic alternative.

## Web Component Guidelines

- All web components must be written in JavaScript using the Lit library.
- Each web component should have a clear, single responsibility and should not be too large or complex.
- Web components must not manage data directly (e.g., do not use `fetch`, `localStorage`, or `sessionStorage` inside components).
- All data fetching and CRUD operations should be handled in dedicated service files.
- Service files must be placed in a `src/services/` folder and are responsible for managing data operations (fetching, creating, updating, deleting, and storage interactions).
- When implementing a list, create a dedicated web component for the list and a separate web component for the list item. The list component should only be responsible for rendering the list structure and passing data to each list item component, which is responsible for rendering a single item and handling its own interactions.
- If the list component does not render a semantic list container (such as `<ul>` or `<ol>`), the list item component must not render a `<li>`. Use a semantic alternative such as `<button>`, `<section>`, or `<div>` if no better option exists. Only render `<li>` inside a parent `<ul>` or `<ol>`.
- Only render a `<ul>` or `<ol>` if the content is truly a list of items, and only if each direct child is a `<li>`. Never render a `<ul>` or `<ol>` if the children are not `<li>` elements.

## Page Component Guidelines

- All page-level web components must be placed in the `src/pages/` folder.
- Page components are responsible for rendering an entire page and composing other components as needed.
- The `index.html` file should only need to import a single JavaScript file from `src/pages/` to load the full application or a specific page.
- Page components must follow the same naming, documentation, Lit usage, MDUI design, CSS Grid (with grid-template-areas), and semantic HTML guidelines as other components.

## Documentation Guidelines

- All code should be well documented using JSDoc notation for functions, classes, and important code sections.
- All code comments and JSDoc documentation must be written in English.

## Folder Structure Guidelines

- Organize source code in a `src/` directory. Place each major feature or domain in its own subfolder within `src/` (e.g., `src/user/`, `src/portfolio/`).
- Store shared components in a `src/components/` folder, and shared utilities in `src/utils/`.
- Place page-level components in a `src/pages/` folder, with each file representing a full page web component.
- Place static assets (images, icons, etc.) in `src/assets/` or a top-level `public/` folder for public files.
- Keep styles in a `src/styles/` or `src/index.css` file, or colocate styles with components if appropriate.
- Keep configuration files (e.g., `package.json`, `vite.config.js`) at the project root.
- Avoid deeply nested folders; prefer a flat structure where possible for clarity.

---

Always follow these naming conventions, component guidelines, documentation standards, and folder structure recommendations when generating or editing code in this project. This includes the organization and usage of page-level components in `src/pages/`, the use of the MDUI Material Design system for all UI, the use of CSS Grid (with grid-template-areas and readable cell names) for layout where possible, the preference for semantic HTML tags over `div` and `span` unless no alternative exists, and the separation of list and list-item web components. Only render `<li>` inside a parent `<ul>` or `<ol>`; otherwise, use a semantic alternative for list items. Only render a `<ul>` or `<ol>` if the content is truly a list of items, and only if each direct child is a `<li>` element.