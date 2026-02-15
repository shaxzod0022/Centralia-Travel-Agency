"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { styles } from "@/styles/styles";
import { Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
  const [load, setLoad] = useState<boolean>(false);

  const [showPass, setShowPass] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [passwordStrength, setPasswordStrength] = useState<
    "weak" | "medium" | "strong"
  >("weak");

  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmError, setConfirmError] = useState<string>("");

  const [token, setToken] = useState<string | null>(null);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  const t = useTranslations("reset");
  const router = useRouter();

  /* ================= TOKEN CHECK ================= */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const value = params.get("token");

    if (!value || !/^[A-Za-z0-9-_]{16,}$/.test(value)) {
      setTokenValid(false);
      return;
    }

    setToken(value);
    setTokenValid(true);
  }, []);

  /* ================= PASSWORD STRENGTH ================= */
  const evaluatePassword = (pwd: string) => {
    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);

    if (pwd.length >= 8 && hasLower && hasUpper && hasNumber && hasSpecial)
      return "strong";

    if (
      pwd.length >= 6 &&
      [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length >= 2
    )
      return "medium";

    return "weak";
  };

  useEffect(() => {
    setPasswordStrength(evaluatePassword(password));
  }, [password]);

  useEffect(() => {
    if (confirmPassword && password !== confirmPassword)
      setConfirmError(t("passwordMismatch"));
    else setConfirmError("");
  }, [password, confirmPassword]);

  /* ================= SUBMIT ================= */
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || tokenValid !== true) return;

    if (!password) {
      setPasswordError(t("passwordRequired"));
      return;
    }

    if (passwordStrength === "weak") {
      setPasswordError(t("passwordWeakMsg"));
      return;
    }

    if (password !== confirmPassword) {
      setConfirmError(t("passwordMismatch"));
      return;
    }

    setLoad(true);

    try {
      await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      alert(t("resetSuccess"));
      router.push("/login");
    } catch {
      alert(t("resetError"));
    } finally {
      setLoad(false);
    }
  };

  /* ================= INVALID TOKEN ================= */
  if (tokenValid === false)
    return (
      <div className={`${styles.paddingCont} !pt-28`}>
        <div className="mx-auto w-full sm:w-4/5 md:w-3/5 lg:w-2/5 bg-white p-5 rounded-2xl text-center">
          <h2 className="font-bold text-2xl">{t("invalidToken")}</h2>
          <p className="text-gray-500 mt-2">{t("invalidTokenDesc")}</p>
        </div>
      </div>
    );

  /* ================= UI ================= */
  return (
    <div className={`${styles.paddingCont} !pt-28`}>
      <form
        onSubmit={submit}
        className="mx-auto space-y-4 w-full sm:w-4/5 md:w-3/5 lg:w-2/5 bg-white p-5 rounded-2xl shadow-sm"
      >
        <h2 className="font-bold text-center text-2xl sm:text-3xl">
          {t("title")}
        </h2>
        <p className="text-center text-gray-600 text-sm">{t("desc")}</p>

        {/* PASSWORD */}
        <div className="space-y-1">
          <label className={`${styles.p} font-semibold`}>{t("password")}</label>

          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
              }}
              className={`w-full p-3 pr-12 border-2 rounded-lg outline-none focus:border-[#6EBB2D]
                ${passwordError ? "border-red-500" : "border-gray-300"}`}
              placeholder={t("passwordInput")}
            />

            <button
              type="button"
              onClick={() => setShowPass((i) => !i)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPass ? <Eye /> : <EyeOff />}
            </button>
          </div>

          {password.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
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
                {t(
                  `password${
                    passwordStrength[0].toUpperCase() +
                    passwordStrength.slice(1)
                  }`
                )}
              </span>
            </div>
          )}

          {passwordError && (
            <p className="text-red-500 text-sm">{passwordError}</p>
          )}
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="space-y-1">
          <label className={`${styles.p} font-semibold`}>
            {t("confirmPassword")}
          </label>

          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={!password}
              className={`w-full p-3 pr-12 border-2 rounded-lg outline-none focus:border-[#6EBB2D]
                ${confirmError ? "border-red-500" : "border-gray-300"}
                ${!password ? "bg-gray-100 cursor-not-allowed" : ""}`}
              placeholder={t("confirmPasswordInput")}
            />

            <button
              type="button"
              onClick={() => setShowPass((i) => !i)}
              disabled={!password}
              className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                !password ? "text-gray-300" : "text-gray-400"
              }`}
            >
              {showPass ? <Eye /> : <EyeOff />}
            </button>
          </div>

          {confirmError && (
            <p className="text-red-500 text-sm">{confirmError}</p>
          )}
        </div>

        <button
          disabled={load}
          className="w-full bg-[#6EBB2D] hover:bg-[#88d747] text-white py-3 rounded-lg font-semibold transition"
        >
          {t("submit")}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
