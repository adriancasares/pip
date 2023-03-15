import type { NewsletterContentBlock } from "./NewsletterContentBlock";
import type NewsletterSection from "./NewsletterSection";

export default interface Newsletter {
  name: string;
  slug: string;
  date: Date;
  author: string;
  sections: NewsletterSection[];
}
