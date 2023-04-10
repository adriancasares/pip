import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import TextInput from "../subscribe/TextInput";
import { IoArrowForward } from "react-icons/io5/index.js";
import SelectInput from "../subscribe/SelectInput";
import phoneValidation from "phone";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import ErrorNotice from "../subscribe/ErrorNotice";
import LoadingDots from "../LoadingDots";
import emailValidator from "email-validator";
import axios from "axios";

export default function SubscribeReminder() {
  // show if scrolled down 10% of the page
  const [show, setShow] = React.useState(false);

  const [inPermanentState, setInPermanentState] = useState(false);

  React.useEffect(() => {
    if (inPermanentState) return;

    const handleScroll = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      if (scrolled / scrollable > 0.4) {
        setShow(true);
      } else {
        setShow(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [inPermanentState]);

  const variants = {
    hidden: {
      opacity: 0,
      translateY: 100,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      translateY: 0,
      scale: 1,
    },
  };
  // only allow scroll up when show is true

  React.useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [show]);

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [classYear, setClassYear] = useState("");
  const [phone, setPhone] = useState("");

  const [showFurtherSignup, setShowFurtherSignup] = useState(false);

  const emailValid = useMemo(
    () => email.length > 0 && emailValidator.validate(email),
    [email]
  );

  const phoneNumberValid = useMemo(
    () => phone.length > 0 && phoneValidation(phone).isValid,
    [phone]
  );
  const canSubmit = useMemo(
    () =>
      email.length > 0 &&
      firstName.length > 0 &&
      lastName.length > 0 &&
      classYear.length > 0 &&
      (phoneNumberValid || phone.length === 0) &&
      emailValid,
    [email, firstName, lastName, classYear, phoneNumberValid, phone]
  );

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

  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!canSubmit) return;

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
            setShow(false);
            setInPermanentState(true);
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
        setLoading(false);
      });
  };

  return (
    <>
      {response === "PHONE_EXISTS" && (
        <ErrorNotice>
          Your phone number is already on our list. If you haven't been getting
          texts, let us know.
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
          The email you entered is already on our list. If you haven't been
          getting emails, let us know.
        </ErrorNotice>
      )}
      {response === "DUPLICATE_CONTACT" && (
        <ErrorNotice>
          The email and phone number you entered are already on our list. If you
          haven't been getting emails or texts, let us know.
        </ErrorNotice>
      )}
      <div
        className={`fixed bottom-0 w-full ${
          show ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {
          <motion.div
            animate={{
              opacity: show ? 1 : 0,
            }}
            className="fixed bottom-0 left-0 h-1/4 w-full bg-gradient-to-t from-black/25 to-black/0"
          />
        }
        <motion.div
          className="relative z-50 px-4 pb-4"
          initial="hidden"
          animate={show ? "visible" : "hidden"}
          variants={variants}
          transition={{ duration: 0.3 }}
        >
          <div
            className={`bg-gradient-to-tr max-w-xl mx-auto w-full rounded-md shadow-2xl border border-mono-border-light overflow-hidden transition-all duration-200 delay-200 ${
              showFurtherSignup
                ? "from-pink-50 to-orange-50"
                : "from-amber-50 to-teal-50"
            }`}
          >
            <motion.div
              className="flex children:flex-none children:max-w-xl children:w-full children:p-4"
              animate={{
                translateX: showFurtherSignup ? "-100%" : 0,
              }}
              transition={{
                // duration: show ? 0.5 : 0,
                duration: 0,
              }}
            >
              <motion.div className="flex flex-col gap-4">
                <h1 className="text-xl font-medium font-os tracking-normal">
                  Sign up to Continue
                </h1>
                <p className="text-mono-c font-os max-w-sm">
                  Don't miss future issues. Subscribe to our newsletter for a
                  new email every Thursday morning.
                </p>

                <div className="flex gap-4 items-end">
                  <div className="w-full">
                    <TextInput
                      label="Email"
                      value={email}
                      onChange={setEmail}
                    />
                  </div>
                  <button
                    className={`bg-teal-500 w-8 h-8 rounded-full flex items-center justify-center flex-none mb-2 ${
                      emailValid ? "opacity-100" : "opacity-50"
                    }`}
                    onClick={() => {
                      if (emailValid) {
                        setShow(false);

                        setTimeout(() => {
                          setShowFurtherSignup(true);
                        }, 300);

                        setTimeout(() => {
                          setShow(true);
                        }, 400);
                      }
                    }}
                  >
                    <IoArrowForward className="text-white" />
                  </button>
                </div>

                <div
                  className="font-os text-sm bg-teal-500/10 w-fit py-1 px-2 rounded-md text-mono-c cursor-pointer"
                  onClick={() => {
                    setShow(false);
                    setInPermanentState(true);
                    setResponse("SUCCESS");
                  }}
                >
                  <p>No Thanks</p>
                </div>
              </motion.div>

              <motion.div
                className="flex flex-col gap-4"
                style={{
                  height: 0,
                }}
                animate={{
                  height: showFurtherSignup ? "auto" : 0,
                }}
                transition={{
                  // duration: show ? 1 : 0.5,
                  // delay: show ? 0.3 : 0,
                  duration: 0,
                }}
              >
                <h1 className="text-xl font-medium font-os tracking-normal">
                  Almost Done.
                </h1>
                <p className="text-mono-c font-os">
                  Thanks for subscribing! We just need a little more
                  information.
                </p>

                <div className="flex gap-4 items-end">
                  <div className="w-full">
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
                      value={classYear}
                      onChange={setClassYear}
                      options={[
                        "2023 (Senior)",
                        "2024 (Junior)",
                        "2025 (Sophomore)",
                        "2026 (Freshman)",
                        "Alumni",
                        "Other",
                      ]}
                    />
                    <div className="relative">
                      <TextInput
                        label="Phone Number"
                        value={phone}
                        onChange={setPhone}
                      />
                      {phone.length === 0 && (
                        <p className="absolute text-xs -bottom-1 bg-white left-0 px-2 rounded-sm text-mono-c">
                          Optional: Recieve text reminders about live meetings.
                        </p>
                      )}
                      {!phoneNumberValid && phone.length > 0 && (
                        <p className="absolute text-xs bg-white -bottom-1 left-0 px-2 rounded-sm text-red-500">
                          Invalid phone number.
                        </p>
                      )}
                      {phoneNumberValid && phone.length > 0 && (
                        <p className="absolute text-xs bg-white -bottom-1 left-0 px-2 rounded-sm text-green-500">
                          Valid phone number.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mx-auto text-center">
                  <div
                    className={`font-os bg-orange-500 w-fit py-2 px-4 rounded-md text-white cursor-pointer ${
                      !canSubmit && "opacity-50 cursor-not-allowed"
                    }`}
                    onClick={() => {
                      if (!canSubmit) return;

                      onSubmit();
                    }}
                  >
                    {loading ? <LoadingDots light /> : "Finish"}
                  </div>
                  <div
                    className={`font-os text-xs text-mono-c cursor-pointer mt-2`}
                    onClick={() => {
                      if (loading) return;

                      setShow(false);

                      setTimeout(() => {
                        setShowFurtherSignup(false);
                      }, 300);

                      setTimeout(() => {
                        setShow(true);
                      }, 400);
                    }}
                  >
                    Go Back
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
