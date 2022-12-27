import React, { useState } from "react";
import { Meeting } from "../lib/Meeting";
import Button from "./Button";
import DescriptionLine from "./DescriptionLine";
import ErrorLine from "./ErrorLine";
import Section from "./Section";
import axios from "redaxios";
import { IoAlertCircleOutline, IoCloseCircle } from "react-icons/io5/index.js";
import ReactLoading from "react-loading";
import addToStrapi from "../handler/strapi";
import StatusLine from "./StatusLine";

function Step(props: {
  label: string;
  index: number;
  error: boolean;
  current: number;
}) {
  return (
    <StatusLine
      label={props.label}
      status={
        props.current !== props.index
          ? "IDLE"
          : props.error
          ? "ERROR"
          : "LOADING"
      }
    />
  );
}
export default function AddToWebsiteSection(props: { meeting: Meeting }) {
  const { meeting } = props;

  const valid = meeting && meeting.title && meeting.date && meeting.description;

  const [status, setStatus] = useState(0);
  const [error, setError] = useState(false);

  function reset() {
    setStatus(0);
    setError(false);
  }

  function handleAddToStrapi() {
    setStatus(1);

    axios
      .post("/api/add-to-strapi", {
        title: meeting.title,
        description: meeting.description,
        slides: meeting.slides,
        date: meeting.date,
      })
      .then((res) => {
        setStatus(2);

        axios
          .post("/api/deploy-to-vercel", {})
          .then((res) => {
            setStatus(3);
          })
          .catch((err) => {
            setError(true);
            console.error(err);
          });
      })
      .catch((err) => {
        setError(true);
        console.error(err);
      });
  }

  return (
    <Section index={4} label="Add to Website" reset={reset}>
      <p className="text-slate-600 text-base">
        Add the meeting to the website calendar.
      </p>

      {valid ? (
        <div className="flex flex-col gap-2">
          {!meeting.slides && status === 0 && (
            <ErrorLine>You might want to add a link to the slides.</ErrorLine>
          )}

          {status === 0 && (
            <Button label="Add to Website" onClick={handleAddToStrapi} />
          )}

          {status !== 0 && status !== 3 && (
            <>
              <Step
                label="Add to Strapi"
                index={1}
                error={error}
                current={status}
              />
              <Step
                label="Deploy to Vercel"
                index={2}
                error={error}
                current={status}
              />
            </>
          )}

          {status === 3 && (
            <div className="flex gap-2 bg-slate-200 p-2 rounded-md items-center">
              <h2>Deployment Started.</h2>
              <DescriptionLine>
                The website will be updated in a few minutes.
              </DescriptionLine>
            </div>
          )}
        </div>
      ) : (
        <ErrorLine>
          Please fill out all fields to add to the website calendar.
        </ErrorLine>
      )}
    </Section>
  );
}
