/** Children of the 16×16 <svg>: one path covering every filled pixel. */
export type IconNode = Array<[tag: string, attrs: Record<string, string>]>;

export interface ToSvgOptions {
  /** Width and height in px. Use multiples of 16 (16, 32, 48, 64) so pixels stay sharp. Default 16. */
  size?: number | string;
  /** Icon colour. Default `currentColor`. */
  color?: string;
  /** Accessible title. Without it the icon is aria-hidden. */
  title?: string;
  /** kebab-case icon name, adds the `om-icon-<name>` class. */
  name?: string;
  /** Extra class names. */
  class?: string;
  /** Extra attributes on the root <svg>. */
  attributes?: Record<string, string | number>;
}

export declare function toSvg(iconNode: IconNode, options?: ToSvgOptions): string;
