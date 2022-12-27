export type Email = {
  title: string;
  text: string;
  body: string;
  footer: string;
  sender: string;
  from: string;
};

export type EmailRecipient = {
  id: number;
  name: string;
  address: string;
};
