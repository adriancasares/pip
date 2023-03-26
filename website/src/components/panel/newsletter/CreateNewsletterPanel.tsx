import React, { useEffect, useState } from "react";
import TextInput from "../TextInput";
import sluggify from "slug";
import type NewsletterSection from "../../../types/NewsletterSection";
import NewsletterSectionEditor, {
  generateBlockId,
} from "./NewsletterSectionEditor";
import Button from "../../Button";
import { motion } from "framer-motion";
import {
  IoAddCircle,
  IoAddSharp,
  IoAirplaneOutline,
  IoCloudUploadOutline,
  IoEnterOutline,
  IoEyeOutline,
  IoPaperPlane,
  IoPaperPlaneOutline,
  IoPaperPlaneSharp,
} from "react-icons/io5/index.js";
import { getDatabase, ref, set, onValue, off, get } from "firebase/database";
import type Newsletter from "../../../types/Newsletter";
import LoadingSpinner from "../../LoadingSpinner";
import type { NewsletterTextBlock } from "../../../types/NewsletterContentBlock";
import { TbPlus } from "react-icons/tb/index.js";
import NewsletterEditorChip from "./NewsletterEditorChip";
import MetadataTextInput from "./MetadataTextInput";
import MetadataDateInput from "./MetadataDateInput";
import SendEmailPanel from "./SendEmailPanel";

function NewsletterPanelLoader(props: { id: string; close: () => void }) {
  const [newsletter, setNewsletter] = useState<Newsletter | undefined>(
    undefined
  );

  const database = getDatabase();

  useEffect(() => {
    const draft = ref(database, "newsletterDrafts/" + props.id);

    get(draft).then((snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        const date = new Date(val.date);

        if (date.toString() === "Invalid Date") {
          val.date = new Date();
        }

        setNewsletter({
          name: val.name || "",
          slug: val.slug || "",
          date: val.date || Date.now(),
          author: val.author || "",
          sections: val.sections || [],
        });
      }
    });
  }, []);

  return (
    <div>
      {newsletter ? (
        <CreateNewsletterPanel
          id={props.id}
          newsletter={newsletter}
          close={() => {
            props.close();
          }}
        />
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-mono-c font-os text-sm">Loading...</p>
        </div>
      )}
    </div>
  );
}

