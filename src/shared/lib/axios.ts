import axios from "axios";

/**
 * API_ROUTES paths are already root-absolute and include the /api prefix
 * (see api-routes.ts), so baseURL must stay unset here to avoid a
 * double-prefix bug.
 */
export const api = axios.create();
