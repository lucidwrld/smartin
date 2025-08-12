import usePostManager from "@/constants/controller_templates/post_controller_template";
import useUpdateManager from "@/constants/controller_templates/put_controller_template";
import useDeleteManager from "@/constants/controller_templates/delete_controller_template";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { useQuery } from "react-query";

interface BaseResponse {
  status: string;
  message: string;
  data: any;
}

interface Todo {
  _id: string;
  event: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string;
  assigned_to?: string;
  notes?: Note[];
  createdAt: string;
  updatedAt: string;
}

interface Note {
  _id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateTodoPayload {
  event: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string;
  assigned_to?: string;
}

interface UpdateTodoPayload {
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'pending' | 'in_progress' | 'completed';
  due_date?: string;
  assigned_to?: string;
}

interface CreateNotePayload {
  content: string;
}

interface TodosResponse {
  status: string;
  message: string;
  data: Todo[];
}

interface TodoResponse {
  status: string;
  message: string;
  data: Todo;
}

export const CreateTodoManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } =
    usePostManager<BaseResponse>(`/todos`, ["eventTodos"], true);

  const createTodo = async (todoData: CreateTodoPayload) => {
    try {
      await postCaller(todoData);
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  return {
    createTodo,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export const useGetEventTodosManager = (eventId: string, enabled = true) => {
  return useQuery<TodosResponse, Error>(
    ["eventTodos", eventId],
    async () => {
      const response = await AxiosWithToken.get(`/todos/event/${eventId}`);
      return response.data;
    },
    {
      enabled: enabled && !!eventId,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  );
};

export const useGetTodoByIdManager = (todoId: string, enabled = true) => {
  return useQuery<TodoResponse, Error>(
    ["todo", todoId],
    async () => {
      const response = await AxiosWithToken.get(`/todos/${todoId}`);
      return response.data;
    },
    {
      enabled: enabled && !!todoId,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  );
};

export const UpdateTodoManager = () => {
  const { updateCaller, isLoading, isSuccess, error, data } =
    useUpdateManager<BaseResponse>(
      `/todos`,
      ["eventTodos", "todo"],
      true
    );

  const updateTodo = async (todoId: string, todoData: UpdateTodoPayload) => {
    try {
      await updateCaller({ ...todoData, _id: todoId });
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  return {
    updateTodo,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export const DeleteTodoManager = ({ todoId }) => {
  const { deleteCaller, isLoading, isSuccess, error, data } =
    useDeleteManager<BaseResponse>(
      `/todos/${todoId}`,
      ["eventTodos"],
      true
    );

  const deleteTodo = async () => {
    try {
      await deleteCaller(undefined);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return {
    deleteTodo,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export const CreateTodoNoteManager = ({ todoId }) => {
  const { postCaller, isLoading, isSuccess, error, data } =
    usePostManager<BaseResponse>(
      `/todos/${todoId}/notes`,
      ["todo", todoId],
      true
    );

  const createNote = async (noteData: CreateNotePayload) => {
    try {
      await postCaller(noteData);
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  return {
    createNote,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export const DeleteTodoNoteManager = ({ todoId, noteId }) => {
  const { deleteCaller, isLoading, isSuccess, error, data } =
    useDeleteManager<BaseResponse>(
      `/todos/${todoId}/notes/${noteId}`,
      ["todo", todoId],
      true
    );

  const deleteNote = async () => {
    try {
      await deleteCaller(undefined);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return {
    deleteNote,
    data,
    isLoading,
    isSuccess,
    error,
  };
};