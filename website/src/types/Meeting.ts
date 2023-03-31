import type { NewsletterContentBlock } from "./NewsletterContentBlock";
import type NewsletterSection from "./NewsletterSection";

export default interface Meeting {
  name: string;
  slidesUrl: string;
  date: number;
  description: string;
}
