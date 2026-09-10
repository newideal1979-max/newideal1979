import { useSiteSettings } from "../contexts/SiteSettingsContext";

export default function About() {
  const settings = useSiteSettings();
  return (
    <div className="container-institute py-16 lg:py-24">
      <h1 className="font-display text-4xl text-fabric-100">Our Story</h1>
      <div className="mt-8 max-w-2xl space-y-5 leading-relaxed text-fabric-300">
        <p>
          New Ideal Cutting and Stitching Institute began in {settings.foundedYear} in Ahmedabad, started by{" "}
          {settings.founder}. For decades, the institute has focused on practical, hands-on tailoring
          education — taught the way tailoring has always been best taught: by doing it.
        </p>
        <p>
          Today, the institute continues its work under {settings.currentDirector}, {settings.founder}'s son,
          who has carried the same practical teaching approach forward.
        </p>
        <p>
          After decades of offline classes on Relief Road, the institute is now opening its doors to
          students everywhere through online learning — the same curriculum, the same standards, now
          reachable from anywhere.
        </p>
      </div>
    </div>
  );
}
