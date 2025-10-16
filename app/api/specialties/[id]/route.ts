import { forwardRequest } from "@/lib/api-proxy";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {

    const { id } = await context.params;
    return forwardRequest(req, `/v1/specialties/${id}`);
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {

    const { id } = await context.params;
    return forwardRequest(req, `/v1/specialties/${id}`);
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {

    const { id } = await context.params;
    return forwardRequest(req, `/v1/specialties/${id}`);
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {

    const { id } = await context.params;
    return forwardRequest(req, `/v1/specialties/${id}`);
}