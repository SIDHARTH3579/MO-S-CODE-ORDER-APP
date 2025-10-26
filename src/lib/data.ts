import type { User, Product, Order } from "@/types";
import { PlaceHolderImages } from "./placeholder-images";

const getImage = (id: string) => {
    const img = PlaceHolderImages.find(p => p.id === id);
    return {
        imageUrl: img?.imageUrl ?? "https://picsum.photos/seed/default/400/400",
        imageHint: img?.imageHint ?? "product photo"
    }
}

export const users: User[] = [
  { id: "user_1", name: "Alice (Agent)", email: "alice@example.com", role: "agent" },
  { id: "user_2", name: "Bob (Admin)", email: "bob@example.com", role: "admin" },
  { id: "user_3", name: "Charlie (Agent)", email: "charlie@example.com", role: "agent" },
];

export const products: Product[] = [
  {
    id: "prod_001",
    name: "Luminous Silk Lipstick",
    description: "A vibrant and long-lasting lipstick with a silky smooth finish. Enriched with vitamin E to keep your lips hydrated.",
    category: "Lipstick",
    shades: ["Ruby Red", "Coral Kiss", "Nude Blush", "Deep Plum", "Rose Petal", "Brick Red", "Mauve Mist", "Sunset Orange", "Fuchsia Flash", "Vintage Wine"],
    price: 24.99,
    ...getImage("prod_001"),
  },
  {
    id: "prod_002",
    name: "Flawless Finish Foundation",
    description: "A high-coverage, lightweight foundation that provides a flawless, natural-looking finish that lasts all day.",
    category: "Foundation",
    shades: ["Ivory", "Beige", "Sand", "Mocha", "Caramel"],
    price: 39.99,
    ...getImage("prod_002"),
  },
  {
    id: "prod_003",
    name: "Sky High Mascara",
    description: "A lengthening and volumizing mascara that gives you dramatic, sky-high lashes with just one coat.",
    category: "Mascara",
    shades: [],
    price: 12.99,
    ...getImage("prod_003"),
  },
  {
    id: "prod_004",
    name: "Everyday Neutrals Eyeshadow Palette",
    description: "A versatile palette of 12 neutral eyeshadows in matte and shimmer finishes, perfect for any occasion.",
    category: "Eyeshadow",
    shades: [],
    price: 45.0,
    ...getImage("prod_004"),
  },
  {
    id: "prod_005",
    name: "Petal-Soft Blush",
    description: "A finely-milled powder blush that gives a natural, rosy flush to the cheeks. Buildable and blendable.",
    category: "Blush",
    shades: ["Rose Pink", "Peach Keen", "Berry Mauve"],
    price: 18.5,
    ...getImage("prod_005"),
  },
  {
    id: "prod_006",
    name: "Precision Point Eyeliner",
    description: "A waterproof liquid eyeliner with a fine-tipped brush for creating sharp, precise lines with ease.",
    category: "Eyeliner",
    shades: ["Onyx Black", "Espresso Brown"],
    price: 21.0,
    ...getImage("prod_006"),
  },
  {
    id: "prod_007",
    name: "Hydra-Prep Primer",
    description: "A hydrating face primer that creates a smooth canvas for makeup application and extends wear time.",
    category: "Primer",
    shades: [],
    price: 32.0,
    ...getImage("prod_007"),
  },
  {
    id: "prod_008",
    name: "All-Nighter Setting Spray",
    description: "A microfine mist that locks in your makeup, preventing fading, smudging, or settling into fine lines.",
    category: "Setting Spray",
    shades: [],
    price: 33.0,
    ...getImage("prod_008"),
  },
  {
    id: "prod_009",
    name: "Gloss Bomb Nail Polish",
    description: "A high-shine, long-wearing nail polish that delivers a gel-like finish without the need for a UV lamp.",
    category: "Nail Polish",
    shades: ["Candy Apple Red", "Ballet Slipper Pink", "Midnight Blue", "Silver Chrome", "Gold Dust", "Mint Green", "Lavender Dream"],
    price: 15.0,
    ...getImage("prod_009"),
  },
];
