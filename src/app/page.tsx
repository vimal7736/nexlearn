"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store";
import { sendOTP, verifyOTP, createProfile, setMobile as setMobileAction } from "@/src/store/authSlice";
import Input from "@/src/components/ui/Input";
import Button from "@/src/components/ui/Button";
import { PlusSquare } from "lucide-react";
import { useToast } from "@/src/context/ToastContext";

export default function MultiStepAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { loading, error, isAuthenticated, mobile: storedMobile } = useSelector(
    (state: RootState) => state.auth
  );

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [mobile, setMobile] = useState("");
  const [formattedMobile, setFormattedMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [qualification, setQualification] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [resendCooldown, setResendCooldown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/instructions");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (step !== 2) return;

    setCanResend(false);
    setResendCooldown(30);
    const t = setInterval(() => {
      setResendCooldown((c) => {
        if (c <= 1) {
          clearInterval(t);
          setCanResend(true);
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(t);
  }, [step]);

  const handleSendOTP = async () => {
    if (mobile.length !== 10) {
      showToast("Enter a valid 10-digit mobile number", "error");
      return;
    }

    const m = `+91${mobile}`;
    setFormattedMobile(m);

    dispatch(setMobileAction(m));

    const result = await dispatch(sendOTP(m));

    if (sendOTP.fulfilled.match(result)) {
      setStep(2);
    } else {
      showToast("Failed to send OTP", "error");
    }
  };

const handleVerifyOTP = async () => {
  if (otp.length < 4) {
    showToast("Enter the OTP");
    return;
  }

  const result = await dispatch(verifyOTP({ mobile: formattedMobile, otp }));

  if (verifyOTP.fulfilled.match(result)) {
    if (result.payload.hasProfile) {
      // router.push("/instructions");
    } else {
      setStep(3); 
    }
  } else {
    showToast("Invalid OTP", "error");
  }
};


  const handleCreateProfile = async () => {
  if (!name || !email || !qualification || !image) {
    showToast("Fill all fields", "error");
    return;
  }

  const result = await dispatch(
    createProfile({
      mobile: formattedMobile,
      name,
      email,
      qualification,
      profile_image: image,
    })
  );

  if (createProfile.fulfilled.match(result)) {
    router.push("/instructions"); 
  } else {
    showToast("Failed to create profile");
  }
};


  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-[#031526] p-4"
      style={{ backgroundImage: "url('/bg-pattern.png')" }}
    >
      <div className="flex flex-col md:flex-row w-full max-w-[850px] rounded-2xl overflow-hidden shadow-xl bg-[#0D1B2A]/40 backdrop-blur-lg">
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col justify-center items-center bg-[#1d3344]">
          <div className="flex items-center gap-1 mb-6 sm:mb-8 md:mb-10">
            <div className="rounded-lg p-2 sm:p-3 flex items-center justify-center transform -rotate-12">
              <Image src="/whiteHat.svg" alt="Logo" width={50} height={50} className="sm:w-[60px] sm:h-[60px]" />
            </div>

            <div>
              <h1 className="text-lg sm:text-xl lg:text-3xl font-bold bg-white bg-clip-text text-transparent">
                NexLearn
              </h1>
              <p className="text-[10px] sm:text-xs leading-none bg-white bg-clip-text text-transparent">
                futuristic learning
              </p>
            </div>
          </div>
          <Image 
            src="/lo_img.svg" 
            width={300} 
            height={300} 
            alt="students" 
            className="w-48 sm:w-64 md:w-[300px] h-auto"
          />
        </div>

        <div className="w-full md:w-1/2 bg-white p-6 sm:p-8 md:p-10 flex flex-col">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs sm:text-sm">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col justify-between h-full">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">Enter your phone number</h2>
                <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
                  We use your mobile number to identify your account
                </p>
                <div className="relative p-2 w-full">
                  <label className="text-[11px] sm:text-[12px] text-gray-500 font-medium absolute bg-white px-2 ml-5 mt-[-5px]">
                    Phone number
                  </label>
                  <div className="flex items-center gap-1 mt-1 border border-gray-300 rounded-lg px-3 py-2.5 sm:py-3">
                    <span className="text-base sm:text-lg text-gray-500 mb-1">🇮🇳</span>
                    <span className="text-sm sm:text-base text-gray-500">+91</span>
                    <Input
                      type="number"
                      className="border-none outline-none ring-0 focus:ring-0 w-full text-gray-900 text-sm sm:text-base"
                      placeholder="1234 567891"
                      value={mobile}
                      onChange={(e: any) => setMobile(e.target.value)}
                      onKeyPress={(e: any) => {
                        if (e.key === "Enter") handleSendOTP();
                      }}
                    />
                  </div>
                </div>
                <p className="text-[11px] sm:text-[12px] text-center text-gray-500 mt-2">
                  By tapping Get started, you agree to the Terms & Conditions
                </p>
              </div>

              <Button
                onClick={handleSendOTP}
                isLoading={loading}
                disabled={loading || mobile.length !== 10}
                className="w-full mt-6 py-2.5 sm:py-3 bg-[#0D1B2A] text-white rounded-lg disabled:opacity-50 text-sm sm:text-base"
              >
                Get Started
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-semibold mb-1 sm:mb-1">Enter the OTP</h2>
                <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
                  We've sent an SMS to <strong className="break-all">{formattedMobile}</strong>
                </p>
                <div className="relative p-2 w-full">
                  <label className="text-[11px] sm:text-[12px] text-gray-500 font-medium absolute bg-white px-2 ml-5 mt-[-5px]">
                    Sent Code
                  </label>
                  <div className="flex items-center gap-1 mt-1 border border-gray-300 rounded-lg px-3 py-2.5 sm:py-3">
                    <Input
                      type="number"
                      className="border-none outline-none ring-0 focus:ring-0 w-full text-gray-900 text-sm sm:text-base"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      onKeyPress={(e: any) => {
                        if (e.key === "Enter") handleVerifyOTP();
                      }}
                      placeholder="Enter 6-digit OTP"
                    />
                  </div>
                </div>

                <p className="text-[10px] sm:text-[11px] text-gray-500 text-left mt-2">
                  Your 6 digit code is on its way. This can sometimes take a few moments to
                  arrive.
                </p>
                <button
                  onClick={handleSendOTP}
                  disabled={!canResend}
                  className={`mt-2 text-[11px] sm:text-xs text-left underline ${
                    canResend ? "text-gray-600 hover:text-gray-800" : "text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {canResend ? "Resend OTP" : `Resend in ${resendCooldown}s`}
                </button>
              </div>

              <Button
                onClick={handleVerifyOTP}
                isLoading={loading}
                disabled={loading || otp.length < 4}
                className="w-full mt-6 py-2.5 sm:py-3 bg-[#0D1B2A] text-white rounded-lg disabled:opacity-50 text-sm sm:text-base"
              >
                Verify & Continue
              </Button>
            </div>
          )}

          {/* Step 3: Profile Creation */}
          {step === 3 && (
            <div className="flex flex-col gap-3 sm:gap-4">
              <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">Add Your Details</h2>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-28 sm:h-32 w-40 sm:w-[180px] mx-auto cursor-pointer hover:border-gray-400"
                onClick={() => document.getElementById("profileInput")?.click()}
              >
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Profile"
                    className="h-full w-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <PlusSquare className="w-6 h-6 sm:w-8 sm:h-8 mb-2" />
                    <span className="text-[10px] sm:text-[11px] text-center px-2">Add Your Profile Picture</span>
                  </div>
                )}
                <input
                  id="profileInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                />
              </div>

              <div className="relative p-2 w-full">
                <label className="text-[11px] sm:text-[12px] text-gray-800 font-medium absolute bg-white px-2 ml-5 -mt-2">
                  Name*
                </label>
                <div className="flex items-center gap-1 mt-1 border border-gray-300 rounded-lg px-3 py-2.5 sm:py-3">
                  <Input
                    type="text"
                    className="border-none outline-none ring-0 focus:ring-0 w-full text-gray-900 text-sm sm:text-base"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="relative p-2 w-full">
                <label className="text-[11px] sm:text-[12px] text-gray-800 font-medium absolute bg-white px-2 ml-5 -mt-2">
                  Email*
                </label>
                <div className="flex items-center gap-1 mt-1 border border-gray-300 rounded-lg px-3 py-2.5 sm:py-3">
                  <Input
                    type="email"
                    className="border-none outline-none ring-0 focus:ring-0 w-full text-gray-900 text-sm sm:text-base"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="relative p-2 w-full">
                <label className="text-[11px] sm:text-[12px] text-gray-800 font-medium absolute bg-white px-2 ml-5 -mt-2">
                  Your Qualification*
                </label>
                <div className="flex items-center gap-1 mt-1 border border-gray-300 rounded-lg px-3 py-2.5 sm:py-3">
                  <Input
                    type="text"
                    className="border-none outline-none ring-0 focus:ring-0 w-full text-gray-900 text-sm sm:text-base"
                    placeholder="Enter your qualification"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                  />
                </div>
              </div>

              <Button
                onClick={handleCreateProfile}
                isLoading={loading}
                disabled={loading || !name || !email || !qualification || !image}
                className="w-full mt-2 sm:mt-4 py-2.5 sm:py-3 bg-[#0D1B2A] text-white rounded-lg disabled:opacity-50 text-sm sm:text-base"
              >
                Get Started
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}