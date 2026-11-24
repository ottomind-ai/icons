// Type-level smoke test: compiled with `tsc --noEmit` by scripts/test.mjs.
import { useRef } from 'react';
import { ArrowRight, BellIcon, createIcon, type IconName, type IconProps, type OttomindIcon } from '@ottomind-ai/icons-react';
import Sparkle from '@ottomind-ai/icons-react/icons/sparkle';
import { arrowRight, toSvg, type IconNode } from '@ottomind-ai/icons';

export function Example(props: IconProps) {
  const ref = useRef<SVGSVGElement>(null);
  const Custom: OttomindIcon = createIcon('custom', 'Custom', [['path', { d: 'M1 1h14v1h-14z' }]]);
  const node: IconNode = arrowRight;
  const name: IconName = 'arrow-right';
  const markup: string = toSvg(node, { size: 32, color: 'red', title: 'Next', name });
  return (
    <div data-markup={markup}>
      <ArrowRight ref={ref} size={32} className="x" onClick={() => {}} />
      <BellIcon color="#b3202a" title="Notifications" />
      <Sparkle {...props} />
      <Custom />
      {/* @ts-expect-error a typed icon, not `any`: size is a number or a string */}
      <Sparkle size={{}} />
    </div>
  );
}
