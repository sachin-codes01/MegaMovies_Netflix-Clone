import { memo } from "react";
import { getProfileUrl } from "../../utils/helpers";

/*
  ===== CAST LIST =====

  Movie Details page par actors ki photos aur naam dikhata hai.
  Side me scroll hone wali chhoti si row hai.
*/
function CastList({ cast }) {
  // Cast ki information nahi mili to section hi mat dikhao
  if (!cast || cast.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="text-display text-main mb-4 text-xl font-bold">Cast</h2>

      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
        {cast.map((person) => (
          <div key={person.id} className="w-[110px] shrink-0 text-center">
            <img
              src={getProfileUrl(person.profile_path)}
              alt={person.name}
              loading="lazy"
              className="bg-card-2 h-[110px] w-[110px] rounded-full object-cover shadow-md transition-transform duration-300 hover:scale-105"
            />

            {/* Actor ka asli naam */}
            <p className="text-main clamp-2 mt-2 text-xs font-medium">{person.name}</p>

            {/* Movie me uska character ka naam */}
            <p className="text-sub clamp-2 mt-0.5 text-[11px]">{person.character}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default memo(CastList);
