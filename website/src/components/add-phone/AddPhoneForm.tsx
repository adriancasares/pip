import React, { useMemo, useState } from "react";
import Button from "../Button";
import PhoneInput from "./PhoneInput";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";
import axios from "axios";
import DoneAlert from "./DoneAlert";
import Alert from "./Alert";
import ErrorAlert from "./ErrorAlert";
import phoneValidation from "phone";
import HCaptcha from "@hcaptcha/react-hcaptcha";

export default function AddPhoneForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [classYear, setClassYear] = useState("");

  const [loading, setLoading] = useState(false);

  const [response, setResponse] = useState<
    | "SUCCESS"
    | "PHONE_EXISTS"
    | "INVALID_PHONE"
    | "INVALID_CAPTCHA"
    | "UNKNOWN"
    | undefined
  >(undefined);

  const [captcha, setCaptcha] = useState("");

  const phoneNumberValid = useMemo(
    () => phone.length > 0 && phoneValidation(phone).isValid,
    [phone]
  );

  const disabled =
    firstName === "" ||
    lastName === "" ||
    !phoneNumberValid ||
    classYear === "" ||
    captcha == "";

  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (disabled) return;

    setLoading(true);

    const bodyFormData = new FormData();
    bodyFormData.append("firstName", firstName);
    bodyFormData.append("lastName", lastName);
    bodyFormData.append("phone", phone);
    bodyFormData.append("classYear", classYear);
    bodyFormData.append("captchaKey", captcha);

    await axios({
      method: "post",
      url: "/api/messaging/add-phone",
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => {
        if (res.data.result === "success") {
          setResponse("SUCCESS");
        }
      })
      .catch((err) => {
        if (err.response.data.error === "phone-already-exists") {
          setResponse("PHONE_EXISTS");
        } else if (err.response.data.error === "invalid-phone-number") {
          setResponse("INVALID_PHONE");
        } else if (err.response.data.error === "invalid-captcha") {
          setResponse("INVALID_CAPTCHA");
        } else {
          setResponse("UNKNOWN");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {response === "SUCCESS" && <DoneAlert />}
      {response !== "SUCCESS" && (
        <>
          {response === "PHONE_EXISTS" && (
            <ErrorAlert>
              Your phone number is already on our list. If you haven't been
              getting texts, let us know.
            </ErrorAlert>
          )}
          {response === "INVALID_PHONE" && (
            <ErrorAlert>
              The phone number you entered is invalid. Please try again.
            </ErrorAlert>
          )}
          {response === "INVALID_CAPTCHA" && (
            <ErrorAlert>
              The captcha you submitted is invalid. Please try again.
            </ErrorAlert>
          )}
          {response === "UNKNOWN" && (
            <ErrorAlert>
              An unkown error occured. Please try again or email us. Sorry.
            </ErrorAlert>
          )}
          <form className="flex flex-col gap-10 font-os" onSubmit={onSubmit}>
            <div
              className={`${loading ? "opacity-50" : ""} transition-opacity`}
            >
              <div className="px-10 max-w-3xl mx-auto">
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4 flex-col sm:flex-row">
                    <div className="flex-1">
                      <TextInput
                        disabled={loading}
                        tabIndex={1}
                        label="First Name"
                        placeholder="Enter your first name"
                        value={firstName}
                        onChange={setFirstName}
                      />
                    </div>
                    <div className="flex-1">
                      <TextInput
                        disabled={loading}
                        tabIndex={2}
                        label="Last Name"
                        placeholder="Enter your last name"
                        value={lastName}
                        onChange={setLastName}
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 flex-col sm:flex-row">
                    <div className="flex-1">
                      <SelectInput
                        disabled={loading}
                        tabIndex={3}
                        onChange={setClassYear}
                        values={[
                          "2023 (Senior)",
                          "2024 (Junior)",
                          "2025 (Sophomore)",
                          "2026 (Freshman)",
                        ]}
                        label="Grade"
                      />
                    </div>
                    <div className="flex-1">
                      <PhoneInput
                        value={phone}
                        onChange={setPhone}
                        tabIndex={4}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mx-auto flex flex-col items-center gap-2">
              <HCaptcha
                sitekey="994171e5-ba9e-465c-9825-441ad34a3537"
                theme="dark"
                onVerify={(token) => setCaptcha(token)}
              />
              <Button
                loading={loading}
                type={"submit"}
                tabIndex={5}
                disabled={disabled}
              >
                Sign Up
              </Button>
            </div>
          </form>
        </>
      )}
    </>
  );
}
