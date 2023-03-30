export interface NewsletterContentBlock {
  type: "TEXT" | "IMAGE" | "DIVIDER" | "MEETING_EXCLUSIVE";
  id: string;
}

export interface NewsletterTextBlock extends NewsletterContentBlock {
  type: "TEXT";
  content: string;
}

export interface NewsletterImageBlock extends NewsletterContentBlock {
  type: "IMAGE";
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  width: number;
  publicId?: string;
  alt?: string;
  caption?: string;
}

export interface NewsletterDividerBlock extends NewsletterContentBlock {
  type: "DIVIDER";
}

export interface NewsletterMeetingExclusiveBlock
  extends NewsletterContentBlock {
  type: "MEETING_EXCLUSIVE";
  text: string;
}
