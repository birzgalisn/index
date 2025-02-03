'use client';

import { useEffect, useRef } from 'react';
import {
  BACKGROUND_COLOR,
  BALL_COLOR,
  COLOR,
  HIT_COLOR,
  LETTER_SPACING,
  PADDLE_COLOR,
  WORD_SPACING,
} from '~/constants/breakout';
import { PIXEL_MAP } from '~/constants/pixel-map';
import { callAll } from '~/lib/call-all';
import { withNoSSR } from '~/hoc/with-no-ssr';
import { BreakoutLoading } from '~/components/breakout-loading';

type Pixel = {
  x: number;
  y: number;
  size: number;
  hit: boolean;
};

type Ball = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
};

type Paddle = {
  x: number;
  y: number;
  width: number;
  height: number;
  targetY: number;
  isVertical: boolean;
};

export type BrekaoutCanvasProps = {
  words: string[];
} & React.HTMLAttributes<HTMLCanvasElement>;

function BreakoutCanvas({
  words,
  className = '',
  ...props
}: BrekaoutCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const ballRef = useRef<Ball>({ x: 0, y: 0, dx: 0, dy: 0, radius: 0 });
  const paddlesRef = useRef<Paddle[]>([]);
  const scaleRef = useRef(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = innerWidth;
      canvas.height = innerHeight;
      scaleRef.current = Math.min(canvas.width / 1000, canvas.height / 1000);
    };

    const calculateWordWidth = (word: string, pixelSize: number) => {
      return (
        word.split('').reduce((width, letter) => {
          const [row = []] = PIXEL_MAP[letter] || [];
          return width + row.length * pixelSize + LETTER_SPACING * pixelSize;
        }, 0) -
        LETTER_SPACING * pixelSize
      );
    };

    const createPixelsForWord = (
      word: string,
      startX: number,
      startY: number,
      pixelSize: number,
    ) => {
      const pixels: Pixel[] = [];
      let currentX = startX;

      for (const letter of word.split('')) {
        const letterPixelMap = PIXEL_MAP[letter];
        if (!letterPixelMap) continue;

        for (let rowIndex = 0; rowIndex < letterPixelMap.length; rowIndex++) {
          const row = letterPixelMap[rowIndex];

          for (let colIndex = 0; colIndex < row.length; colIndex++) {
            if (row[colIndex]) {
              pixels.push({
                x: currentX + colIndex * pixelSize,
                y: startY + rowIndex * pixelSize,
                size: pixelSize,
                hit: false,
              });
            }
          }
        }

        const [firstRow] = letterPixelMap;
        currentX += (firstRow.length + LETTER_SPACING) * pixelSize;
      }

      return { pixels, endX: currentX } as const;
    };

    const initializeGame = () => {
      pixelsRef.current = [];

      const scale = scaleRef.current;
      const LARGE_PIXEL_SIZE = 8 * scale;
      const SMALL_PIXEL_SIZE = 4 * scale;
      const BALL_SPEED = 6 * scale;

      // Calculate total width needed
      const [largeWord, ...smallWords] = words;
      const firstWordWidth = calculateWordWidth(largeWord, LARGE_PIXEL_SIZE);
      const remainingWordsWidth = smallWords.reduce((total, word, idx) => {
        const spacing = idx > 0 ? WORD_SPACING * SMALL_PIXEL_SIZE : 0;
        return total + calculateWordWidth(word, SMALL_PIXEL_SIZE) + spacing;
      }, 0);

      const totalWidth = Math.max(firstWordWidth, remainingWordsWidth);
      const scaleFactor = (canvas.width * 0.8) / totalWidth;

      const adjustedLargePixelSize = LARGE_PIXEL_SIZE * scaleFactor;
      const adjustedSmallPixelSize = SMALL_PIXEL_SIZE * scaleFactor;

      // Calculate vertical positioning
      const largeTextHeight = 5 * adjustedLargePixelSize;
      const smallTextHeight = 5 * adjustedSmallPixelSize;
      const spaceBetweenLines = 5 * adjustedLargePixelSize;
      const totalHeight =
        largeTextHeight +
        spaceBetweenLines +
        (smallWords.length > 0 ? smallTextHeight : 0);

      let startY = (canvas.height - totalHeight) / 2;

      // Create pixels for first word (large)
      const firstWordStartX =
        (canvas.width - calculateWordWidth(largeWord, adjustedLargePixelSize)) /
        2;

      const { pixels: firstWordPixels } = createPixelsForWord(
        largeWord,
        firstWordStartX,
        startY,
        adjustedLargePixelSize,
      );

      pixelsRef.current.push(...firstWordPixels);

      // Create pixels for remaining words (small)
      if (smallWords.length) {
        startY += largeTextHeight + spaceBetweenLines;
        let currentX = (canvas.width - remainingWordsWidth * scaleFactor) / 2;

        for (const word of smallWords) {
          const { pixels, endX } = createPixelsForWord(
            word,
            currentX,
            startY,
            adjustedSmallPixelSize,
          );

          pixelsRef.current.push(...pixels);

          currentX = endX + WORD_SPACING * adjustedSmallPixelSize;
        }
      }

      // Initialize ball
      ballRef.current = {
        x: canvas.width * 0.9,
        y: canvas.height * 0.1,
        dx: -BALL_SPEED,
        dy: BALL_SPEED,
        radius: adjustedLargePixelSize / 2,
      };

      // Initialize paddles
      const paddleWidth = adjustedLargePixelSize;
      const paddleLength = 10 * adjustedLargePixelSize;

      paddlesRef.current = [
        // Left paddle
        {
          x: 0,
          y: canvas.height / 2 - paddleLength / 2,
          width: paddleWidth,
          height: paddleLength,
          targetY: canvas.height / 2 - paddleLength / 2,
          isVertical: true,
        },
        // Right paddle
        {
          x: canvas.width - paddleWidth,
          y: canvas.height / 2 - paddleLength / 2,
          width: paddleWidth,
          height: paddleLength,
          targetY: canvas.height / 2 - paddleLength / 2,
          isVertical: true,
        },
        // Top paddle
        {
          x: canvas.width / 2 - paddleLength / 2,
          y: 0,
          width: paddleLength,
          height: paddleWidth,
          targetY: canvas.width / 2 - paddleLength / 2,
          isVertical: false,
        },
        // Bottom paddle
        {
          x: canvas.width / 2 - paddleLength / 2,
          y: canvas.height - paddleWidth,
          width: paddleLength,
          height: paddleWidth,
          targetY: canvas.width / 2 - paddleLength / 2,
          isVertical: false,
        },
      ];
    };

    const updateGame = () => {
      const ball = ballRef.current;
      const paddles = paddlesRef.current;

      // Update ball position
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Ball collision with canvas boundaries
      if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy = -ball.dy;
      }
      if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        ball.dx = -ball.dx;
      }

      // Ball collision with paddles
      for (const paddle of paddles) {
        if (paddle.isVertical) {
          if (
            ball.x - ball.radius < paddle.x + paddle.width &&
            ball.x + ball.radius > paddle.x &&
            ball.y > paddle.y &&
            ball.y < paddle.y + paddle.height
          ) {
            ball.dx = -ball.dx;
          }
        } else {
          if (
            ball.y - ball.radius < paddle.y + paddle.height &&
            ball.y + ball.radius > paddle.y &&
            ball.x > paddle.x &&
            ball.x < paddle.x + paddle.width
          ) {
            ball.dy = -ball.dy;
          }
        }
      }

      // Update paddle positions
      for (const paddle of paddles) {
        if (paddle.isVertical) {
          paddle.targetY = ball.y - paddle.height / 2;
          paddle.targetY = Math.max(
            0,
            Math.min(canvas.height - paddle.height, paddle.targetY),
          );
          paddle.y += (paddle.targetY - paddle.y) * 0.1;
        } else {
          paddle.targetY = ball.x - paddle.width / 2;
          paddle.targetY = Math.max(
            0,
            Math.min(canvas.width - paddle.width, paddle.targetY),
          );
          paddle.x += (paddle.targetY - paddle.x) * 0.1;
        }
      }

      // Ball collision with pixels
      for (const pixel of pixelsRef.current) {
        if (
          !pixel.hit &&
          ball.x + ball.radius > pixel.x &&
          ball.x - ball.radius < pixel.x + pixel.size &&
          ball.y + ball.radius > pixel.y &&
          ball.y - ball.radius < pixel.y + pixel.size
        ) {
          pixel.hit = true;

          const centerX = pixel.x + pixel.size / 2;
          const centerY = pixel.y + pixel.size / 2;

          if (Math.abs(ball.x - centerX) > Math.abs(ball.y - centerY)) {
            ball.dx = -ball.dx;
          } else {
            ball.dy = -ball.dy;
          }
        }
      }
    };

    const drawGame = () => {
      if (!ctx) return;

      // Clear canvas
      ctx.fillStyle = BACKGROUND_COLOR;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw pixels
      for (const pixel of pixelsRef.current) {
        ctx.fillStyle = pixel.hit ? HIT_COLOR : COLOR;
        ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);
      }

      // Draw ball
      ctx.fillStyle = BALL_COLOR;
      ctx.beginPath();
      ctx.arc(
        ballRef.current.x,
        ballRef.current.y,
        ballRef.current.radius,
        0,
        Math.PI * 2,
      );
      ctx.fill();

      // Draw paddles
      ctx.fillStyle = PADDLE_COLOR;
      for (const paddle of paddlesRef.current) {
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
      }
    };

    const prepareGame = callAll(resizeCanvas, initializeGame);

    const gameLoop = () => {
      callAll(updateGame, drawGame)();
      requestAnimationFrame(gameLoop);
    };

    callAll(prepareGame, gameLoop)();
    addEventListener('resize', prepareGame);

    return () => {
      removeEventListener('resize', prepareGame);
    };
  }, [words]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed top-0 left-0 h-full w-full ${className}`}
      {...props}
    />
  );
}

export function Breakout(props: BrekaoutCanvasProps) {
  const Component = withNoSSR(BreakoutCanvas, {
    loading: () => <BreakoutLoading {...props} />,
  });

  return <Component {...props} />;
}
