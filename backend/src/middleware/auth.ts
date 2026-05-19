import type { Request, Response, NextFunction } from "express";
import { supabase } from "../services/supabase";
import { DISABLE_SUPABASE } from "../config";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const header = req.headers.authorization;
  
  // Dev bypass if Supabase is disabled
  if (DISABLE_SUPABASE && (!header || header === "Bearer dev-token")) {
    req.user = { id: "admin-uuid-0000-0000-000000000000", email: "admin@offline.local" };
    next();
    return;
  }

  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  const token = header.slice(7);

  // supabase.auth.getUser() validates the JWT against Supabase's signing keys
  // and returns the full user object. Works with the service-role client.
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }

  req.user = { id: user.id, email: user.email! };
  next();
}
