/**
 * Seeds the menu collections (categories, optionGroups, options, menuItems)
 * with real copy/prices pulled from design/Nook-standalone-src.dc.html.
 *
 * Dry-run by default — only writes to Firestore with an explicit --apply
 * flag. Doc IDs are deterministic natural slugs, so re-running --apply is
 * a safe upsert, not an additive duplicate-creator.
 *
 * Usage:
 *   bun run scripts/seed-menu.ts            # dry run, no writes
 *   bun run scripts/seed-menu.ts --apply     # writes to Firestore
 */
import { adminDb } from "../src/shared/lib/firebase-admin";
import { MENU_COLLECTIONS } from "../src/modules/menu/lib/collections";
import type { Category } from "../src/modules/menu/types/category";
import type { MenuItem } from "../src/modules/menu/types/menu-item";
import type { OptionGroup } from "../src/modules/menu/types/option-group";
import type { Option } from "../src/modules/menu/types/option";

const categories: Category[] = [
  { id: "coffee", name: "Coffee", displayOrder: 0, isActive: true },
  { id: "cold", name: "Tea & Cold", displayOrder: 1, isActive: true },
  { id: "breakfast", name: "Breakfast", displayOrder: 2, isActive: true },
  { id: "bakery", name: "Bakery", displayOrder: 3, isActive: true },
];

const options: Option[] = [
  { id: "size-small", optionGroupId: "size", name: "Small · 8oz", priceModifier: 0, isAvailable: true },
  { id: "size-regular", optionGroupId: "size", name: "Regular · 12oz", priceModifier: 0.6, isAvailable: true },
  { id: "size-large", optionGroupId: "size", name: "Large · 16oz", priceModifier: 1.1, isAvailable: true },

  { id: "milk-whole", optionGroupId: "milk", name: "Whole", priceModifier: 0, isAvailable: true },
  { id: "milk-skim", optionGroupId: "milk", name: "Skim", priceModifier: 0, isAvailable: true },
  { id: "milk-oat", optionGroupId: "milk", name: "Oat", priceModifier: 0.7, isAvailable: true },
  { id: "milk-almond", optionGroupId: "milk", name: "Almond", priceModifier: 0.7, isAvailable: true },
  { id: "milk-none", optionGroupId: "milk", name: "No milk", priceModifier: 0, isAvailable: true },

  { id: "addons-extra-shot", optionGroupId: "addons", name: "Extra shot", priceModifier: 0.8, isAvailable: true },
  { id: "addons-syrup", optionGroupId: "addons", name: "Vanilla or hazelnut syrup", priceModifier: 0.6, isAvailable: true },

  { id: "plate-extras-egg", optionGroupId: "plate-extras", name: "Extra poached egg", priceModifier: 3, isAvailable: true },
  { id: "plate-extras-avo", optionGroupId: "plate-extras", name: "Smashed avocado", priceModifier: 4, isAvailable: true },
  { id: "plate-extras-bacon", optionGroupId: "plate-extras", name: "Streaky bacon", priceModifier: 4.5, isAvailable: true },
  { id: "plate-extras-cream", optionGroupId: "plate-extras", name: "Double cream", priceModifier: 2, isAvailable: true },
];

const optionGroups: OptionGroup[] = [
  {
    id: "size",
    name: "Size",
    selectionType: "single",
    isRequired: true,
    minSelect: 1,
    maxSelect: 1,
    optionIds: ["size-small", "size-regular", "size-large"],
  },
  {
    id: "milk",
    name: "Milk",
    selectionType: "single",
    isRequired: true,
    minSelect: 1,
    maxSelect: 1,
    optionIds: ["milk-whole", "milk-skim", "milk-oat", "milk-almond", "milk-none"],
  },
  {
    id: "addons",
    name: "Add-ons",
    selectionType: "multiple",
    isRequired: false,
    minSelect: 0,
    maxSelect: 2,
    optionIds: ["addons-extra-shot", "addons-syrup"],
  },
  {
    id: "plate-extras",
    name: "Plate Extras",
    selectionType: "multiple",
    isRequired: false,
    minSelect: 0,
    maxSelect: 4,
    optionIds: ["plate-extras-egg", "plate-extras-avo", "plate-extras-bacon", "plate-extras-cream"],
  },
];

