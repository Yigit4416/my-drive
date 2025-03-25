"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { generateSignedUrl } from "~/server/s3";
import { UploadSVG } from "../_allSVG/svgfuncs";
import { createFolder } from "~/server/queries";
import { serverCreateFolder } from "../[...route]/servertoclient";

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
    console.log(typeof ourRoute);
    console.log(Array.isArray(ourRoute));
    const routeString = ourRoute.join("/");
    console.log("Route:", routeString);
    const folderName = inputElement.value;
    const sanitizedFolderName = sanitizeInput(folderName);
    console.log("Folder name:", sanitizedFolderName);
    const routeToSave = routeString + "/" + sanitizedFolderName;
    console.log(`routeToSave: ${routeToSave}`);
    let parentRoute = ourRoute.at(-1);
    if (parentRoute === undefined || parentRoute === "") parentRoute = "root";
    console.log(`parentRoute: ${parentRoute}`);
    const result = serverCreateFolder({
      name: folderName,
      route: routeToSave,
      parentRoute: parentRoute,
      type: "folder",
    })
    return result;
  };

  const handleFileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      console.error("No file selected");
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
        fileName: selectedFile.name,
        contentType: selectedFile.type,
        size: selectedFile.size,
        checksum: checksum,
      });
      console.log("Signed URL:", signedUrlResult);
      toast.info("Uploading file...");
      fetch(signedUrlResult.success.url, {
        method: "PUT",
        body: selectedFile,
        headers: {
          "Content-Type": selectedFile.type,
        },
      })
        .then((response) => {
          if (!response.ok) {
            console.error("Failed to upload file:", response);
            toast.error("Failed to upload file");
            return;
          }
          console.log("File uploaded successfully");
          toast.success("File uploaded successfully");
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
          <Button type="submit">Add {isFolder.label}</Button>
        </form>
      </div>
    );
  }
}

function sanitizeInput(input: string): string {
  if (input.includes("/")) {
    throw new Error("Invalid input: '/' is not allowed.");
  }

  return input.toLowerCase().replace(/\s+/g, "_");
}
