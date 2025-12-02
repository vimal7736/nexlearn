"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/src/components/common/Header";
import { fetchQuestions } from "@/src/store/examSlice";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import LoadingScreen from "@/src/components/common/LoadingScreen";

export default function InstructionsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const { metadata, loading, error } = useAppSelector((state: any) => state.exam);

  useEffect(() => {
    dispatch(fetchQuestions());
  }, [dispatch]);

  if (loading || !metadata) {
    return <div className="text-center p-4 text-xs"><LoadingScreen/></div>;
  }

  if (error) {
    return (
      <div className="text-center p-4 text-xs text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4fcff]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-10 lg:px-14 py-4 sm:py-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 text-center mb-3 sm:mb-4">
          Ancient Indian History MCQ
        </h2>

        <div className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 rounded-lg shadow-lg p-3 sm:p-4 mb-3 sm:mb-4">
          <div className="grid grid-cols-3 divide-x divide-gray-300 text-center text-white">
            <div className="px-2">
              <p className="text-gray-300 text-[9px] sm:text-[10px] mb-1">Total MCQ's:</p>
              <p className="text-xl sm:text-2xl font-bold">{metadata.questions_count}</p>
            </div>
            <div className="px-2">
              <p className="text-gray-300 text-[9px] sm:text-[10px] mb-1">Total marks:</p>
              <p className="text-xl sm:text-2xl font-bold">
                {metadata.total_marks || metadata.questions_count}
              </p>
            </div>
            <div className="px-2">
              <p className="text-gray-300 text-[9px] sm:text-[10px] mb-1">Total time:</p>
              <p className="text-xl sm:text-2xl font-bold">{metadata.total_time}:00</p>
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4 mb-3 sm:mb-4">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2">
            Instructions:
          </h3>

          <div className="space-y-1 sm:space-y-1.5 text-gray-600 text-[11px] sm:text-xs">
            <p>1. You have {metadata.total_time} minutes to complete the test.</p>
            <p>
              2. Test consists of {metadata.questions_count} multiple-choice qs.
            </p>
            <p>
              3. You are allowed 2 retest attempts if you do not pass on the first
              try.
            </p>
            <p>4. Each incorrect answer will incur a negative mark of -1/4.</p>
            <p>
              5. Ensure you are in a quiet environment and have a stable internet
              connection.
            </p>
            <p>
              6. Keep an eye on the timer, and try to answer all questions within
              the given time.
            </p>
            <p>
              7. Do not use any external resources such as dictionaries, websites,
              or assistance.
            </p>
            <p>
              8. Complete the test honestly to accurately assess your proficiency
              level.
            </p>
            <p>9. Check answers before submitting.</p>
            <p>
              10. Your test results will be displayed immediately after submission,
              indicating whether you have passed or need to retake the test.
            </p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => router.push("/exam")}
            className="bg-gradient-to-r from-gray-700 to-gray-900 cursor-pointer text-white px-8 sm:px-10 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium hover:from-gray-800 hover:to-black transition-all shadow-lg w-full sm:w-auto"
          >
            Start Test
          </button>
        </div>
      </div>
    </div>
  );
}
