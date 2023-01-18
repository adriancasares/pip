import { Email, EmailRecipient } from "../lib/Email";

export function createEmail(email: Email, recipient: EmailRecipient) {
  let html = `
${
  /*<head>
    <style>
        .signature {    
            background-color: #ededed;
            padding: 5px 10px;
        }
        .address-image {
            width: 20px;
            height: 20px;
        }
        .address-line {
            display: flex;
            flex-direction: row;
            gap: 10px;
            align-items: center;
        }
    </style>
    </head>*/ ""
}
<body>
    <div>
        ${email.body.replaceAll("{NAME}", recipient.name)}
    </div>
    <div class="signature">
        ${email.footer.replaceAll("{NAME}", recipient.name)}
    </div>
</body>
`;
  return html;
}
