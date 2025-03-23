"use client";

import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { generateSignedUrl } from "~/server/s3";

function UploadSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
      />
    </svg>
  );
}

type Status = {
  value: string;
  label: string;
};

export default function FileFolderAdder({
  isFolder,
}: {
  isFolder: Status | null;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (isFolder === null) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleFileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;

    console.log("Form data:", formData);
    console.log("File: ", file);

    if (file) {
      console.log("File name:", file.name);
      console.log("File size:", file.size);
      console.log("File type:", file.type);
    }
    try {
      const signedUrlResult = await generateSignedUrl({
        fileName: selectedFile.name,
        contentType: selectedFile.type,
      });
      console.log("Signed URL:", signedUrlResult);
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
            return;
          }
          console.log("File uploaded successfully");
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    } catch (error) {
      console.error("Error getting signed URL:", error);
      return;
    }
  };

  if (isFolder.value === "folder") {
    return (
      <div className="mt-4">
        <form className="flex flex-col gap-4">
          <Input placeholder={`Enter ${isFolder.value} name`} />
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
