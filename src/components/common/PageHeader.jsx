/*
  ===== PAGE HEADER =====

  Har inner page (Movies, Trending, Watchlist...) ke upar
  ek heading aur uske niche chhoti si line aati hai.

  Same design har page par rakhne ke liye ise alag component bana diya.
*/
export default function PageHeader({ title, subtitle, children }) {
  return (
    <div className="fade-in mb-6 px-4 md:px-10">
      {/* Heading hamare display font (Sofia Pro) me */}
      <h1 className="text-display text-main text-3xl font-bold sm:text-4xl">{title}</h1>

      {subtitle && <p className="text-sub mt-2 text-sm">{subtitle}</p>}

      {/* children me extra cheezein aa sakti hain, jaise category buttons */}
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}
