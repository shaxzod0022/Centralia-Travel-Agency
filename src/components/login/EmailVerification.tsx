"use client";

import { useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { styles } from "@/styles/styles";

interface Props {
  email?: string;
  onSuccess?: () => void;
}

const VerifyEmail = ({ email, onSuccess }: Props) => {
  const t = useTranslations("verifyEmail");

  const [load, setLoad] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [localEmail, setLocalEmail] = useState<string | undefined>(email);

  useEffect(() => {
    // focus the first input on mount
    codeRefs.current[0]?.focus();
  }, []);

  // auto-fill code/email from URL params (e.g., ?code=123456&email=foo@example.com)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get("code");
    const emailParam = params.get("email");
    if (emailParam) setLocalEmail(emailParam);
    if (codeParam && /^[0-9]{6}$/.test(codeParam)) {
      const digits = codeParam.split("");
      const next = [...code];
      for (let i = 0; i < 6; i++) {
        next[i] = digits[i] ?? "";
        if (codeRefs.current[i]) codeRefs.current[i]!.value = digits[i] ?? "";
      }
      setCode(next);
      // auto submit after a tiny delay
      setTimeout(() => submitCode(codeParam), 150);
    }
  }, []);

  const setDigit = (index: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...code];
    next[index] = val;
    setCode(next);
    setError("");
    setSuccess("");
    if (val && index < 5) {
      codeRefs.current[index + 1]?.focus();
    }
    // auto submit if all filled
    if (next.every((c) => c !== "")) {
      // small delay to allow last input to render
      setTimeout(() => submitCode(next.join("")), 150);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const val = (e.target as HTMLInputElement).value;
    if (e.key === "Backspace") {
      if (val === "" && index > 0) {
        codeRefs.current[index - 1]?.focus();
        const next = [...code];
        next[index - 1] = "";
        setCode(next);
      }
    }
    if (e.key === "ArrowLeft" && index > 0) {
      codeRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      codeRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text");
    const digits = text
      .replace(/[^0-9]/g, "")
      .slice(0, 6)
      .split("");
    if (!digits.length) return;
    const next = [...code];
    for (let i = 0; i < digits.length; i++) {
      next[i] = digits[i];
      if (codeRefs.current[i]) codeRefs.current[i]!.value = digits[i];
    }
    setCode(next);
    if (digits.length === 6) {
      submitCode(next.join(""));
    } else {
      codeRefs.current[digits.length]?.focus();
    }
  };

  const submitCode = async (value?: string) => {
    const codeValue = value ?? code.join("");
    if (!/^[0-9]{6}$/.test(codeValue)) {
      setError(t("invalidCode"));
      return;
    }
    setLoad(true);
    setError("");
    try {
      const res = await fetch("/api/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeValue, email }),
      });
      if (!res.ok) throw new Error("failed");
      setSuccess(t("success"));
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setError(t("invalidCode"));
    } finally {
      setLoad(false);
    }
  };

  return (
    <div className={`${styles.paddingCont} !pt-28`}>
      <div
        className={`relative mx-auto space-y-3 w-full sm:w-4/5 md:w-3/5 lg:w-2/5 2xl:w-1/3 bg-white shadow-sm sm:p-5 p-3 rounded-2xl`}
      >
        <h2 className="font-bold sm:text-3xl text-2xl">{t("title")}</h2>

        <p className="text-sm text-gray-600 mt-2">{t("desc")}</p>
        {localEmail && (
          <p className="text-sm text-gray-700 font-medium mt-1">
            {t("sentTo", { email: localEmail })}
          </p>
        )}

        <div
          className="flex items-center justify-between gap-2 mt-4"
          onPaste={handlePaste}
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <input
              key={index}
              ref={(el) => {
                codeRefs.current[index] = el;
              }}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              aria-label={`${t("enterCode")} ${index + 1}`}
              className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg outline-none focus:border-2 focus:border-[#6EBB2D]"
              onChange={(e) => setDigit(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-2" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-600 text-sm mt-2" role="status">
            {success}
          </p>
        )}

        <div className="mt-4">
          <button
            onClick={() => submitCode()}
            disabled={load}
            className={`bg-[#6EBB2D] hover:bg-[#88d747] active:bg-[#6EBB2D] transition py-3 px-5 font-semibold text-white rounded-lg w-full ${
              load ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {load ? t("submitLoading") : t("submit")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
