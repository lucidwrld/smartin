import usePostManager from "@/constants/controller_templates/post_controller_template";

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
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager<ProgramResponse>(
    `/event/add/program`,
    ["program"],
    true
  );

  const addProgram = async (eventId: string, programItems: ProgramItem[]) => {
    try {
      const payload: AddProgramPayload = {
        eventId,
        data: programItems
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
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager<ProgramResponse>(
    `/event/update/program`,
    ["program"],
    true
  );

  const updateProgram = async (eventId: string, programItems: ProgramItem[]) => {
    try {
      const payload: AddProgramPayload = {
        eventId,
        data: programItems
      };
      await postCaller(payload);
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
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager<ProgramResponse>(
    `/api/v1/event/delete/program`,
    ["program"],
    true
  );

  const deleteProgram = async (eventId: string, programIds: string[]) => {
    try {
      const payload = {
        eventId,
        programIds
      };
      await postCaller(payload);
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