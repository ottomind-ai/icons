// Base factory for every generated icon component.
// No React context on purpose: icons stay usable in React Server Components.

import { createElement, forwardRef } from 'react';

const GRID = 16;

/**
 * @param {string} name        kebab-case icon name, e.g. "arrow-right"
 * @param {string} displayName PascalCase component name, e.g. "ArrowRight"
 * @param {Array<[string, Record<string, string>]>} iconNode  children of the <svg>
 */
export function createIcon(name, displayName, iconNode) {
  const Icon = forwardRef(function OttomindIcon(props, ref) {
    const { size = GRID, color = 'currentColor', title, className, children, ...rest } = props;
    const labelled = Boolean(title || rest['aria-label'] || rest['aria-labelledby']);

    return createElement(
      'svg',
      {
        ref,
        xmlns: 'http://www.w3.org/2000/svg',
        width: size,
        height: size,
        viewBox: `0 0 ${GRID} ${GRID}`,
        fill: color,
        shapeRendering: 'crispEdges',
        className: ['om-icon', `om-icon-${name}`, className].filter(Boolean).join(' '),
        'aria-hidden': labelled ? undefined : true,
        role: labelled ? 'img' : undefined,
        ...rest,
      },
      title ? createElement('title', null, title) : null,
      ...iconNode.map(([tag, attrs], i) => createElement(tag, { key: i, ...attrs })),
      children,
    );
  });
  Icon.displayName = displayName;
  return Icon;
}
