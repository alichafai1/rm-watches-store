import { describe, expect, it } from "vitest";
import {
  getStorefrontImageUrl,
  getSupabaseTransformUrl,
  isSupabasePublicStorageUrl,
} from "@/lib/images/supabase-transform";

const objectUrl =
  "https://jolmyqqzsqvyapoixnqh.supabase.co/storage/v1/object/public/website-media/Richard%20Mille%20Replica.webp";

describe("getSupabaseTransformUrl", () => {
  it("rewrites object URLs to render URLs with query params", () => {
    const result = getSupabaseTransformUrl(objectUrl, {
      width: 640,
      quality: 80,
      resize: "contain",
    });

    expect(result).toContain("/storage/v1/render/image/public/website-media/");
    expect(result).toContain("width=640");
    expect(result).toContain("quality=80");
    expect(result).toContain("resize=contain");
    expect(result).not.toContain("/object/public/");
  });

  it("leaves local paths unchanged", () => {
    expect(getSupabaseTransformUrl("/images/logo.png", { width: 100 })).toBe(
      "/images/logo.png",
    );
  });

  it("leaves non-Supabase URLs unchanged", () => {
    const external = "https://cdn.example.com/watch.webp";
    expect(getSupabaseTransformUrl(external, { width: 100 })).toBe(external);
  });
});

describe("getStorefrontImageUrl", () => {
  it("applies named presets", () => {
    const result = getStorefrontImageUrl(objectUrl, "productCard");
    expect(result).toContain("width=640");
    expect(result).toContain("quality=80");
  });

  it("applies the reviewGrid preset for listing tiles", () => {
    const result = getStorefrontImageUrl(objectUrl, "reviewGrid");
    expect(result).toContain("width=480");
    expect(result).toContain("quality=75");
  });
});

describe("isSupabasePublicStorageUrl", () => {
  it("detects object and render URLs", () => {
    expect(isSupabasePublicStorageUrl(objectUrl)).toBe(true);
    expect(
      isSupabasePublicStorageUrl(
        objectUrl.replace("/object/public/", "/render/image/public/"),
      ),
    ).toBe(true);
    expect(isSupabasePublicStorageUrl("/images/logo.png")).toBe(false);
  });
});
