/**
 * Unique hub-card blurbs. Kept separate from collection.description / about
 * so individual collection pages are not overwritten.
 */
export const collectionCardCopy: Record<string, string> = {
  "RM 21-01":
    "Explore RM 21-01 replica watches inspired by the Aerodyne tourbillon, often searched as the RM21 watch, with honeycomb skeleton details.",
  "RM 56-01":
    "Shop Richard Mille RM 56-01 replica watches with fully open sapphire-style cases and airy tourbillon architecture.",
  "RM 56-02":
    "Browse Richard Mille RM 56 02 replica watches with later crystal-inspired cases and open skeleton finishing.",
  "RM 52-01":
    "Shop the RM 52 01 skull tourbillon collection, a skull Richard Mille watch with Vanitas-inspired carving.",
  "RM 52-06":
    "Explore Richard Mille RM 52-06 replica watches with mask-inspired skull styling and bold case sculpture.",
  "RM 001":
    "Discover RM 001 replica watches, the first Richard Mille tourbillon silhouette with an open skeleton case.",
  "RM 002":
    "Browse Richard Mille RM 002 replica watches with early tonneau cases and classic skeleton architecture.",
  "RM 67":
    "Shop RM 67 replica watches, including ultra-thin RM 67-02 extra-flat skeleton styles in multiple colorways.",
  "RM 007":
    "Explore Richard Mille RM 007 replica watches with compact early skeleton cases, separate from later 07-series models.",
  "RM 47":
    "Shop RM 47 replica watches with carved dragon-motif cases, open skeleton dials, and tourbillon-inspired finishing.",
  "RM 38":
    "Browse Richard Mille RM 38 replica watches with racing-inspired skeleton cases and high-contrast sport finishing.",
  "RM 027":
    "Explore original Richard Mille RM 027 replica watches from the first Nadal tourbillon line, with ultra-light sports cases.",
  "RM 11-04":
    "Shop Richard Mille RM 11-04 replica watches with flyback chronograph cases and open sports skeleton dials.",
  "RM 11-02":
    "Browse Richard Mille RM 11 02 replica watches, the earlier flyback chronograph with a compact sports case.",
  "RM 022":
    "Shop RM-022 and Richard Mille RM 022 replica watches with dual-time travel cases and carbon-inspired finishing.",
  "RM 023":
    "Explore Richard Mille RM 023 replica watches with everyday skeleton cases and refined tonneau styling.",
  "RM 026":
    "Shop Richard Mille RM 026 replica watches with Serpent-inspired extreme skeleton cases and sculptural finishing.",
  "RM 030":
    "Browse Richard Mille RM 030 replica watches with declutchable-rotor sports cases and open automatic dials.",
  "RM 035":
    "Shop RM 035 replica watches, the original Nadal automatic line, with lightweight sports skeleton styling.",
  "RM 037":
    "Explore Richard Mille RM 037 replica watches with diamond-set ladies and unisex tonneau cases and open dials.",
  "RM 07-01":
    "Shop Richard Mille RM 07-01 replica watches with compact ceramic and diamond-set ladies tonneau cases.",
  "RM 07-02":
    "Browse RM 07 02 replica watches with transparent-style cases, jewel-inspired accents, and feminine skeleton dials.",
  "RM 07-03":
    "Explore Richard Mille RM 07-03 replica watches with pastel Marshmallow ceramic cases and playful compact styling.",
  "RM 26-01":
    "Shop the RM 26 01 tourbillon panda collection, including Richard Mille panda replica watches with jewelry-sports finishing.",
  "RM 51-01":
    "Browse the RM 51 01 tourbillon Michelle Yeoh collection with tiger-and-dragon case art and open movements.",
  "RM 51-02":
    "Shop Richard Mille RM 51-02 replica watches with Diamond Twister swirl-set tourbillon cases and jewelry finishing.",
  "RM 57-01":
    "Explore Richard Mille RM 57-01 replica watches with rose-gold dragon tourbillon cases and diamond-set finishing.",
  "RM 57-03":
    "Shop RM 57-03 replica watches with red-quartz dragon tourbillon cases and open skeleton movements visible at the wrist.",
  "RM 12-01":
    "Explore RM 12-01 replica watches inspired by the distinctive skeleton architecture of the Richard Mille RM 12-01, also searched as RM 1201.",
  "RM 50-02":
    "Browse Richard Mille RM 50-02 replica watches with Airbus-inspired split-seconds chronograph cases and open movements.",
  "RM 16-02":
    "Shop RM 16-02 and RM16-02 replica watches, the ultra-thin automatic extra-flat skeleton collection for everyday wear.",
  "RM 19-02":
    "Explore Richard Mille RM 19-02 replica watches with floral tourbillon art and open skeleton cases.",
  "RM 27-04":
    "Browse Richard Mille RM 27-04 replica watches from the later Nadal performance line, with ultra-light sports cases.",
  "RM 30-01":
    "Shop RM 30-01 replica watches, the updated sports automatic with an openworked everyday case and rotor finishing.",
  "RM 40-01":
    "Explore Richard Mille 40 01 replica watches and the RM Speedtail watch look with automatic tourbillon styling.",
  "RM 50-03":
    "Shop RM 50-03 replica watches from the McLaren UltraLight line with racing skeleton cases and Graphene-inspired styling.",
  "RM 61-01":
    "Browse Richard Mille RM 61 01 replica watches with Yohan Blake inspired performance cases and open sports dials.",
  "RM 63-01":
    "Explore Richard Mille RM 63-01 replica watches with contemporary dual-time cases and modern skeleton finishing.",
  "RM 70-01":
    "Shop Richard Mille RM 70-01 replica watches from the Alain Prost inspired racing tourbillon line.",
  "RM 27-02":
    "Browse RM 27 02 and RM 27-02 replica watches, the double-case Nadal tourbillon collection with ultra-light sports construction.",
};

export function getCollectionCardDescription(name: string): string | undefined {
  return collectionCardCopy[name];
}
