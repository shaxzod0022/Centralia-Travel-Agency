"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { useTranslations } from "next-intl";
import { styles } from "@/styles/styles";
import { Check, Eye, EyeOff } from "lucide-react";
import { Link } from "@/i18n/routing";

const Create = () => {
  const [showPass, setShowPass] = useState<boolean>(false);
  const [confirmShowPass, setConfirmShowPass] = useState<boolean>(false);
  const [agree, setAgree] = useState<boolean>(false);
  const [load, setLoad] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");

  const locale = useLocale();
  // map app locale -> ISO2 country code used by PhoneInput
  const localeToCountry: Record<string, string> = {
    en: "us",
    ru: "ru",
    de: "de",
    es: "es",
    ja: "jp",
    // fallback
  };

  const [phone, setPhone] = useState<string>("");
  const t = useTranslations("create");

  const isValidFullName = (value: string) => {
    const parts = value.trim().split(/\s+/).filter(Boolean);
    // require at least two parts (first + last) and each part at least 2 chars
    if (parts.length < 2) return false;
    for (const p of parts) {
      if (p.length < 2) return false;
    }
    return true;
  };

  // Password handling
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordStrength, setPasswordStrength] = useState<
    "weak" | "medium" | "strong"
  >("weak");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmError, setConfirmError] = useState<string>("");

  const evaluatePassword = (pwd: string) => {
    const len = pwd.length;
    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);

    if (len >= 8 && hasLower && hasUpper && hasNumber && hasSpecial)
      return "strong";
    const categories = [hasLower, hasUpper, hasNumber, hasSpecial].filter(
      Boolean
    ).length;
    if (len >= 6 && categories >= 2) return "medium";
    return "weak";
  };

  // update strength and match live
  const updatePassword = (val: string) => {
    setPassword(val);
    const s = evaluatePassword(val);
    setPasswordStrength(s);
    if (confirmPassword && val !== confirmPassword)
      setConfirmError(t("passwordMismatch"));
    else setConfirmError("");
    // clear password error when user types
    if (passwordError) setPasswordError("");
  };

  const updateConfirm = (val: string) => {
    setConfirmPassword(val);
    if (password && val !== password) setConfirmError(t("passwordMismatch"));
    else setConfirmError("");
  };
  const inspection = () => {
    if (!isValidFullName(fullName)) {
      setNameError(t("nameError"));
      return;
    }

    // password checks
    if (passwordStrength === "weak") {
      setPasswordError(t("passwordWeak"));
      return;
    }

    if (password !== confirmPassword) {
      setConfirmError(t("passwordMismatch"));
      return;
    }

    if (agree) {
      alert(t("submitSuccess"));
    } else {
      alert(t("submitAgreeMissing"));
    }
  };

  return (
    <div className={`${styles.paddingCont} !pt-28`}>
      <form
        className={`mx-auto space-y-3 w-full sm:w-4/5 md:w-3/5 lg:w-2/5 2xl:w-1/3 bg-white shadow-sm sm:p-5 p-3 rounded-2xl`}
      >
        <h2 className={`font-bold sm:text-3xl text-2xl`}>{t("title")}</h2>
        <div className="space-y-1">
          <label
            htmlFor="fullName"
            className={`${styles.p} block font-semibold`}
          >
            {t("name")}
          </label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => {
              const v = e.target.value;
              setFullName(v);
              // live validation: show error while typing (but don't show error for empty field)
              if (v.trim() === "") {
                setNameError("");
              } else if (!isValidFullName(v)) {
                setNameError(t("nameError"));
              } else {
                setNameError("");
              }
            }}
            onBlur={() => {
              if (fullName.trim() !== "" && !isValidFullName(fullName))
                setNameError(t("nameError"));
            }}
            aria-invalid={!!nameError}
            aria-describedby={nameError ? "fullName-error" : undefined}
            className={`w-full p-3 border-2 outline-none rounded-lg  focus:border-[#6EBB2D] ${
              nameError ? "border-red-500" : "border-gray-300"
            }`}
            placeholder={t("nameInput")}
          />
          {nameError && (
            <p id="fullName-error" className="text-red-500 text-sm mt-1">
              {nameError}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <label htmlFor="phone" className={`${styles.p} block font-semibold`}>
            {t("phone")}
          </label>

          <div className="border-2 border-gray-300 rounded-lg focus-within:border-[#6EBB2D] transition py-1">
            <PhoneInput
              defaultCountry={localeToCountry[locale] ?? "us"}
              value={phone}
              onChange={setPhone}
              inputProps={{
                id: "phone",
                placeholder: t("phoneInput"),
              }}
              className="!w-full"
              inputClassName="!w-full !p-3 !outline-none !border-none !bg-transparent"
              countrySelectorStyleProps={{
                buttonClassName:
                  "!border-none !bg-transparent !px-3 !outline-none",
              }}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className={`${styles.p} block font-semibold`}>
            {t("email")}
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-3 border-2 outline-none border-gray-300 rounded-lg  focus:border-[#6EBB2D]"
            placeholder={t("emailInput")}
            required
          />
        </div>
        {/* PASSWORD */}
        <div className="space-y-1 relative">
          <label
            htmlFor="password"
            className={`${styles.p} block font-semibold`}
          >
            {t("password")}
          </label>

          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => updatePassword(e.target.value)}
              aria-describedby={passwordError ? "password-error" : undefined}
              aria-invalid={!!passwordError}
              className={`w-full p-3 pr-12 border-2 outline-none rounded-lg focus:border-[#6EBB2D]
        ${passwordError ? "border-red-500" : "border-gray-300"}
      `}
              placeholder={t("passwordInput")}
            />

            {/* EYE — always visible */}
            <button
              type="button"
              onClick={() => {
                setShowPass((i) => !i);
                setConfirmShowPass((i) => !i);
              }}
              className="absolute bottom-2 right-3 bg-transparent p-1 text-gray-400 z-10"
              aria-label={showPass ? t("hidePassword") : t("showPassword")}
            >
              {showPass ? <Eye /> : <EyeOff />}
            </button>
          </div>

          {/* strength indicator */}
          {password.length > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 rounded overflow-hidden">
                <div
                  className={`h-full ${
                    passwordStrength === "weak"
                      ? "bg-red-500 w-1/3"
                      : passwordStrength === "medium"
                      ? "bg-yellow-400 w-2/3"
                      : "bg-green-500 w-full"
                  }`}
                />
              </div>
              <span
                className={`text-sm font-medium ${
                  passwordStrength === "weak"
                    ? "text-red-500"
                    : passwordStrength === "medium"
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              >
                {passwordStrength === "weak"
                  ? t("passwordWeak")
                  : passwordStrength === "medium"
                  ? t("passwordMedium")
                  : t("passwordStrong")}
              </span>
            </div>
          )}

          {passwordError && (
            <p id="password-error" className="text-red-500 text-sm mt-1">
              {passwordError}
            </p>
          )}
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="space-y-1 relative mt-3">
          <label
            htmlFor="confirmPassword"
            className={`${styles.p} block font-semibold`}
          >
            {t("confirmPassword")}
          </label>

          <div className="relative">
            <input
              id="confirmPassword"
              type={showPass ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => updateConfirm(e.target.value)}
              disabled={!password}
              aria-invalid={!!confirmError}
              aria-describedby={confirmError ? "confirm-error" : undefined}
              className={`w-full p-3 pr-12 border-2 outline-none rounded-lg focus:border-[#6EBB2D]
              ${confirmError ? "border-red-500" : "border-gray-300"}
              ${!password ? "bg-gray-100 cursor-not-allowed" : ""}
      `}
              placeholder={t("confirmPasswordInput")}
            />

            {/* EYE — always visible, but disabled if no password */}
            <button
              type="button"
              onClick={() => {
                setShowPass((i) => !i);
                setConfirmShowPass((i) => !i);
              }}
              disabled={!password}
              className={`absolute bottom-2 right-3 bg-transparent p-1 z-10
              ${
                !password ? "text-gray-300 cursor-not-allowed" : "text-gray-400"
              }
      `}
              aria-label={
                confirmShowPass ? t("hidePassword") : t("showPassword")
              }
            >
              {confirmShowPass ? <Eye /> : <EyeOff />}
            </button>
          </div>

          {!password && (
            <p className="text-sm text-gray-400 mt-1">
              {t("enterPasswordFirst")}
            </p>
          )}

          {confirmError && (
            <p id="confirm-error" className="text-red-500 text-sm mt-1">
              {confirmError}
            </p>
          )}
        </div>

        <div className={`${styles.flex} flex-nowrap gap-2`}>
          <button
            type="button"
            onClick={() => setAgree((i) => !i)}
            className={`border rounded ${
              agree ? "border-[#6EBB2D]" : "border-gray-500"
            } w-4.5 h-4.5 overflow-hidden`}
          >
            {agree ? <Check className="w-full h-full text-[#6EBB2D]" /> : ""}
          </button>
          <p className={`${styles.span} `}>
            {t("private")}
            <Link href={""} className="text-[#6EBB2D] ml-1">
              {t("privateLink")}
            </Link>
          </p>
        </div>
        <div>
          <button
            onClick={inspection}
            disabled={load}
            className={`bg-[#6EBB2D] active:bg-[#6EBB2D] hover:bg-[#88d747] transition py-2 px-5 font-semibold text-white rounded-lg w-full`}
          >
            {t("submit")}
          </button>
          <p className={`${styles.p} text-center`}>{t("or")}</p>
          <button
            className={`${styles.flexCenter} bg-white hover:bg-gray-400/20 active:bg-white transition font-semibold text-gray-500 p-2 w-full gap-2 rounded-full border border-gray-300`}
          >
            <img
              loading="lazy"
              decoding="async"
              src={"/icons/google.svg"}
              alt="Centralia Travel Agency Google Authorization"
              style={{ height: "auto" }}
            />
            <span>{t("google")}</span>
          </button>
        </div>
        <p className={`${styles.span} font-semibold text-center`}>
          {t("account")}
          <Link href={"/login"} className="ml-2 text-[#88d747]">
            {t("login")}
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Create;
