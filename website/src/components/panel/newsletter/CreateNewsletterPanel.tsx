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
import { TbPlus } from "react-icons/tb";
import NewsletterEditorChip from "./NewsletterEditorChip";

function NewsletterPanelLoader(props: { id: string }) {
  const [newsletter, setNewsletter] = useState<Newsletter | undefined>(
    undefined
  );

  const database = getDatabase();

  useEffect(() => {
    const draft = ref(database, "drafts/" + props.id);

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
          date: val.date || new Date(),
          author: val.author || "",
          sections: val.sections || [],
        });
      }
    });
  }, []);

  return (
    <div>
      {newsletter ? (
        <CreateNewsletterPanel id={props.id} newsletter={newsletter} />
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
}) {
  if (!props.newsletter) {
    return <NewsletterPanelLoader id={props.id} />;
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
    const draft = ref(database, "drafts/" + props.id);

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

        set(ref(database, "drafts/" + props.id), {
          name,
          slug,
          date,
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
      set(ref(database, "drafts/" + props.id), {
        name,
        slug,
        date,
        author,
        sections,
      });

      const beforeunloadCallback = (e: BeforeUnloadEvent) => {
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

  return (
    <div className="pt-20">
      <div className="fixed top-0 w-full flex items-center justify-between py-4 px-8 border-b border-b-mono-b/50 bg-white z-10">
        <div>
          <input
            className="outline-none border border-mono-border-light py-2 px-4 rounded-md text-xl font-semibold w-96"
            type={"text"}
            placeholder={"Newsletter Name"}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div className="flex gap-4">
          <NewsletterEditorChip
            label="Preview"
            onClick={() => {}}
            icon={<IoEyeOutline />}
          />
          <NewsletterEditorChip
            label="Publish"
            onClick={() => {}}
            icon={<IoCloudUploadOutline />}
          />
          <NewsletterEditorChip
            label="Send"
            onClick={() => {}}
            icon={<IoPaperPlaneOutline />}
          />
        </div>
        {progressSaved !== "NO_CHANGES" ? (
          <LoadingSpinner />
        ) : (
          <p>All changes saved</p>
        )}
      </div>
      {/* <div className="w-full mx-auto flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-4 px-8 py-4 bg-mono-container-light">
          <TextInput label={"Slug"} value={slug} onChange={setSlug} />
          <TextInput label={"Author"} value={author} onChange={setAuthor} />
          <div className="flex flex-col gap-2 font-os">
            <p>Publication Date</p>
            <input
              className="outline-none border border-mono-b py-2 px-4 rounded-md"
              type={"date"}
              value={date.toISOString().split("T")[0]}
              onChange={(e) => {
                try {
                  const d = new Date(e.target.value);
                  if (d.toString() !== "Invalid Date") {
                    setDate(d);
                  }
                } catch (e) {
                  console.log(e);
                }
              }}
            />
          </div>
        </div>
      </div> */}
      <div className="p-8 flex flex-col gap-8">
        <div></div>
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
