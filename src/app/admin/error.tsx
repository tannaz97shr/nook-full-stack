"use client";

// Same boundary as the root one, placed inside the admin layout so a page
// error keeps AdminShell (nav + "Back to site") around it — the root
// boundary sits above this layout and would render with no navigation.
export { default } from "../error";
