import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Define the main backend base URL
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const { eventId } = params;

    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    // Call the main backend to get all event forms
    const response = await axios.get(
      `${BACKEND_BASE_URL}/event/${eventId}/forms`
    );

    if (!response.data || !response.data.data) {
      return NextResponse.json({
        status: "success",
        message: "No forms found for this event",
        data: {
          hasRequiredForms: false,
          requiredForms: [],
        },
      });
    }

    const forms = response.data.data;

    // Filter only required and active forms
    const requiredForms = forms
      .filter((form: any) => form.is_required && form.is_active)
      .map((form: any) => ({
        id: form._id || form.id,
        name: form.name || form.description,
        isRequired: form.is_required,
        isActive: form.is_active,
      }));

    const result = {
      hasRequiredForms: requiredForms.length > 0,
      requiredForms,
    };

    return NextResponse.json({
      status: "success",
      message: "Forms metadata retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Error fetching forms metadata:", error);

    // Handle different error scenarios
    if (error.response?.status === 404) {
      return NextResponse.json({
        status: "success",
        message: "No forms found for this event",
        data: {
          hasRequiredForms: false,
          requiredForms: [],
        },
      });
    }

    return NextResponse.json(
      {
        error: "Failed to fetch forms metadata",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
