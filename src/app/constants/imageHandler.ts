import imageCompression from "browser-image-compression";
import supabase from "../supabaseClient";
import { cloudinaryUpload, cloudinaryDelete, extractPublicIdFromUrl, getCloudinaryConfig } from "./cloudinaryFileAPI";

export const FOLDER = {
  USER_PROFILE: "user_profile_image",
  STARTUP_PROFILE: "startup_profile_image",
  STARTUP_BANNER: "startup_banner",
  POST: "post_image",
  MENTORSHIP_BANNER: "mentorship_banner"
} as const;

type FolderType = (typeof FOLDER)[keyof typeof FOLDER];

const TABLE_MAP = {
  [FOLDER.USER_PROFILE]: {
    table: "users",
    column: "profile_image",
  },
  [FOLDER.STARTUP_PROFILE]: {
    table: "startups",
    column: "display_image",
  },
  [FOLDER.STARTUP_BANNER]: {
    table: "startups",
    column: "cover_image",
  },
  [FOLDER.POST]: {
    table: "posts",
    column: "image_url",
  },
  [FOLDER.MENTORSHIP_BANNER]: {
    table: "mentorship_page",
    column: "image_url",
  },
};

const compressImage = async (file: File | Blob, maxFileSize: number) => {

  const options = {
    maxSizeMB: maxFileSize,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
  };

  try {
    if (file.size * 0.000001 < maxFileSize) return file

    const compressedFile = await imageCompression(file as any, options);
    return compressedFile;
  } catch (error) {
    return file;
  }
};

