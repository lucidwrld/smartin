import usePostManager from "@/constants/controller_templates/post_controller_template";
import { Stakeholder } from "../types";
import useUpdateManager from "@/constants/controller_templates/put_controller_template";
import useDeleteManager from "@/constants/controller_templates/delete_controller_template";

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
  const { postCaller, isLoading, isSuccess, error, data } =
    usePostManager<AddStakeholdersResponse>(
      `/event/add/stakeholders`,
      ["event"],
      true
    );

  const addStakeholders = async (
    eventId: string,
    stakeholders: Stakeholder[]
  ) => {
    try {
      const payload: AddStakeholdersPayload = {
        eventId,
        data: stakeholders,
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
  const { updateCaller, isLoading, isSuccess, error, data } =
    useUpdateManager<AddStakeholdersResponse>(
      `/event/update/stakeholders`,
      ["event"],
      true
    );

  const updateStakeholders = async (
    eventId: string,
    stakeholderId: string,
    stakeholderData: Partial<Stakeholder>
  ) => {
    try {
      const payload = {
        eventId,
        id: stakeholderId,
        data: stakeholderData,
      };
      await updateCaller(payload);
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
  const { deleteCaller, isLoading, isSuccess, error, data } =
    useDeleteManager<AddStakeholdersResponse>(
      `/api/v1/event/delete/stakeholders`,
      ["stakeholders"],
      true
    );

  const deleteStakeholders = async (
    eventId: string,
    stakeholderIds: string[]
  ) => {
    try {
      const payload = {
        eventId,
        stakeholderIds,
      };
      await deleteCaller(payload);
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
