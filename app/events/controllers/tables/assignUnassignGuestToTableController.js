import useUpdateManager from "@/constants/controller_templates/put_controller_template";
import { useRouter } from "next/navigation";

export const AssignUnassignGuestsManager = ({ isAdd = false }) => {
  const router = useRouter();
  const { updateCaller, isLoading, isSuccess, error, data } = useUpdateManager(
    `/event/tables/guests/${isAdd ? "add" : "remove"}`,
    ["tables", "events_invitees"],
    true,
    true
  );
  const manageAssignment = async (details) => {
    try {
      await updateCaller(details);
    } catch (error) {
      console.error("error:", error);
    }
  };
  return {
    manageAssignment,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
