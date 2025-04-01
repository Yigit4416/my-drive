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

export default function FileFolderAdder({
  isFolder,
  ourRoute,
}: {
  isFolder: Status | null;
  ourRoute: Array<string>;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter(); // Initialize the router

  if (isFolder === null) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

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
    if (!selectedFile) {
      console.error("No file selected");
      toast.error("No file selected");
      return;
    }
    const computeSHA256 = async (file: File) => {
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
      return hashHex;
    };
    const checksum = await computeSHA256(selectedFile);

    try {
      const signedUrlResult = await generateSignedUrl({
        contentType: selectedFile.type,
        size: selectedFile.size,
        checksum: checksum,
      });
      toast.info("Uploading file...");
      fetch(signedUrlResult.success.url, {
        method: "PUT",
        body: selectedFile,
        headers: {
          "Content-Type": selectedFile.type,
        },
      })
        .then(async (response) => {
          if (!response.ok) {
            console.error("Failed to upload file:", response);
            toast.error("Failed to upload file");
            return;
          }
          toast.success("File uploaded successfully");
          let routeString = ourRoute.join("/");
          routeString = "/" + routeString;
          const result = await serverCreateFile({
            name: selectedFile.name,
            type: selectedFile.type,
            size: selectedFile.size,
            insiderName: signedUrlResult.success.fileName,
            folder: routeString ?? "root",
          });
          toast.success("File added to db");

          // Refresh the current page to show the new file
          router.refresh();

          // Reset the file selection
          setSelectedFile(null);

          return result;
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    } catch (error) {
      console.error("Error getting signed URL:", error);
      toast.error("File is larger than 5MB");
    }
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
              type="file"
              name="file"
              accept="image/jpeg, image/png, application/pdf, image/gif, video/mp4, video/webm"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          {selectedFile && (
            <div className="mt-2 text-sm text-gray-600">
              <p>File Name: {selectedFile.name}</p>
              <p>File Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
              <p>File Type: {selectedFile.type || "Unknown"}</p>
            </div>
          )}
          <Button type="submit" disabled={!selectedFile}>
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
