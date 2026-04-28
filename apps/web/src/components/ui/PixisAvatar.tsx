import clsx from "clsx";
import { Zap } from "lucide-react";


export const PixisAvatar = ({ size = 28 }: { size?: number }) => (
  <div
    className="rounded-lg bg-stone-900 flex items-center justify-center flex-shrink-0"
    style={{ width: size, height: size }}
  >
    <Zap size={size * 0.46} className="text-white" />
  </div>
)

export const Pixis = ({ size = 'sm' }:{ size?: 'xs' | 'sm' | 'md' | 'lg'; }) => {
  return <div className={clsx('uppercase tracking-widest font-medium', `text-${size}`)}>
    PIXIS 
  </div>
}
