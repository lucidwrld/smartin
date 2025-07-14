import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Define the main backend base URL
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(
  request: NextRequest,
  { params }: { params: { formId: string } }
) {
  try {
    const { formId } = params;

    if (!formId) {
      return NextResponse.json(
        { error: "Form ID is required" },
        { status: 400 }
      );
    }

    // Parse the request body
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.responses) {
      return NextResponse.json(
        { error: "Name, email, and responses are required" },
        { status: 400 }
      );
    }

    // Prepare payload for main backend
    const payload = {
      ...body,
      formId,
    };

    // Call the main backend to submit form
    const response = await axios.post(
      `${BACKEND_BASE_URL}/event/forms/submission`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({
      status: "success",
      message: "Form submitted successfully",
      data: response.data.data,
    });
  } catch (error: any) {
    console.error("Error submitting form:", error);

    // Handle validation errors from backend
    if (error.response?.status === 400) {
      return NextResponse.json(
        {
          error: "Invalid form data",
          details: error.response.data?.message || error.message,
        },
        { status: 400 }
      );
    }

    // Handle form not found
    if (error.response?.status === 404) {
      return NextResponse.json(
        { error: "Form not found or no longer available" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to submit form",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