export default function CreateNewsletterPanel(props: {
  id: string;
  newsletter?: Newsletter;
  close: () => void;
}) {
  if (!props.newsletter) {
    return (
      <NewsletterPanelLoader
        id={props.id}
        close={() => {
          props.close();
        }}
      />
    );
  }

  const [name, setName] = useState(props.newsletter.name);
  const [slug, setSlug] = useState(props.newsletter.slug);
  const [date, setDate] = useState(props.newsletter.date);
  const [author, setAuthor] = useState(props.newsletter.author);

  const [sections, setSections] = useState<NewsletterSection[]>(
    props.newsletter.sections
  );

  const database = getDatabase();

  const [progressSaved, setProgressSaved] = useState<
    "NO_CHANGES" | "WAITING_TO_SAVE" | "WAITING_TO_RECIEVE"
  >("NO_CHANGES");

  useEffect(() => {
    // @ts-ignore
    setSlug(sluggify(name));
  }, [name]);

  useEffect(() => {
    const draft = ref(database, "newsletterDrafts/" + props.id);

    onValue(draft, (snapshot) => {
      if (progressSaved === "WAITING_TO_RECIEVE") {
        return setProgressSaved("NO_CHANGES");
      } else if (progressSaved === "WAITING_TO_SAVE") {
        return;
      }

      const data = snapshot.val();

      if (data) {
        if (data.name) {
          setName(data.name);
        }
        if (data.slug) {
          setSlug(data.slug);
        }
        if (data.date) {
          setDate(data.date);
        }
        if (data.author) {
          setAuthor(data.author);
        }
        if (data.sections) {
          setSections(data.sections);
        }
      }
    });

    return () => {
      off(draft);
    };
  }, [progressSaved]);

  useEffect(() => {
    return () => {
      setProgressSaved("WAITING_TO_SAVE");
    };
  }, [date, author, slug, name]);

  useEffect(() => {
    const intervalCallback = () => {
      if (progressSaved === "WAITING_TO_SAVE") {
        setProgressSaved("WAITING_TO_RECIEVE");

        set(ref(database, "newsletterDrafts/" + props.id), {
          name,
          slug,
          date: date.valueOf(),
          author,
          sections,
        });
      }
    };
    const interval = setInterval(intervalCallback, 2000);

    return () => {
      clearInterval(interval);
    };
  });

  useEffect(() => {
    if (progressSaved !== "NO_CHANGES") {
      const beforeunloadCallback = (e: BeforeUnloadEvent) => {
        set(ref(database, "newsletterDrafts/" + props.id), {
          name,
          slug,
          date: date.valueOf(),
          author,
          sections,
        });

        e.preventDefault();
        e.returnValue = "Do you want to leave before saving?";
        return "Do you want to leave before saving?";
      };

      window.addEventListener("beforeunload", beforeunloadCallback);

      return () => {
        window.removeEventListener("beforeunload", beforeunloadCallback);
      };
    }
  }, [progressSaved]);

  const [shownPanel, setShownPanel] = useState("");
  return (
    <div className="pt-20">
      {
        <SendEmailPanel
          show={shownPanel === "SEND_EMAIL"}
          onClose={() => {
            setShownPanel("");
          }}
          progressSaved={progressSaved}
          projectId={props.id}
        />
      }
      <div className="fixed top-0 w-full flex items-center justify-between py-4 px-8 bg-white z-10">
        <div className="relative">
          <input
            className="outline-none border border-mono-border-light py-2 px-4 rounded-xl text-xl font-semibold w-96"
            type={"text"}
            placeholder={"Newsletter Name"}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <div className="absolute -bottom-1.5 right-4 bg-white text-xs font-os text-mono-c px-2 rounded-md">
            {progressSaved === "NO_CHANGES" ? <p>Saved</p> : <p>Saving</p>}
          </div>
        </div>
        <div className="flex gap-4">
          <NewsletterEditorChip
            label="Back to Project"
            grayscale
            onClick={() => {
              props.close();
            }}
          />
          <NewsletterEditorChip
            label="Publish"
            // onClick={() => {}}
            icon={<IoCloudUploadOutline />}
          />
          <NewsletterEditorChip
            label="Send"
            onClick={() => {
              setShownPanel("SEND_EMAIL");
            }}
            icon={<IoPaperPlaneOutline />}
          />
          <NewsletterEditorChip
            label="Preview"
            icon={<IoEyeOutline />}
            vibrant
          />
        </div>
      </div>

      <div className="px-8 flex flex-col gap-8">
        <div className="flex flex-col w-96">
          <MetadataTextInput label={"Slug"} value={slug} setValue={setSlug} />
          <MetadataTextInput
            label={"Author"}
            value={author}
            setValue={setAuthor}
          />
          <MetadataDateInput label={"Date"} value={date} setValue={setDate} />
        </div>
        {sections.map((section, i) => {
          return (
            <NewsletterSectionEditor
              key={i}
              section={section}
              onChange={(section) => {
                const newSections = [...sections];
                newSections[i] = section;

                if (JSON.stringify(newSections) !== JSON.stringify(sections)) {
                  setProgressSaved("WAITING_TO_SAVE");
                }

                setSections(newSections);
                setProgressSaved("WAITING_TO_SAVE");
              }}
              isFirst={i === 0}
              isLast={i === sections.length - 1}
              moveUp={() => {
                const newSections = [...sections];
                const temp = newSections[i];
                newSections[i] = newSections[i - 1];
                newSections[i - 1] = temp;

                setSections(newSections);
                setProgressSaved("WAITING_TO_SAVE");
              }}
              moveDown={() => {
                const newSections = [...sections];
                const temp = newSections[i];
                newSections[i] = newSections[i + 1];
                newSections[i + 1] = temp;

                setSections(newSections);
                setProgressSaved("WAITING_TO_SAVE");
              }}
              remove={() => {
                const newSections = [...sections];
                newSections.splice(i, 1);

                setSections(newSections);
                setProgressSaved("WAITING_TO_SAVE");
              }}
            />
          );
        })}
      </div>
      <div className="w-full">
        <button
          className="bg-accent-a p-2 rounded-full text-accent-c w-fit mx-auto block"
          onClick={() => {
            const textBlock: NewsletterTextBlock = {
              type: "TEXT",
              content: "",
              id: generateBlockId(),
            };
            setSections([
              ...sections,
              {
                name: "Untitled Section",
                className: "",
                blocks: [textBlock],
              },
            ]);

            setProgressSaved("WAITING_TO_SAVE");
          }}
        >
          <TbPlus />
        </button>
      </div>
    </div>
  );
}
