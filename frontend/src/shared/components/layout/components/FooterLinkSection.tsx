import type { FooterMessageKey } from '../constants';

interface FooterLinkSectionProps {
  title: string;
  items: Array<{ key: FooterMessageKey; label: string }>;
  onOpen: (key: FooterMessageKey) => void;
}

// Renders one footer column of policy/support actions that open shared modal content.
function FooterLinkSection({ title, items, onOpen }: FooterLinkSectionProps) {
  return (
    <section className="text-center md:text-left">
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-700">
        {title}
      </h2>
      <ul className="mt-3 space-y-2 text-sm text-primary-600">
        {items.map((item) => (
          <li key={item.key}>
            <button
              type="button"
              onClick={() => onOpen(item.key)}
              className="bg-transparent text-primary-600 transition-colors hover:text-accent-700 focus-visible:outline-none focus-visible:text-accent-700"
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default FooterLinkSection;
