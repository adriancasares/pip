export interface NewsletterContentBlock {
  type: "TEXT" | "IMAGE" | "DIVIDER";
}

export interface NewsletterTextBlock extends NewsletterContentBlock {
  type: "TEXT";
  content: string;
}

export interface NewsletterImageBlock extends NewsletterContentBlock {
  type: "IMAGE";
  src: string;
  alt: string;
  caption: string;
}

export interface NewsletterDividerBlock extends NewsletterContentBlock {
  type: "DIVIDER";
}
