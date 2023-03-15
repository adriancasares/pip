import React, { useEffect, useState } from "react";
import TextInput from "../TextInput";
import sluggify from "slug";
import type NewsletterSection from "../../../types/NewsletterSection";
import NewsletterSectionEditor from "./NewsletterSectionEditor";
import Button from "../../Button";
import { motion } from "framer-motion";
import { IoEnterOutline } from "react-icons/io5/index.js";
import { getDatabase, ref, set, onValue, off, get } from "firebase/database";
import type Newsletter from "../../../types/Newsletter";
import { RotatingLines } from "react-loader-spinner/dist/index.js";

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
      console.log("setting to waiting to save");
    };
  }, [sections, date, author, slug, name]);

  useEffect(() => {
    const intervalCallback = () => {
      if (progressSaved === "WAITING_TO_SAVE") {
        setProgressSaved("WAITING_TO_RECIEVE");
        console.log("setting to waiting to recieve");

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
        {progressSaved !== "NO_CHANGES" ? (
          <RotatingLines
            strokeColor="grey"
            strokeWidth="5"
            animationDuration="0.75"
            width="20"
            visible={true}
          />
        ) : (
          <p>All changes saved</p>
        )}
      </div>
      <div className="w-full mx-auto flex flex-col gap-2">
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
      </div>
      <div className="p-8 flex flex-col gap-8">
        {sections.map((section, i) => {
          return (
            <NewsletterSectionEditor
              section={section}
              onChange={(section) => {
                const newSections = [...sections];
                newSections[i] = section;
                setSections(newSections);
              }}
            />
          );
        })}
      </div>
      <motion.div>
        <Button
          icon="plus"
          onClick={() => {
            setSections([
              ...sections,
              {
                name: "Untitled Section",
                className: "",
                blocks: [],
              },
            ]);
          }}
        >
          Add Section
        </Button>
      </motion.div>
    </div>
  );
}
