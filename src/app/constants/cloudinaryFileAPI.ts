// Cloudinary Configuration
const CLOUDINARY_CONFIG = {
  CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "fc3sxsyx",
  UPLOAD_PRESET: "adumun-media-storage",
  API_KEY: import.meta.env.VITE_CLOUDINARY_API_KEY || "",
  API_SECRET: import.meta.env.VITE_CLOUDINARY_API_SECRET || "",
  API_BASE_URL: "https://api.cloudinary.com/v1_1",
};

// Types for API responses and requests
export interface CloudinaryUploadResponse {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  original_filename: string;
}

export interface CloudinaryDeleteResponse {
  result: string;
}

export interface CloudinaryApiError {
  error: {
    message: string;
  };
}

export interface UploadOptions {
  folder?: string;
  tags?: string[];
  public_id?: string;
  overwrite?: boolean;
  resource_type?: string;
  type?: string;
  eager?: string;
  eager_async?: boolean;
  eager_notification_url?: string;
}

// Upload file to Cloudinary
export const cloudinaryUpload = async (
  file: File | Blob,
  options?: UploadOptions
): Promise<CloudinaryUploadResponse | null> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_CONFIG.UPLOAD_PRESET);

    if (options?.folder) {
      formData.append("folder", options.folder);
    }

    if (options?.tags && options.tags.length > 0) {
      formData.append("tags", options.tags.join(","));
    }

    if (options?.public_id) {
      formData.append("public_id", options.public_id);
    }

    if (options?.overwrite !== undefined) {
      formData.append("overwrite", String(options.overwrite));
    }

    if (options?.resource_type) {
      formData.append("resource_type", options.resource_type);
    }

    if (options?.type) {
      formData.append("type", options.type);
    }

    const response = await fetch(
      `${CLOUDINARY_CONFIG.API_BASE_URL}/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = (await response.json()) as CloudinaryApiError;
      console.error("Cloudinary upload error:", errorData);
      return null;
    }

    const data = (await response.json()) as CloudinaryUploadResponse;
    return data;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return null;
  }
};

// Delete file from Cloudinary by public_id (requires API key)
export const cloudinaryDelete = async (
  publicId: string,
  apiKey?: string,
  apiSecret?: string
): Promise<CloudinaryDeleteResponse | null> => {
  try {
    // For unsigned delete via destroy endpoint - this may not work without authentication
    // If you have API credentials, pass them in. Otherwise, delete from backend with auth.

    const formData = new FormData();
    formData.append("public_id", publicId);

    // If API credentials provided, add signature for authenticated request
    if (apiKey && apiSecret) {
      const timestamp = Math.floor(Date.now() / 1000);
      formData.append("api_key", apiKey);
      formData.append("timestamp", String(timestamp));

      // Create signature: sha1("public_id={public_id}&timestamp={timestamp}{api_secret}")
      const signatureString = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
      const signature = await sha1(signatureString);
      formData.append("signature", signature);
    } else {
      // Fallback to upload_preset if no API credentials
      formData.append("upload_preset", CLOUDINARY_CONFIG.UPLOAD_PRESET);
    }

    const response = await fetch(
      `${CLOUDINARY_CONFIG.API_BASE_URL}/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/destroy`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = (await response.json()) as CloudinaryApiError;
      console.error("Cloudinary delete error:", errorData);
      return null;
    }

    const data = (await response.json()) as CloudinaryDeleteResponse;
    console.log("File deleted successfully:", publicId);
    return data;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return null;
  }
};

// Helper function to create SHA1 signature
const sha1 = async (message: string): Promise<string> => {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-1", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

// Update/Replace file on Cloudinary
export const cloudinaryUpdate = async (
  file: File | Blob,
  publicId: string,
  options?: Omit<UploadOptions, "public_id">
): Promise<CloudinaryUploadResponse | null> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_CONFIG.UPLOAD_PRESET);
    formData.append("public_id", publicId);
    formData.append("overwrite", "true");

    if (options?.folder) {
      formData.append("folder", options.folder);
    }

    if (options?.tags && options.tags.length > 0) {
      formData.append("tags", options.tags.join(","));
    }

    if (options?.resource_type) {
      formData.append("resource_type", options.resource_type);
    }

    if (options?.type) {
      formData.append("type", options.type);
    }

    const response = await fetch(
      `${CLOUDINARY_CONFIG.API_BASE_URL}/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = (await response.json()) as CloudinaryApiError;
      console.error("Cloudinary update error:", errorData);
      return null;
    }

    const data = (await response.json()) as CloudinaryUploadResponse;
    console.log("File updated successfully:", publicId);
    return data;
  } catch (error) {
    console.error("Error updating file on Cloudinary:", error);
    return null;
  }
};

// Get public URL from Cloudinary
export const getCloudinaryUrl = (publicId: string): string => {
  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload/${publicId}`;
};

// Extract public_id from Cloudinary URL
export const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    const match = url.match(
      /\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/
    );
    return match ? match[1] : null;
  } catch (error) {
    console.error("Error extracting public_id from URL:", error);
    return null;
  }
};

// Batch delete multiple files
export const cloudinaryBatchDelete = async (
  publicIds: string[]
): Promise<{ deleted: string[]; failed: string[] }> => {
  const deleted: string[] = [];
  const failed: string[] = [];

  for (const publicId of publicIds) {
    const result = await cloudinaryDelete(publicId, CLOUDINARY_CONFIG.API_KEY, CLOUDINARY_CONFIG.API_SECRET);
    if (result) {
      deleted.push(publicId);
    } else {
      failed.push(publicId);
    }
  }

  return { deleted, failed };
};

// Update Cloudinary configuration (useful for testing or dynamic config)
export const setCloudinaryConfig = (
  cloudName?: string,
  uploadPreset?: string
): void => {
  if (cloudName) {
    CLOUDINARY_CONFIG.CLOUD_NAME = cloudName;
  }
  if (uploadPreset) {
    CLOUDINARY_CONFIG.UPLOAD_PRESET = uploadPreset;
  }
};

// Get current Cloudinary configuration
export const getCloudinaryConfig = () => {
  return { ...CLOUDINARY_CONFIG };
};
