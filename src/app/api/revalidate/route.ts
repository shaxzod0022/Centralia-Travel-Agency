
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
    try {
        const { token, tag, path } = await request.json();

        // Check for secret to confirm this is a valid request
        // We should use a more secure way to manage this secret, but for now we'll check against a hardcoded value 
        // or an environment variable if available. Ideally process.env.REVALIDATION_TOKEN
        const SECRET = process.env.REVALIDATION_TOKEN || "CentraliaRevalidationSecret2024";

        if (token !== SECRET) {
            return NextResponse.json(
                { message: "Invalid token" },
                { status: 401 }
            );
        }

        if (tag) {
            // Next.js 16 revalidateTag requires a second argument 'profile' (e.g. 'max')
            revalidateTag(tag, 'max');
            return NextResponse.json({ revalidated: true, type: 'tag', tag, now: Date.now() });
        }

        if (path) {
            revalidatePath(path);
            return NextResponse.json({ revalidated: true, type: 'path', path, now: Date.now() });
        }

        return NextResponse.json(
            { message: "Missing tag or path param" },
            { status: 400 }
        );
    } catch (err: any) {
        return NextResponse.json(
            { message: "Error revalidating", error: err.message },
            { status: 500 }
        );
    }
}
