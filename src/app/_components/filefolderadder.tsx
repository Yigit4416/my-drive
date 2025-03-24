"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { generateSignedUrl } from "~/server/s3";
import { UploadSVG } from "../_allSVG/svgfuncs";

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
    const computeSHA256 = async (file: File) => {
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
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
