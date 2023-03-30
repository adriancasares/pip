import { Cloudinary } from "@cloudinary/url-gen";
import { crop } from "@cloudinary/url-gen/actions/resize";
import type Newsletter from "../src/types/Newsletter";
import type {
  NewsletterImageBlock,
  NewsletterMeetingExclusiveBlock,
  NewsletterTextBlock,
} from "../src/types/NewsletterContentBlock";

function getImageURL(imageBlock: NewsletterImageBlock): string {
  const cld = new Cloudinary({
    cloud: {
      cloudName: "dlkexpc87",
    },
  });

  const image = cld.image(imageBlock.publicId);

  if (
    imageBlock.crop &&
    imageBlock.crop.width > 0 &&
    imageBlock.crop.height > 0
  ) {
    image.resize(
      crop()
        .width(Math.round(imageBlock.crop.width))
        .height(Math.round(imageBlock.crop.height))
        .x(Math.round(imageBlock.crop.x))
        .y(Math.round(imageBlock.crop.y))
    );
  }

  return image.toURL();
}

export default function createNewsletter(
  newsletter: Newsletter,
  recipient: {
    email: string;
    unsubLink?: string;
    test?: boolean;
  }
): string {
  // email format
  const email: string = `
    <html>
        <head>
          <style>
            p, h1, h2, h3, h4, h5, h6 {
              margin: 0;
            }
            .header-text {
              font-size: 0.75rem;
            }
            .text-block p {
              margin: 1rem 0;
            }
            .text-block:first-child p {
              margin-top: 0;
            }
            .section-header {
              font-size: 1rem;
            }
            .image-wrapper p {
              font-size: 0.75rem;
            }
            @media only screen and (max-width: 600px) {
              .text-block p {
                font-size: 1rem;
              }
              .section-header {
                font-size: 1.25rem;
              }

              .header-text {
                font-size: 0.75rem;
              }
              
            }
          </style>
        </head>
        <body style="font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 1rem; line-height: 1.5; color: #212529; max-width: 600px; margin: 0 auto;">
            <table style="width: 100%; line-height: 1; padding-top: 1rem;">
                <tbody>
                    <tr style="table-layout: fixed;">
                        <td style="width: 28px">
                            <img src="https://www.lasapip.com/icon-256.png" alt="logo" style="width: 20px;"/>
                        </td>
                        <td>
                            <p class="header-text" style="font-weight: 400; margin: 0; color: #888;">Programming in Practice Newsletter</p>
                        </td>
                    </tr>
                    </tbody>
            </table>
            <table style="width: 100%; color: #888;">
                <tbody style="font-size: 1.25rem;">
                    <tr style="">
                        <td>

                            <h1 style="font-weight: 500; font-size: 2.25rem; margin: 0; color: #000; line-height: 1; padding: 0.25rem 0 1rem 0;">${
                              newsletter.name
                            }</h1>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p style="margin: 0;" class="header-text">by ${
                              newsletter.author
                            }</p>
                            <p style="margin: 0;" class="header-text">Published on ${new Date(
                              newsletter.date
                            ).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}</p>
                        </td>
                        ${
                          ""
                          // <td>
                          //     <div class="view-online" style="white-space: nowrap; background: #eee; padding: 0.5rem 1rem; border-radius: 10rem; width: fit-content; margin-left: auto;">
                          //       <p style="margin: 0;">View Online</p>
                          //     </div>
                          // </td>
                        }
                    </tr>
                </tbody>
            </table>

            ${newsletter.sections
              .map((section) => {
                return `
                    <table style="width: 100%; table-layout: fixed; border-spacing: 0; font-size: 1rem;  padding-top: 1.5rem;">
                      <tbody>
                        <tr style="vertical-align: bottom;">
                          <td style="width: 16px; padding: 0;">
                            <div style="height: 0.5rem; border-top: 1px solid #ccc; border-left: 1px solid #ccc; border-top-left-radius: 4px;"></div>
                          </td>
                          <td width="300px;">
                            <h2 class="section-header" style="line-height: 1; padding: 0 0.5rem; color: #212529;">${
                              section.name
                            }</h2>
                          </td>
                          <td style="padding: 0;">
                            <div style="height: 0.5rem; border-top: 1px solid #ccc; border-right: 1px solid #ccc; border-top-right-radius: 4px;"></div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table style="width: 100%; border: 1px solid #ccc; border-top: none; padding: 0.5rem 1.25rem 0rem 1.25rem; border-bottom-left-radius: 4px; border-bottom-right-radius: 4px; font-family: Arial, Helvetica, sans-serif;">
                        <tbody>
                            ${section.blocks
                              .map((block) => {
                                if (block.type === "TEXT") {
                                  const textBlock =
                                    block as NewsletterTextBlock;
                                  return `
                                            <tr>
                                                <td>
                                                    <div style="color: #212529; font-size: 1rem;" class="text-block">${textBlock.content}</div>
                                                </td>
                                            </tr>
                                        `;
                                }
                                if (block.type === "IMAGE") {
                                  const imageBlock =
                                    block as NewsletterImageBlock;
                                  return `
                                            <tr>
                                                <td>
                                                    <div class="imageWrapper" style="margin: 1rem 0;">
                                                        <img class="image" src="${getImageURL(
                                                          imageBlock
                                                        )}" alt="${
                                    imageBlock.alt
                                  }" style="width: 100%;"/>
                                                        ${
                                                          imageBlock.caption
                                                            ? `<p style="color: #888;">${imageBlock.caption}</p>`
                                                            : ""
                                                        }
                                                    </div>
                                                </td>
                                            </tr>
                                        `;
                                }
                                if (block.type === "DIVIDER") {
                                  return `
                                            <tr>
                                                <td>
                                                    <hr/>
                                                </td>
                                            </tr>
                                        `;
                                }
                                if (block.type === "MEETING_EXCLUSIVE") {
                                  const meetingExclusiveBlock =
                                    block as NewsletterMeetingExclusiveBlock;

                                  return `
                                    <table style="width: 100%; table-layout: fixed; border-spacing: 0; padding: 0.5rem 1rem; background: #F8F8F8; border-radius: 8px; margin: 1rem 0;">
                                      <tbody>
                                        <tr style="vertical-align: bottom;">
                                          <td style="width: 2rem; padding: 0;">
                                            <img src="https://www.lasapip.com/icon/lock-v1-64.png" alt="lock" style="width: 16px;"/>
                                          </td>
                                          <td style="width: 0.25rem;">
                                          <td>
                                            <p>${meetingExclusiveBlock.text}
                                            </p>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>

                                  `;
                                }
                                return "";
                              })
                              .join("")}
                        </tbody>
                    </table>
                `;
              })
              .join("")}
              ${
                ""
                //   <div style="background-color: #f8f8f8; border-radius: 4px; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; margin-top: 1.5rem;">
                //   <table style="width: 100%; padding: 1.5rem; font-size: 0.75rem;">
                //     <tbody>
                //       <tr>
                //         <td>
                //             <h3 style="font-size: 1rem; font-weight: 500; color: #212529;">Thanks for Reading.</h3>
                //             <p style="margin: 1rem 0 0.5rem 0; color: #888;">Programming in Practice is a newsletter about programming and software development. It is published every Thursday morning. If you want the same content and more presented in person, come by Room 505 on Wednesdays during lunch. TLDR: <b>Club on Wednesdays, Newsletter on Thursdays</b>.</p>

                //             <div style="margin: 1.5rem 0;">
                //             <p style="color: #888;">Questions or Corrections? Just reply to this email.</p>
                //             <p style="color: #888;">Was this email forwarded to you? <a style="color: #888;" href="https://www.lasapip.com/subscribe">Subscribe here.</a></p>
                //             <p style="color: #888;">Join the <a style="color: #888;">LASA CS Discord.</a></p>
                //             </div>

                //             <p style="color: #212529;">Thanks,<br/>The Programming in Practice Team</p>
                //         </td>
                //       </tr>
                //     </tbody>
                //   </table>
                // </div>
                // <div style="margin: 0.5rem auto; width: fit-content;">
                //   <p style="font-size: 0.75rem; color: #888; display: inline-block;">Sent to ${
                //     recipient.email
                //   }.</p>
                //   ${
                //     recipient.unsubLink
                //       ? `<p href="${recipient.unsubLink}" style="font-size: 0.75rem; display: inline-block; color: #888;">Unsubscribe</a>`
                //       : `<p style="font-size: 0.75rem; display: inline-block; color: #888;">Reply to us to unsubscribe.</p>`
                //   }
                //   ${
                //     recipient.test
                //       ? `<p style="font-size: 0.75rem; display: inline-block; color: #888;">Sent as a test email.</p>`
                //       : ""
                //   }
                // </div>
              }
                  
            </body>
    </html>`;
  return email;
}
