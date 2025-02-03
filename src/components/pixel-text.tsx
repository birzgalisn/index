import { COLOR, LETTER_SPACING } from '~/constants/breakout';
import { PIXEL_MAP } from '~/constants/pixel-map';

export function PixelText({
  text,
  size = 8,
  className = '',
}: {
  text: string;
  size?: number;
  className?: string;
}) {
  return (
    <div className={`flex ${className}`}>
      {text.split('').map((letter, i) => {
        const pixelMap = PIXEL_MAP[letter];

        if (!pixelMap) {
          return null;
        }

        return (
          <div
            key={`pixel-${letter}-${i}`}
            style={{ marginRight: LETTER_SPACING * size }}
          >
            {pixelMap.map((row, rowIndex) => (
              <div key={`pixel-${letter}-${i}-${rowIndex}`} className="flex">
                {row.map((pixel, pixelIndex) => (
                  <div
                    key={`pixel-${letter}-${i}-${rowIndex}-${pixelIndex}`}
                    className="animate-pulse"
                    style={{
                      width: size,
                      height: size,
                      backgroundColor: pixel ? COLOR : 'transparent',
                      animationDelay: `${(rowIndex * row.length + pixelIndex) * 50}ms`,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
