import usePostManager from "@/constants/controller_templates/post_controller_template";
import { Host, Sponsor, Partner, Vendor, Resource } from "../types";

interface BaseResponse {
  status: string;
  message: string;
  data: any;
}

// ===================== HOSTS MANAGEMENT =====================
interface AddHostsPayload {
  eventId: string;
  data: Host[];
}

export const AddHostsManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager<BaseResponse>(
    `/event/add/host`,
    ["hosts"],
    true
  );

  const addHosts = async (eventId: string, hosts: Host[]) => {
    try {
      const payload: AddHostsPayload = {
        eventId,
        data: hosts
      };
      await postCaller(payload);
    } catch (error) {
      console.error("Error adding hosts:", error);
    }
  };

  return {
    addHosts,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export const UpdateHostsManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager<BaseResponse>(
    `/event/update/hosts`,
    ["hosts"],
    true
  );

  const updateHosts = async (eventId: string, hosts: Host[]) => {
    try {
      const payload: AddHostsPayload = {
        eventId,
        data: hosts
      };
      await postCaller(payload);
    } catch (error) {
      console.error("Error updating hosts:", error);
    }
  };

  return {
    updateHosts,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export const DeleteHostsManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager<BaseResponse>(
    `/api/v1/event/delete/host`,
    ["hosts"],
    true
  );

  const deleteHosts = async (eventId: string, hostIds: string[]) => {
    try {
      const payload = {
        eventId,
        hostIds
      };
      await postCaller(payload);
    } catch (error) {
      console.error("Error deleting hosts:", error);
    }
  };

  return {
    deleteHosts,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

// ===================== SPONSORS MANAGEMENT =====================
interface AddSponsorsPayload {
  eventId: string;
  data: Sponsor[];
}

export const AddSponsorsManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager<BaseResponse>(
    `/event/add/sponsors`,
    ["sponsors"],
    true
  );

  const addSponsors = async (eventId: string, sponsors: Sponsor[]) => {
    try {
      const payload: AddSponsorsPayload = {
        eventId,
        data: sponsors
      };
      await postCaller(payload);
    } catch (error) {
      console.error("Error adding sponsors:", error);
    }
  };

  return {
    addSponsors,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export const UpdateSponsorsManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager<BaseResponse>(
    `/event/update/sponsors`,
    ["sponsors"],
    true
  );

  const updateSponsors = async (eventId: string, sponsors: Sponsor[]) => {
    try {
      const payload: AddSponsorsPayload = {
        eventId,
        data: sponsors
      };
      await postCaller(payload);
    } catch (error) {
      console.error("Error updating sponsors:", error);
    }
  };

  return {
    updateSponsors,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export const DeleteSponsorsManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager<BaseResponse>(
    `/api/v1/event/delete/sponsors`,
    ["sponsors"],
    true
  );

  const deleteSponsors = async (eventId: string, sponsorIds: string[]) => {
    try {
      const payload = {
        eventId,
        sponsorIds
      };
      await postCaller(payload);
    } catch (error) {
      console.error("Error deleting sponsors:", error);
    }
  };

  return {
    deleteSponsors,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

// ===================== PARTNERS MANAGEMENT =====================
interface AddPartnersPayload {
  eventId: string;
  data: Partner[];
}

export const AddPartnersManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager<BaseResponse>(
    `/event/add/partners`,
    ["partners"],
    true
  );

  const addPartners = async (eventId: string, partners: Partner[]) => {
    try {
      const payload: AddPartnersPayload = {
        eventId,
        data: partners
      };
      await postCaller(payload);
    } catch (error) {
      console.error("Error adding partners:", error);
    }
  };

  return {
    addPartners,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export const UpdatePartnersManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager<BaseResponse>(
    `/event/update/partners`,
    ["partners"],
    true
  );

  const updatePartners = async (eventId: string, partners: Partner[]) => {
    try {
      const payload: AddPartnersPayload = {
        eventId,
        data: partners
      };
      await postCaller(payload);
    } catch (error) {
      console.error("Error updating partners:", error);
    }
  };

  return {
    updatePartners,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export const DeletePartnersManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager<BaseResponse>(
    `/api/v1/event/delete/partners`,
    ["partners"],
    true
  );

  const deletePartners = async (eventId: string, partnerIds: string[]) => {
    try {
      const payload = {
        eventId,
        partnerIds
      };
      await postCaller(payload);
    } catch (error) {
      console.error("Error deleting partners:", error);
    }
  };

  return {
    deletePartners,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

// ===================== VENDORS MANAGEMENT =====================
interface AddVendorsPayload {
  eventId: string;
  data: Vendor;
  id?: string;
}

export const AddVendorsManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager<BaseResponse>(
    `/event/add/vendors`,
    ["vendors"],
    true
  );

  const addVendors = async (eventId: string, vendor: Vendor, id?: string) => {
    try {
      const payload: AddVendorsPayload = {
        eventId,
        data: vendor,
        ...(id && { id })
      };
      await postCaller(payload);
    } catch (error) {
      console.error("Error adding vendors:", error);
    }
  };

  return {
    addVendors,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export const UpdateVendorsManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager<BaseResponse>(
    `/api/v1/event/update/vendors`,
    ["vendors"],
    true
  );

  const updateVendors = async (eventId: string, vendors: Vendor[]) => {
    try {
      const payload = {
        eventId,
        data: vendors
      };
      await postCaller(payload);
    } catch (error) {
      console.error("Error updating vendors:", error);
    }
  };

  return {
    updateVendors,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export const DeleteVendorsManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager<BaseResponse>(
    `/api/v1/event/delete/vendors`,
    ["vendors"],
    true
  );

  const deleteVendors = async (eventId: string, vendorIds: string[]) => {
    try {
      const payload = {
        eventId,
        vendorIds
      };
      await postCaller(payload);
    } catch (error) {
      console.error("Error deleting vendors:", error);
    }
  };

  return {
    deleteVendors,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

// ===================== RESOURCES MANAGEMENT =====================
interface AddResourcesPayload {
  eventId: string;
  data: Resource[];
}

export const AddResourcesManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager<BaseResponse>(
    `/event/add/resources`,
    ["resources"],
    true
  );

  const addResources = async (eventId: string, resources: Resource[]) => {
    try {
      const payload: AddResourcesPayload = {
        eventId,
        data: resources
      };
      await postCaller(payload);
    } catch (error) {
      console.error("Error adding resources:", error);
    }
  };

  return {
    addResources,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export const UpdateResourcesManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager<BaseResponse>(
    `/event/update/resources`,
    ["resources"],
    true
  );

  const updateResources = async (eventId: string, resources: Resource[]) => {
    try {
      const payload: AddResourcesPayload = {
        eventId,
        data: resources
      };
      await postCaller(payload);
    } catch (error) {
      console.error("Error updating resources:", error);
    }
  };

  return {
    updateResources,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export const DeleteResourcesManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager<BaseResponse>(
    `/event/delete/resources`,
    ["resources"],
    true
  );

  const deleteResources = async (eventId: string, resourceIds: string[]) => {
    try {
      const payload = {
        eventId,
        resourceIds
      };
      await postCaller(payload);
    } catch (error) {
      console.error("Error deleting resources:", error);
    }
  };

  return {
    deleteResources,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

// ===================== SPEAKERS MANAGEMENT =====================
interface SpeakerPayload {
  name: string;
  email: string;
  topic: string;
  image: string;
  date: string;
  time: string;
  is_public: boolean;
}

interface AddSpeakersPayload {
  eventId: string;
  data: SpeakerPayload[];
}

export const AddSpeakersManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager<BaseResponse>(
    `/api/v1/event/add/speakers`,
    ["speakers"],
    true
  );

  const addSpeakers = async (eventId: string, speakers: SpeakerPayload[]) => {
    try {
      const payload: AddSpeakersPayload = {
        eventId,
        data: speakers
      };
      await postCaller(payload);
    } catch (error) {
      console.error("Error adding speakers:", error);
    }
  };

  return {
    addSpeakers,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export const UpdateSpeakersManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager<BaseResponse>(
    `/api/v1/event/update/speakers`,
    ["speakers"],
    true
  );

  const updateSpeakers = async (eventId: string, speakers: SpeakerPayload[]) => {
    try {
      const payload: AddSpeakersPayload = {
        eventId,
        data: speakers
      };
      await postCaller(payload);
    } catch (error) {
      console.error("Error updating speakers:", error);
    }
  };

  return {
    updateSpeakers,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export const DeleteSpeakersManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager<BaseResponse>(
    `/api/v1/event/delete/speakers`,
    ["speakers"],
    true
  );

  const deleteSpeakers = async (eventId: string, speakerIds: string[]) => {
    try {
      const payload = {
        eventId,
        speakerIds
      };
      await postCaller(payload);
    } catch (error) {
      console.error("Error deleting speakers:", error);
    }
  };

  return {
    deleteSpeakers,
    data,
    isLoading,
    isSuccess,
    error,
  };
};