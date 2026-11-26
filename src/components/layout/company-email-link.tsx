import { site } from "@/config/site";

export function CompanyEmailLink() {
  return <a href={`mailto:${site.email}`}>{site.email}</a>;
}
