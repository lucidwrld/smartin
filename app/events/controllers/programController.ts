import useDeleteManager from "@/constants/controller_templates/delete_controller_template";
import usePostManager from "@/constants/controller_templates/post_controller_template";
import useUpdateManager from "@/constants/controller_templates/put_controller_template";

interface ProgramItem {
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  speaker: string;
  speaker_title: string;
  is_public: boolean;
}

interface AddProgramPayload {
  eventId: string;
  data: ProgramItem[];
}

interface ProgramResponse {
  status: string;
  message: string;
  data: any;
}

export const AddProgramManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } =
    usePostManager<ProgramResponse>(`/event/add/program`, ["event"], true);

  const addProgram = async (eventId: string, programItems: ProgramItem[]) => {
    try {
      const payload: AddProgramPayload = {
        eventId,
        data: programItems,
      };
      await postCaller(payload);
    } catch (error) {
      console.error("Error adding program:", error);
    }
  };

  return {
    addProgram,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

// Update Program Controller
export const UpdateProgramManager = () => {
  const { updateCaller, isLoading, isSuccess, error, data } =
    useUpdateManager<ProgramResponse>(`/event/update/program`, ["event"], true);

  const updateProgram = async (
    eventId: string,
    programId: string,
    programData: Partial<ProgramItem>
  ) => {
    try {
      const payload = {
        eventId,
        id: programId,
        data: programData,
      };
      await updateCaller(payload);
    } catch (error) {
      console.error("Error updating program:", error);
    }
  };

  return {
    updateProgram,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

// Delete Program Controller
export const DeleteProgramManager = () => {
  const { deleteCaller, isLoading, isSuccess, error, data } =
    useDeleteManager<ProgramResponse>(
      `/event/delete/program`,
      ["program_event"],
      true
    );

  const deleteProgram = async (eventId: string, ids: string[]) => {
    try {
      const payload = {
        eventId,
        ids,
      };
      await deleteCaller(payload);
    } catch (error) {
      console.error("Error deleting program:", error);
    }
  };

  return {
    deleteProgram,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
