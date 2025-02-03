import { BACKGROUND_COLOR } from '~/constants/breakout';
import { BrekaoutCanvasProps } from '~/components/breakout';
import { PixelText } from '~/components/pixel-text';

export function BreakoutLoading({ words }: Pick<BrekaoutCanvasProps, 'words'>) {
  const [title, subtitle] = words;

  return (
    <div
      className="flex min-h-dvh w-full flex-col items-center justify-center gap-6"
      style={{ backgroundColor: BACKGROUND_COLOR }}
    >
      <PixelText size={4} text={title} />
      <PixelText size={2} text={subtitle} />
    </div>
  );
}
