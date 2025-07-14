import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Define the main backend base URL
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function GET(
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

    // Call the main backend to get single form
    const response = await axios.get(
      `${BACKEND_BASE_URL}/event/forms/${formId}`
    );

    if (!response.data || !response.data.data) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const form = response.data.data;

    // Check if form is active and public accessible
    if (form.is_active === false) {
      return NextResponse.json(
        { error: "Form is not currently available" },
        { status: 403 }
      );
    }

    // Return the form data (this is safe for public consumption as it's a single form)
    return NextResponse.json({
      status: "success",
      message: "Form retrieved successfully",
      data: form,
    });
  } catch (error: any) {
    console.error("Error fetching form:", error);

    if (error.response?.status === 404) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        error: "Failed to fetch form",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
