import useGetPublicFeedbacksManager from "@/app/events/controllers/feedbacks/getPublicFeedbacksController";
import CustomButton from "../Button";
import FeedbackTabModal from "./submitFeedback";
import { FeedbackCard } from "../events/publicComponents/PublicFeedbackDisplay";


export default function FeedbackTabManagement({ eventDetails,  }) {
  const { data, isLoading } = useGetPublicFeedbacksManager({
      eventId: eventDetails.id || eventDetails._id,
      enabled: Boolean(eventDetails.showFeedback),
    });
    const feedbacks = data?.feedbacks || [];
    const colors = {
    primary: eventDetails?.colors?.[0] || "#F97316",
    secondary: eventDetails?.colors?.[1] || "#1E293B",
    primaryText: "text-white",
    bgLight: `bg-[${eventDetails?.colors?.[0] || "#F97316"}]/10`,
    bgDark: eventDetails?.colors?.[0] || "#F97316",
  };
  return (
    <div className="w-full h-fit flex flex-col gap-[20px]">
      <div className="w-full flex flex-col gap-[13px] h-fit">
          <h1 className="text-[24px] leading-[16px] text-[#1B1B1B] font-normal">Feedbacks</h1>
          <div className="w-full h-[1px] bg-[#CDCDCD]"></div>
      </div>
      <div className="w-full h-fit flex justify-end">
        <CustomButton buttonText="Leave Feedback" onClick={() => {document.getElementById("submit-feedbacks").showModal()}} className="bg-signin w-full animate-pulse" />

      </div>
      <div className="w-full h-fit grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {
          isLoading ?
            [Array(4)].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 shadow-lg animate-pulse"
                >
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-16 bg-gray-200 rounded mb-4"></div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              )) 
          : feedbacks.length === 0 ? <div className="md:col-span-2 lg:col-span-3 flex justify-center items-center p-6 rounded-[6px] text-backgroundPurple">Oops no feedback yet... </div> :
          feedbacks.map((feedback) => (
              <FeedbackCard
                key={feedback._id}
                feedback={feedback}
                colors={colors}
              />
            ))
        }

      </div>
      <FeedbackTabModal eventId={eventDetails.id} />
    </div>
  )
}