/**
 * Short header taglines for collection pages (one phrase each).
 * Keyed by collection display name.
 */
export const collectionTaglines: Record<string, string> = {
  "RM 21-01":
    "Discover the best super clone Richard Mille RM 21-01 and experience its Aerodyne tourbillon design.",
  "RM 56-01":
    "Discover the best super clone Richard Mille RM 56-01 and admire its fully transparent sapphire case.",
  "RM 56-02":
    "Discover the best super clone Richard Mille RM 56-02 and explore its crystal-clear skeleton architecture.",
  "RM 52-01":
    "Discover the best super clone Richard Mille RM 52-01 and shop the iconic Skull tourbillon series.",
  "RM 52-06":
    "Discover the best super clone Richard Mille RM 52-06 and find bold skull-inspired luxury styling.",
  "RM 001":
    "Discover the best super clone Richard Mille RM 001 and own a piece of tourbillon history.",
  "RM 002":
    "Discover the best super clone Richard Mille RM 002 and enjoy classic tonneau elegance.",
  "RM 67":
    "Discover the best super clone Richard Mille RM 67 and wear an ultra-thin skeleton masterpiece.",
  "RM 007":
    "Discover the best super clone Richard Mille RM 007 and explore refined skeleton craftsmanship.",
  "RM 47":
    "Discover the best super clone Richard Mille RM 47 and celebrate its striking dragon motif design.",
  "RM 38":
    "Discover the best super clone Richard Mille RM 38 and feel the spirit of high-performance racing.",
  "RM 027":
    "Discover the best super clone Richard Mille RM 027 and shop the legendary Nadal collection.",
  "RM 11-04":
    "Shop Richard Mille RM 11-04 replica watches here. The listed RM 11-04 replica watch has a tonneau carbon-fiber case, an open skeleton dial with luminous Arabic numerals, and a blue rubber strap. Compare the photos, listed specifications, and quality options before you order.",
  "RM 11-02":
    "Discover the best super clone Richard Mille RM 11-02 and enjoy bold modern flyback design.",
  "RM 022":
    "Discover the best super clone Richard Mille RM 022 and experience dual-time travel ready luxury.",
  "RM 023":
    "Discover the best super clone Richard Mille RM 023 and discover elegant everyday skeleton wear.",
  "RM 026":
    "Discover the best super clone Richard Mille RM 026 and explore its distinctive extreme design.",
  "RM 030":
    "Discover the best super clone Richard Mille RM 030 and enjoy a versatile modern sports look.",
  "RM 035":
    "Discover the best super clone Richard Mille RM 035 and shop a sleek automatic statement piece.",
  "RM 037":
    "Discover the best super clone Richard Mille RM 037 and find refined ladies and unisex styling.",
  "RM 07-01":
    "Discover the best super clone Richard Mille RM 07-01 and shop elegant compact luxury design.",
  "RM 07-02":
    "Discover the best super clone Richard Mille RM 07-02 and explore diamond-inspired feminine detail.",
  "RM 07-03":
    "Discover the best super clone Richard Mille RM 07-03 and enjoy a fresh take on RM elegance.",
  "RM 26-01":
    "Discover the best super clone Richard Mille RM 26-01 and experience bold adventure-ready styling.",
  "RM 51-01":
    "Discover the best super clone Richard Mille RM 51-01 and celebrate tiger-and-dragon artistry.",
  "RM 51-02":
    "Discover the best super clone Richard Mille RM 51-02 and shop dazzling diamond swirl design.",
  "RM 57-01":
    "Discover the best super clone Richard Mille RM 57-01 and explore sculptural tourbillon presence.",
  "RM 57-03":
    "Discover the best super clone Richard Mille RM 57-03 and discover dragon skeleton craftsmanship.",
  "RM 12-01":
    "Discover the best super clone Richard Mille RM 12-01 and enjoy complex mechanical showmanship.",
  "RM 50-02":
    "Discover the best super clone Richard Mille RM 50-02 and shop ACJ-inspired aviation luxury.",
  "RM 16-02":
    "Discover the best super clone Richard Mille RM 16-02 and experience extreme ultralight design.",
  "RM 19-02":
    "Discover the best super clone Richard Mille RM 19-02 and explore refined tourbillon artistry.",
  "RM 27-04":
    "Discover the best super clone Richard Mille RM 27-04 and shop Nadal-level performance style.",
  "RM 30-01":
    "Discover the best super clone Richard Mille RM 30-01 and enjoy adaptable modern wrist presence.",
  "RM 40-01":
    "Discover the best super clone Richard Mille RM 40-01 and discover McLaren-inspired racing energy.",
  "RM 50-03":
    "Discover the best super clone Richard Mille RM 50-03 and shop aviation-inspired luxury detail.",
  "RM 61-01":
    "Discover the best super clone Richard Mille RM 61-01 and experience Yohan Blake inspired power.",
  "RM 63-01":
    "Discover the best super clone Richard Mille RM 63-01 and enjoy distinctive contemporary design.",
  "RM 70-01":
    "Discover the best super clone Richard Mille RM 70-01 and explore Alain Prost racing heritage.",
  "RM 27-02":
    "Discover the best super clone Richard Mille RM 27-02 and shop iconic Nadal tourbillon style.",
};

export function getCollectionTagline(name: string): string {
  return (
    collectionTaglines[name] ??
    `Discover the best super clone Richard Mille ${name} and shop our carefully selected replicas.`
  );
}
