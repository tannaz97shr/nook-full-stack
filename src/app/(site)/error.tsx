"use client";

// Same boundary as the root one, placed inside the (site) layout so a page
// error keeps the public header and footer around it (admin/error.tsx does
// the same for AdminShell).
export { default } from "../error";
