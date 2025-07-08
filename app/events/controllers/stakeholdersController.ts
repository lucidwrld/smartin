import usePostManager from "@/constants/controller_templates/post_controller_template";
import { Stakeholder } from "../types";

interface AddStakeholdersPayload {
  eventId: string;
  data: Stakeholder[];
}

interface AddStakeholdersResponse {
  status: string;
  message: string;
  data: any;
}

export const AddStakeholdersManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager<AddStakeholdersResponse>(
    `/event/add/stakeholders`,
    ["stakeholders"],
    true
  );

  const addStakeholders = async (eventId: string, stakeholders: Stakeholder[]) => {
    try {
      const payload: AddStakeholdersPayload = {
        eventId,
        data: stakeholders
      };
      await postCaller(payload);
    } catch (error) {
      console.error("Error adding stakeholders:", error);
    }
  };

  return {
    addStakeholders,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

// Update Stakeholders Controller
export const UpdateStakeholdersManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager<AddStakeholdersResponse>(
    `/event/update/stakeholders`,
    ["stakeholders"],
    true
  );

  const updateStakeholders = async (eventId: string, stakeholders: Stakeholder[]) => {
    try {
      const payload: AddStakeholdersPayload = {
        eventId,
        data: stakeholders
      };
      await postCaller(payload);
    } catch (error) {
      console.error("Error updating stakeholders:", error);
    }
  };

  return {
    updateStakeholders,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

// Delete Stakeholders Controller  
export const DeleteStakeholdersManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager<AddStakeholdersResponse>(
    `/api/v1/event/delete/stakeholders`,
    ["stakeholders"],
    true
  );

  const deleteStakeholders = async (eventId: string, stakeholderIds: string[]) => {
    try {
      const payload = {
        eventId,
        stakeholderIds
      };
      await postCaller(payload);
    } catch (error) {
      console.error("Error deleting stakeholders:", error);
    }
  };

  return {
    deleteStakeholders,
    data,
    isLoading,
    isSuccess,
    error,
  };
};