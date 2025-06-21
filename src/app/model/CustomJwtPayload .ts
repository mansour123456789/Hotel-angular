import { JwtPayload } from "jwt-decode";

interface CustomJwtPayload extends JwtPayload {
    email: string;
    role: string[];
    nameid: string;
    name: string;
    family_name: string;
  }
  