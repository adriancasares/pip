import React, { useState } from "react";
import Button from "../Button";
import PhoneInput from "./PhoneInput";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";
import axios from "axios";

export default function AddPhoneForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [classYear, setClassYear] = useState("");

  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: any) => {
    e.preventDefault();

    setLoading(true);

    axios
      .post("/api/add-phone", {
        firstName,
        lastName,
        phone,
        classYear,
      })
      .then((res) => {
        console.log(res);
      });
  };

  return (
    <form className="flex flex-col gap-10" onSubmit={onSubmit}>
      <div className={`${loading ? "opacity-50" : ""} transition-opacity`}>
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
      <div className="mx-auto">
        <Button
          loading={loading}
          type={"submit"}
          tabIndex={5}
          disabled={
            firstName === "" ||
            lastName === "" ||
            phone === "" ||
            classYear === ""
          }
        >
          Sign Up
        </Button>
      </div>
    </form>
  );
}
