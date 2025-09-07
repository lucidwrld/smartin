import useDeleteManager from "@/constants/controller_templates/delete_controller_template";

 

export const DeleteFormManager = (formId: string) => {
  const { deleteCaller, isLoading, isSuccess, error, data } = useDeleteManager(
    `/event/forms/${formId}`,
    ["delete-form", "delete-event-forms"], 
  );

  const deleteForm = async () => {
    try {
      await deleteCaller({});
    } catch (error) {
      console.error("Error updating form fields:", error);
    }
  };

  return {
    deleteForm,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export default DeleteFormManager;
