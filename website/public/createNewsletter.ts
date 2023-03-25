import { Cloudinary } from "@cloudinary/url-gen";
import { crop } from "@cloudinary/url-gen/actions/resize";
import type Newsletter from "../src/types/Newsletter";
import type {
  NewsletterImageBlock,
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

export default function createNewsletter(newsletter: Newsletter): string {
  // email format
  const email: string = `
    <html>
        <head>
        <body style="font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 1rem; line-height: 1.5; color: #212529;">
            <table style="width: 100%;">
                <tbody>
                    <tr>
                        <td>
                            <img src="https://www.lasapip.com/favicon.svg" alt="logo" style="width: 20px;"/>
                        </td>
                        <td>
                        <p style="font-size: 0.5rem; font-weight: 400; margin: 0; color: #888;">Programming in Practice Newsletter</p>
                        </td>
                    </tr>
                    <tr>
                        <td>

                            <h1 style="font-weight: 500; font-size: 2rem; margin: 0;">${
                              newsletter.name
                            }</h1>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>by ${newsletter.author}</p>
                        </td>
                        <td>
                            <p>Published on ${new Date(
                              newsletter.date
                            ).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}</p>
                        </td>
                        <td>
                            View Online
                        </td>
                    </tr>
                </tbody>
            </table>

            ${newsletter.sections
              .map((section) => {
                return `
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <h2>${section.name}</h2>
                                </td>
                            </tr>
                            ${section.blocks
                              .map((block) => {
                                if (block.type === "TEXT") {
                                  const textBlock =
                                    block as NewsletterTextBlock;
                                  return `
                                            <tr>
                                                <td>
                                                    <div>${textBlock.content}</div>
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
                                                    <div>
                                                        <img src="${getImageURL(
                                                          imageBlock
                                                        )}" alt="${
                                    imageBlock.alt
                                  }" style="width: ${imageBlock.width}px;"/>
                                                        ${
                                                          imageBlock.caption
                                                            ? `<p>${imageBlock.caption}</p>`
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
                                return "";
                              })
                              .join("")}
                        </tbody>
                    </table>
                `;
              })
              .join("")}
            </div>
            </body>
    </html>`;
  return email;
}
