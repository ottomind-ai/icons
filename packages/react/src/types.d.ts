import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  /** Width and height in px. Use multiples of 16 (16, 32, 48, 64) so pixels stay sharp. Default 16. */
  size?: number | string;
  /** Icon colour. Default `currentColor`. */
  color?: string;
  /** Accessible title. Without it (or aria-label) the icon is aria-hidden. */
  title?: string;
}

export type OttomindIcon = ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;

export type IconNode = Array<[tag: string, attrs: Record<string, string>]>;

export declare function createIcon(name: string, displayName: string, iconNode: IconNode): OttomindIcon;
