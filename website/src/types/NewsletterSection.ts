import type { NewsletterContentBlock } from "./NewsletterContentBlock";

export default interface NewsletterSection {
  name: string;
  className: string;
  blocks: NewsletterContentBlock[];
}
