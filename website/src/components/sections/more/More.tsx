import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  IoLogoGithub,
  IoLogoInstagram,
  IoMail,
  IoMailOutline,
  IoPeopleOutline,
} from "react-icons/io5/index.js";
import Expandable from "./Expandable";
import SocialIcon from "./SocialIcon";

export interface Captain {
  name: string;
  bio: string;
  github: string;
  email: string;
  instagram: string;
  image: string;
}

export default function More(props: { captains: Captain[] }) {
  const [selected, setSelected] = useState(-1);
  const [component, setComponent] = useState(<></>);

  return (
    <section
      id="more"
      className="w-full from-gradient-more-section-from  to-gradient-more-section-to bg-gradient-to-br py-10 flex flex-col gap-10"
    >
      <div className="max-w-4xl w-full mx-auto px-10">
        <h2 className="text-mono-a text-xl font-title py-4">More Stuff</h2>

        <AnimatePresence>{component}</AnimatePresence>

        <div
          className={`flex justify-center gap-4 ${
            selected !== -1 ? "h-0 overflow-visible" : ""
          }`}
        >
          <Expandable
            label="Captains"
            selection={selected}
            setSelection={setSelected}
            setComponent={setComponent}
            index={0}
            icon={<IoPeopleOutline />}
          >
            {props.captains.map((captain) => {
              return (
                <div className="font-sans flex p-4 gap-8 overflow-hidden flex-col sm:flex-row">
                  {captain.image && (
                    <div className="w-48 h-60 rounded-lg overflow-hidden flex-none">
                      <img
                        className="w-48 h-60 object-cover"
                        src={`http://api.lasapip.com${captain.image}`}
                        width={100}
                        height={100}
                      />
                    </div>
                  )}
                  <div className="flex flex-col gap-4">
                    {captain.name && (
                      <h3 className="text-mono-a">{captain.name}</h3>
                    )}
                    {captain.bio && (
                      <p className="text-mono-b">{captain.bio}</p>
                    )}
                    <div className="flex gap-4 items-center flex-wrap-reverse">
                      {captain.github && (
                        <SocialIcon link={captain.github}>
                          <IoLogoGithub />
                        </SocialIcon>
                      )}
                      {captain.instagram && (
                        <SocialIcon link={captain.instagram}>
                          <IoLogoInstagram />
                        </SocialIcon>
                      )}
                      {captain.email && (
                        <p>
                          <a
                            href={`mailto:${captain.email}`}
                            className="flex items-center gap-2 text-accent-a"
                          >
                            <IoMail />
                            <span>{captain.email}</span>
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </Expandable>
        </div>
      </div>
    </section>
  );
}
