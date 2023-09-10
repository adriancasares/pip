import HCaptcha from "@hcaptcha/react-hcaptcha";
import React, { useEffect, useMemo, useState } from "react";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";
import Button from "../Button";
import phoneValidation from "phone";
import ErrorNotice from "./ErrorNotice";
import DoneAlert from "../add-phone/DoneAlert";
import axios from "axios";
import PhoneInput from "../add-phone/PhoneInput";
import emailValidator from "email-validator";
import LoadingDots from "../LoadingDots";

export default function SubscribeForm(props: { internal?: boolean }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [classYear, setClassYear] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (typeof window === undefined) return;

    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get("email");
    if (email) {
      setEmail(email);
    }
  }, []);

  const [loading, setLoading] = useState(false);

  const [response, setResponse] = useState<
    | "SUCCESS"
    | "SUCCESS_PHONE_EXISTS"
    | "SUCCESS_EMAIL_EXISTS"
    | "PHONE_EXISTS"
    | "EMAIL_EXISTS"
    | "DUPLICATE_CONTACT"
    | "INVALID_PHONE"
    | "INVALID_CAPTCHA"
    | "INVALID_EMAIL"
    | "UNKNOWN"
    | undefined
  >(undefined);

  const [captcha, setCaptcha] = useState("");

  const captchaRef = React.useRef<HCaptcha>(null);

  const phoneNumberValid = useMemo(
    () => phone.length > 0 && phoneValidation(phone).isValid,
    [phone]
  );

  const emailValid = useMemo(() => emailValidator.validate(email), [email]);

  const disabled =
    firstName === "" || lastName === "" || (!phoneNumberValid && !emailValid);
  classYear === "" || captcha == null || captcha == "";

  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (disabled) return;

    setLoading(true);

    const bodyFormData = new FormData();
    bodyFormData.append("firstName", firstName);
    bodyFormData.append("lastName", lastName);
    if (phoneNumberValid) {
      bodyFormData.append("phone", phone);
    }
    if (emailValid) {
      bodyFormData.append("email", email);
    }
    bodyFormData.append("classYear", classYear);
    bodyFormData.append("captchaKey", captcha);
    bodyFormData.append("internal", props.internal ? "true" : "false");

    await axios({
      method: "post",
      url: "/api/subscribe",
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => {
        if (res.data.result === "success") {
          if (res.data.matchingPhone) {
            setResponse("SUCCESS_PHONE_EXISTS");
          } else if (res.data.matchingEmail) {
            setResponse("SUCCESS_EMAIL_EXISTS");
          } else {
            setResponse("SUCCESS");
          }
        }
      })
      .catch((err) => {
        console.log(err.response.data);

        if (err.response.data.error === "phone-already-exists") {
          setResponse("PHONE_EXISTS");
        } else if (err.response.data.error === "duplicate-email") {
          setResponse("EMAIL_EXISTS");
        } else if (err.response.data.error === "duplicate-email-and-phone") {
          setResponse("DUPLICATE_CONTACT");
        } else if (err.response.data.error === "duplicate-phone") {
          setResponse("INVALID_PHONE");
        } else if (err.response.data.error === "invalid-captcha") {
          setResponse("INVALID_CAPTCHA");
        } else if (err.response.data.error === "invalid-email") {
          setResponse("INVALID_EMAIL");
        } else {
          setResponse("UNKNOWN");
        }
      })
      .finally(() => {
        setCaptcha("");
        captchaRef.current?.resetCaptcha();

        setLoading(false);
      });
  };

  return (
    <>
      {(response === "SUCCESS" ||
        response === "SUCCESS_EMAIL_EXISTS" ||
        response === "SUCCESS_PHONE_EXISTS") && (
        <div className="bg-white rounded-lg overflow-hidden shadow-md border border-mono-border-light max-w-2xl w-full mx-auto flex flex-col gap-4 p-8">
          <h3 className="text-black">Thanks for signing up.</h3>

          {response === "SUCCESS_PHONE_EXISTS" && (
            <>
              <p className="text-red-500">
                Note: You're already signed up for text messages.
              </p>
              <p className="text-mono-c">
                You should have recieved a welcome email from us. Not seeing it?
                Contact us directly or try signing up again.
              </p>
            </>
          )}

          {response === "SUCCESS_EMAIL_EXISTS" && (
            <>
              <p className="text-red-500">
                Note: You're already signed up for emails.
              </p>
              <p className="text-mono-c">
                You should have recieved a welcome text from us. Not seeing it?
                Contact us directly or try signing up again.
              </p>
            </>
          )}
          {response === "SUCCESS" && (
            <>
              <p className="text-mono-c">
                You should have recieved a welcome email and text message from
                us. Not seeing one of them? Contact us directly or try signing
                up again.
              </p>
            </>
          )}

          <a href="/" className="underline text-mono-b">
            Back to Home
          </a>
        </div>
      )}
      {response !== "SUCCESS" &&
        response !== "SUCCESS_EMAIL_EXISTS" &&
        response !== "SUCCESS_PHONE_EXISTS" && (
          <>
            {response === "PHONE_EXISTS" && (
              <ErrorNotice>
                Your phone number is already on our list. If you haven't been
                getting texts, let us know.
              </ErrorNotice>
            )}
            {response === "INVALID_PHONE" && (
              <ErrorNotice>
                The phone number you entered is invalid. Please try again.
              </ErrorNotice>
            )}
            {response === "INVALID_CAPTCHA" && (
              <ErrorNotice>
                The captcha you submitted is invalid. Please try again.
              </ErrorNotice>
            )}
            {response === "UNKNOWN" && (
              <ErrorNotice>
                An unkown error occured. Please try again or email us. Sorry.
              </ErrorNotice>
            )}
            {response === "INVALID_EMAIL" && (
              <ErrorNotice>
                The email you entered is invalid. Please try again.
              </ErrorNotice>
            )}
            {response === "EMAIL_EXISTS" && (
              <ErrorNotice>
                The email you entered is already on our list. If you haven't
                been getting emails, let us know.
              </ErrorNotice>
            )}
            {response === "DUPLICATE_CONTACT" && (
              <ErrorNotice>
                The email and phone number you entered are already on our list.
                If you haven't been getting emails or texts, let us know.
              </ErrorNotice>
            )}
            <form className="flex flex-col gap-10 font-os" onSubmit={onSubmit}>
              <div
                className={`${
                  loading ? "opacity-50" : ""
                } transition-opacity max-w-3xl mx-auto w-full`}
              >
                <div className="">
                  <div className="bg-white rounded-lg overflow-hidden mx-8 shadow-md border border-mono-border-light">
                    <div className="flex flex-col gap-4 md:p-10 p-6 pb-4 md:pb-4">
                      <TextInput
                        label="First Name"
                        value={firstName}
                        onChange={setFirstName}
                      />
                      <TextInput
                        label="Last Name"
                        value={lastName}
                        onChange={setLastName}
                      />
                      <SelectInput
                        label="Class Year"
                        options={[
                          "2023 (Senior)",
                          "2024 (Junior)",
                          "2025 (Sophomore)",
                          "2026 (Freshman)",
                        ]}
                        value={classYear}
                        onChange={setClassYear}
                      />
                    </div>
                    <div className="flex flex-col gap-4 bg-mono-container-light md:p-10 p-6 pt-4 md:pt-4">
                      <p className="text-xs bg-slate-200 text-slate-500 py-1 px-2 rounded-md w-fit">
                        Complete at least one.
                      </p>
                      <TextInput
                        label="Email"
                        value={email}
                        onChange={setEmail}
                      />
                      <div className="relative">
                        <TextInput
                          label="Phone Number"
                          value={phone}
                          onChange={setPhone}
                        />
                        {!phoneNumberValid && phone.length > 0 && (
                          <p className="absolute text-xs bg-mono-container-light -bottom-1 left-0 px-2 rounded-sm text-red-500">
                            Invalid phone number.
                          </p>
                        )}
                        {phoneNumberValid && phone.length > 0 && (
                          <p className="absolute text-xs bg-mono-container-light -bottom-1 left-0 px-2 rounded-sm text-green-500">
                            Valid phone number.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mx-auto flex flex-col items-center gap-2">
                <HCaptcha
                  ref={captchaRef}
                  sitekey="994171e5-ba9e-465c-9825-441ad34a3537"
                  theme="light"
                  onVerify={(token) => setCaptcha(token)}
                />
                <button
                  disabled={disabled}
                  type="submit"
                  className="from-slate-700 to-slate-800 bg-gradient-to-b text-white rounded-lg font-sans uppercase py-2 px-4 disabled:opacity-50"
                >
                  {loading ? <LoadingDots light /> : "Subscribe"}
                </button>
              </div>
            </form>
          </>
        )}
    </>
  );
}
