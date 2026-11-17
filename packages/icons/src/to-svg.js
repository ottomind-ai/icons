// Framework-agnostic renderer: icon node -> SVG markup string.
// Works in the browser, Node, edge runtimes and template engines.

const GRID = 16;

const escapeAttr = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const escapeText = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const attrs = (obj) =>
  Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null && v !== false)
    .map(([k, v]) => `${k}="${escapeAttr(v)}"`)
    .join(' ');

/**
 * Render an icon node to an SVG string.
 *
 * @param {import('./index').IconNode} iconNode
 * @param {import('./index').ToSvgOptions} [options]
 * @returns {string}
 */
export function toSvg(iconNode, options = {}) {
  const { size = GRID, color = 'currentColor', title, name, class: className, attributes = {} } = options;

  const rootAttrs = {
    xmlns: 'http://www.w3.org/2000/svg',
    width: size,
    height: size,
    viewBox: `0 0 ${GRID} ${GRID}`,
    fill: color,
    'shape-rendering': 'crispEdges',
    class: ['om-icon', name && `om-icon-${name}`, className].filter(Boolean).join(' '),
    'aria-hidden': title ? undefined : 'true',
    role: title ? 'img' : undefined,
    ...attributes,
  };

  const children = iconNode.map(([tag, nodeAttrs]) => `<${tag} ${attrs(nodeAttrs)}/>`).join('');
  const titleTag = title ? `<title>${escapeText(title)}</title>` : '';
  return `<svg ${attrs(rootAttrs)}>${titleTag}${children}</svg>`;
}
