"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { generateSignedUrl } from "~/server/s3";
import { UploadSVG } from "../_allSVG/svgfuncs";
import {
  serverCreateFile,
  serverCreateFolder,
} from "../[...route]/servertoclient";
import { useRouter } from "next/navigation"; // Changed from next/router to next/navigation

type Status = {
  value: string;
  label: string;
};

// Need to make sure that when starting uploading it should unable the button and only after uploading finishes it will allow it (also check for did i look for item is emptey or not)
export default function FileFolderAdder({
  isFolder,
  ourRoute,
}: {
  isFolder: Status | null;
  ourRoute: Array<string>;
}) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const router = useRouter(); // Initialize the router

  if (isFolder === null) return null;

  const handleFolderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputElement = e.currentTarget[0] as HTMLInputElement;
    if (!inputElement?.value) {
      toast.error("Please enter a folder name");
      return;
    }
    let routeString = ourRoute.join("/");
    routeString = "/" + routeString;
    const folderName = inputElement.value;
    const sanitizedFolderName = sanitizeInput(folderName);
    const routeToSave = routeString + "/" + sanitizedFolderName;
    let parentRoute = ourRoute.at(-1);
    if (parentRoute === undefined || parentRoute === "") parentRoute = "root";
    try {
      const result = await serverCreateFolder({
        name: folderName,
        route: routeToSave,
        parentRoute: routeString,
        type: "folder",
      });
      if (!result) {
        toast.error("Something went wrong");
        return;
      }
      toast.success("Folder added");

      // Refresh the current page to show the new folder
      router.refresh();

      // Reset the form
      inputElement.value = "";

      return result;
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFiles.length) {
      toast.error("No files selected");
      return;
    }

    const computeSHA256 = async (file: File) => {
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    };

    const uploadTasks = selectedFiles.map(async (file) => {
      const checksum = await computeSHA256(file);

      try {
        const signedUrlResult = await generateSignedUrl({
          contentType: file.type,
          size: file.size,
          checksum,
        });

        toast.info(`Uploading ${file.name}...`);
        const uploadResponse = await fetch(signedUrlResult.success.url, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        if (!uploadResponse.ok) {
          toast.error(`Failed to upload ${file.name}`);
          return;
        }

        await serverCreateFile({
          name: file.name,
          type: file.type,
          size: file.size,
          insiderName: signedUrlResult.success.fileName,
          folder: `/${ourRoute.join("/")}`,
        });

        toast.success(`${file.name} uploaded`);
      } catch (err) {
        toast.error(`Error uploading ${file.name}`);
        console.error(err);
      }
    });

    // Used this so if we have a fail it won't cancel all of the uploads
    // If we used Promise.all if #3 fails it won't make 4 and others.
    await Promise.allSettled(uploadTasks);

    setSelectedFiles([]);
    router.refresh();
  };
  if (isFolder.value === "folder") {
    return (
      <div className="mt-4">
        <form className="flex flex-col gap-4" onSubmit={handleFolderSubmit}>
          <Input placeholder={`Enter ${isFolder.value} name`} name="value" />
          <Button type="submit">Add {isFolder.label}</Button>
        </form>
      </div>
    );
  } else {
    return (
      <div className="mt-4">
        <form className="flex flex-col gap-4" onSubmit={handleFileSubmit}>
          <label className="flex cursor-pointer items-center gap-2">
            <span className="flex rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
              <div className="pr-1">
                <UploadSVG />
              </div>
              Upload File
            </span>
            <input
              multiple
              type="file"
              name="file"
              accept="image/*, application/pdf, image/gif, video/mp4, video/webm"
              className="hidden"
              onChange={(e) => {
                const files = e.target.files;
                if (!files) return;
                setSelectedFiles(Array.from(files));
              }}
            />
          </label>
          {/* Need to this forms multiple file thing */}
          {selectedFiles.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              {selectedFiles.map((file, index) => (
                <div key={index} className="mb-2">
                  <p>File Name: {file.name}</p>
                  <p>File Size: {(file.size / 1024).toFixed(2)} KB</p>
                  <p>File Type: {file.type || "Unknown"}</p>
                </div>
              ))}
            </div>
          )}
          <Button type="submit" disabled={!selectedFiles}>
            Add {isFolder.label}
          </Button>
        </form>
      </div>
    );
  }
}

function sanitizeInput(input: string): string {
  if (input.includes("/")) {
    throw new Error("Invalid input: '/' is not allowed.");
  }

  // First normalize the text by replacing special characters
  const replacements: { [key: string]: string } = {
    ğ: "g",
    Ğ: "G",
    ı: "i",
    I: "I",
    İ: "I",
    ş: "s",
    Ş: "S",
    ç: "c",
    Ç: "C",
    ö: "o",
    Ö: "O",
    ü: "u",
    Ü: "U",
  };

  // Replace each special character with its English counterpart
  let sanitized = input;
  for (const [char, replacement] of Object.entries(replacements)) {
    sanitized = sanitized.replace(new RegExp(char, "g"), replacement);
  }

  // Convert to lowercase and replace spaces with underscores
  return sanitized.toLowerCase().replace(/\s+/g, "_");
}