export const imageHandlerService = {
  uploadImage: async (
    file: File | null,
    folder: FolderType,
    userId: string,
    startupId?: string,
    postId?: string,
    mentorshipId?: string
  ): Promise<string | null> => {
    try {
      if (!file) return null;

      const base64ToBlob = (base64: string): Blob => {
        const byteString = atob(base64.split(',')[1]);
        const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
        const buffer = new ArrayBuffer(byteString.length);
        const intBuffer = new Uint8Array(buffer);
        for (let i = 0; i < byteString.length; i++) {
          intBuffer[i] = byteString.charCodeAt(i);
        }
        return new Blob([buffer], { type: mimeString });
      }

      let uploadData: File | Blob = file;

      if (typeof file === 'string') {
        uploadData = base64ToBlob(file);
      }

      const { table, column } = TABLE_MAP[folder];

      let recordId = "";

      if (folder === FOLDER.USER_PROFILE) recordId = userId;
      if (folder === FOLDER.STARTUP_PROFILE || folder === FOLDER.STARTUP_BANNER) recordId = startupId!;
      if (folder === FOLDER.POST) recordId = postId!;
      if (folder === FOLDER.MENTORSHIP_BANNER) recordId = mentorshipId!;

      /* DELETE OLD IMAGE ONLY FOR PROFILE OR BANNER */

      if (
        folder === FOLDER.USER_PROFILE ||
        folder === FOLDER.STARTUP_PROFILE ||
        folder === FOLDER.STARTUP_BANNER ||
        folder === FOLDER.MENTORSHIP_BANNER
      ) {
        const { data: existing, error: existingError } = await supabase
          .from(table)
          .select(column)
          .eq('id', recordId)
          .single();

        if (existingError) {
          return null;
        }

        const oldImage = existing?.[column as any] as string | null;
        console.log("Deleting old image:", oldImage)

        if (oldImage) {
          const { error } = await supabase.storage
            .from("images")
            .remove([oldImage]);

          if (error) {
            console.log("Error deleting old image:", error);
            return null;
          }
          console.log("Deleted old image successfully")
        }
      }

      /* BUILD FILE PATH */

      const timestamp = Date.now();
      let filePath = "";

      switch (folder) {
        case FOLDER.USER_PROFILE:
          filePath = `${folder}/${userId}/profile_${timestamp}.jpg`;
          break;

        case FOLDER.STARTUP_PROFILE:
          filePath = `${folder}/${startupId}/profile_${timestamp}.jpg`;
          break;

        case FOLDER.STARTUP_BANNER:
          filePath = `${folder}/${startupId}/banner_${timestamp}.jpg`;
          break;

        case FOLDER.POST:
          filePath = `${folder}/${startupId ? startupId : mentorshipId}/${postId}/image_${timestamp}.jpg`;
          break;

        case FOLDER.MENTORSHIP_BANNER:
          filePath = `${folder}/${mentorshipId}/banner_${timestamp}.jpg`;
          break;
      }

      /* COMPRESS IMAGE */

      let maxFileSize = null

      switch (folder) {
        case FOLDER.USER_PROFILE:
          maxFileSize = 0.5; // 0.5MB for user profile images
          break;
        case FOLDER.STARTUP_PROFILE:
          maxFileSize = 0.5; // 0.5MB for startup profile images
          break;
        case FOLDER.STARTUP_BANNER:
          maxFileSize = 1; // 1MB for banner images
          break;
        case FOLDER.MENTORSHIP_BANNER:
          maxFileSize = 1; // 1MB ford banner images
          break;
        case FOLDER.POST:
          maxFileSize = 2; // 2MB for post images
          break;
        default:
          maxFileSize = 1; // Default to 1MB if folder type is unknown
      }

      const compressedUploadImage = await compressImage(uploadData, maxFileSize);

      /* UPLOAD IMAGE */

      console.log("Uploading image:", filePath);
      console.log("Compressed image:", compressedUploadImage);

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, compressedUploadImage, {
          contentType: uploadData.type,
          upsert: true,
        });

      if (uploadError) {
        console.log("Error uploading image:", uploadError);
        return null;
      }

      /* UPDATE DATABASE */

      let query = supabase
        .from(table)
        .update({ [column]: filePath });

      if (folder === FOLDER.USER_PROFILE) {
        query = query.eq("id", userId);
      };

      if (folder === FOLDER.STARTUP_PROFILE || folder === FOLDER.STARTUP_BANNER) {
        query = query.eq("id", startupId).eq("user_id", userId);
      };

      if (folder === FOLDER.POST) {
        query = query.eq("id", postId).eq("user_id", userId);
      };

      if (folder === FOLDER.MENTORSHIP_BANNER) {
        query = query.eq("id", mentorshipId).eq("user_id", userId);
      };

      const { error: updateError } = await query;

      if (updateError) {
        console.log("Error updating database:", updateError);
        return null;
      }

      return filePath;

    } catch (err) {
      return null;
    }
  },
  cloudinaryImageUploader: async (
    file: File | null,
    folder: FolderType,
    userId: string,
    startupId?: string,
    postId?: string,
    mentorshipId?: string
  ): Promise<string | null> => {
    if (!file) return null;

    let folderPath = "";
    const { table, column } = TABLE_MAP[folder];

    const timestamp = Date.now();

    switch (folder) {
      case FOLDER.USER_PROFILE:
        folderPath = `${folder}/${userId}/profile_${timestamp}.jpg`;
        break;
      case FOLDER.STARTUP_PROFILE:
        folderPath = `${folder}/${startupId}/profile_${timestamp}.jpg`;
        break;
      case FOLDER.STARTUP_BANNER:
        folderPath = `${folder}/${startupId}/banner_${timestamp}.jpg`;
        break;
      case FOLDER.POST:
        folderPath = `${folder}/${startupId ? startupId : mentorshipId}/${postId}/image_${timestamp}.jpg`;
        break;
      case FOLDER.MENTORSHIP_BANNER:
        folderPath = `${folder}/${mentorshipId}/banner_${timestamp}.jpg`;
        break;
    }

    try {
      // Determine max file size based on folder type
      let maxFileSize = 1;
      if (folder === FOLDER.USER_PROFILE || folder === FOLDER.STARTUP_PROFILE) {
        maxFileSize = 0.5;
      } else if (folder === FOLDER.STARTUP_BANNER || folder === FOLDER.MENTORSHIP_BANNER) {
        maxFileSize = 1;
      } else if (folder === FOLDER.POST) {
        maxFileSize = 2;
      }

      // DELETE OLD IMAGE ONLY FOR PROFILE OR BANNER TYPES
      if (
        folder === FOLDER.USER_PROFILE ||
        folder === FOLDER.STARTUP_PROFILE ||
        folder === FOLDER.STARTUP_BANNER ||
        folder === FOLDER.MENTORSHIP_BANNER
      ) {
        const { data: existing, error: existingError } = await supabase
          .from(table)
          .select(column)
          .eq('id', folder === FOLDER.USER_PROFILE ? userId : folder === FOLDER.STARTUP_PROFILE || folder === FOLDER.STARTUP_BANNER ? startupId : mentorshipId)
          .single();

        if (!existingError && existing) {
          const oldImageUrl = existing[column as any] as string | null;

          if (oldImageUrl) {
            const publicId = extractPublicIdFromUrl(oldImageUrl);
            if (publicId) {
              const config = getCloudinaryConfig();
              await cloudinaryDelete(publicId, config.API_KEY, config.API_SECRET);
              console.log("Deleted old image:", publicId);
            }
          }
        }
      }

      // Compress image before upload
      const compressedImage = await compressImage(file, maxFileSize);

      // Upload to Cloudinary using reusable API with folder option
      const uploadResponse = await cloudinaryUpload(compressedImage, {
        folder: folderPath
      });

      if (!uploadResponse) {
        console.log("Error uploading to Cloudinary");
        return null;
      }
      const imageUrl = uploadResponse.secure_url;
      console.log("Uploaded cloudinary image URL:", imageUrl);

      /* UPDATE DATABASE */

      let query = supabase
        .from(table)
        .update({ [column]: imageUrl });

      if (folder === FOLDER.USER_PROFILE) {
        query = query.eq("id", userId);
      }

      if (folder === FOLDER.STARTUP_PROFILE || folder === FOLDER.STARTUP_BANNER) {
        query = query.eq("id", startupId).eq("user_id", userId);
      }

      if (folder === FOLDER.POST) {
        query = query.eq("id", postId).eq("user_id", userId);
      }

      if (folder === FOLDER.MENTORSHIP_BANNER) {
        query = query.eq("id", mentorshipId).eq("user_id", userId);
      }

      const { error: updateError } = await query;

      if (updateError) {
        console.log("Error updating database:", updateError);
        return null;
      }
      console.log("Database updated successfully with new image URL:", imageUrl);

      return imageUrl;
    } catch (err) {
      console.log("Error uploading image:", err);
      return null;
    }
  },
};

export const getImageUrl = (filePath: string | undefined | null): string | null => {
  if (!filePath) return null;

  // const { data } = supabase
  //   .storage
  //   .from("images")
  //   .getPublicUrl(filePath);

  return filePath || null;
};