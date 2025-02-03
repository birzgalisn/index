import { Breakout } from '~/components/breakout';
import { FloatingLinks } from '~/components/floating-links';

const WORDS = ['NIKS BIRZGALIS', 'DELIVERING SOLUTIONS'];

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Breakout
        words={WORDS}
        aria-label="Niks Birzgalis: Delivering solutions"
      />

      <FloatingLinks />
    </main>
  );
}
