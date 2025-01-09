import { currentUser } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  videoOrAudioUploader: f({
    video: { maxFileSize: "32MB" },
    audio: { maxFileSize: "32MB" },
  })
    .middleware(async ({ req }) => {
      const user = await currentUser();

      console.log("This is user", user);
      if (!user) throw new UploadThingError("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { userId: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