const menuItems: MenuItem[] = [
  {
    id: "flat-white",
    categoryId: "coffee",
    name: "Flat White",
    description: "Two ristretto shots, silky milk, no foam moustache.",
    basePrice: 4.2,
    images: ["/images/marketing/hero-latte-art.jpg"],
    dietaryTags: [],
    isAvailable: true,
    displayOrder: 0,
    optionGroupIds: ["size", "milk", "addons"],
  },
  {
    id: "batch-brew",
    categoryId: "coffee",
    name: "Batch Brew",
    description: "Whatever's in the grinder today. Bottomless before 9am.",
    basePrice: 3.6,
    images: ["/images/marketing/coffee-closeup.jpg"],
    dietaryTags: ["vegan", "dairy-free"],
    isAvailable: true,
    displayOrder: 1,
    optionGroupIds: [],
  },
  {
    id: "espresso",
    categoryId: "coffee",
    name: "Espresso",
    description: "Short, sweet, served with a thimble of soda water.",
    basePrice: 3.2,
    images: ["/images/marketing/coffee-closeup.jpg"],
    dietaryTags: ["vegan", "dairy-free", "gluten-free"],
    isAvailable: true,
    displayOrder: 2,
    optionGroupIds: [],
  },
  {
    id: "cold-brew",
    categoryId: "cold",
    name: "18-Hour Cold Brew",
    description: "Steeped overnight, poured over one big cube.",
    basePrice: 4.8,
    images: ["/images/marketing/coffee-closeup.jpg"],
    dietaryTags: ["vegan", "dairy-free"],
    isAvailable: false,
    displayOrder: 0,
    optionGroupIds: ["size"],
  },
  {
    id: "iced-matcha-latte",
    categoryId: "cold",
    name: "Iced Matcha Latte",
    description: "Ceremonial grade from Uji, lightly sweetened.",
    basePrice: 5.4,
    images: ["/images/marketing/coffee-closeup.jpg"],
    dietaryTags: ["gluten-free"],
    isAvailable: true,
    displayOrder: 1,
    optionGroupIds: ["size", "milk"],
  },
  {
    id: "egg-gruyere-muffin",
    categoryId: "breakfast",
    name: "Egg & Gruyère Muffin",
    description: "Folded egg, aged gruyère, chilli jam on a house bun.",
    basePrice: 8.5,
    images: ["/images/marketing/pastry-closeup.jpg"],
    dietaryTags: [],
    isAvailable: true,
    displayOrder: 0,
    optionGroupIds: ["plate-extras"],
  },
  {
    id: "caramel-french-toast",
    categoryId: "breakfast",
    name: "Caramel French Toast",
    description: "Brioche, burnt caramel, vanilla ice cream, berries.",
    basePrice: 15.5,
    images: ["/images/marketing/pastry-closeup.jpg"],
    dietaryTags: ["contains-nuts"],
    isAvailable: true,
    displayOrder: 1,
    optionGroupIds: [],
  },
  {
    id: "morning-bun",
    categoryId: "bakery",
    name: "Morning Bun",
    description: "Croissant dough rolled in orange and cinnamon sugar.",
    basePrice: 4.8,
    images: ["/images/marketing/pastry-closeup.jpg"],
    dietaryTags: [],
    isAvailable: true,
    displayOrder: 0,
    optionGroupIds: [],
  },
  {
    id: "almond-croissant",
    categoryId: "bakery",
    name: "Almond Croissant",
    description: "Twice-baked, frangipane inside, flaked almonds on top.",
    basePrice: 5.4,
    images: ["/images/marketing/pastry-closeup.jpg"],
    dietaryTags: ["contains-nuts"],
    isAvailable: true,
    displayOrder: 1,
    optionGroupIds: [],
  },
];

function withoutId<T extends { id: string }>({ id, ...rest }: T): Omit<T, "id"> {
  return rest;
}

async function main() {
  const apply = process.argv.includes("--apply");

  const writes = [
    ...categories.map((c) => ({ collection: MENU_COLLECTIONS.categories, doc: c })),
    ...optionGroups.map((g) => ({ collection: MENU_COLLECTIONS.optionGroups, doc: g })),
    ...options.map((o) => ({ collection: MENU_COLLECTIONS.options, doc: o })),
    ...menuItems.map((m) => ({ collection: MENU_COLLECTIONS.menuItems, doc: m })),
  ];

  console.log(
    `${apply ? "[apply]" : "[dry-run]"} ${writes.length} docs: ` +
      `${categories.length} categories, ${optionGroups.length} optionGroups, ` +
      `${options.length} options, ${menuItems.length} menuItems`,
  );
  console.log();

  for (const { collection, doc } of writes) {
    console.log(`  ${collection}/${doc.id}${apply ? "" : "  (planned)"}`);
  }

  if (!apply) {
    console.log();
    console.log("Dry run only — no writes made. Re-run with --apply to write to Firestore.");
    return;
  }

  const batch = adminDb.batch();
  for (const { collection, doc } of writes) {
    batch.set(adminDb.collection(collection).doc(doc.id), withoutId(doc));
  }
  await batch.commit();

  console.log();
  console.log(`Wrote ${writes.length} docs to Firestore.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
