// src/utils/S3Buket/s3-Service.js

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createReadStream } from "fs";
import dotenv from "dotenv";
import { storageTypes } from "../multer.js";

dotenv.config();

class S3BucketService {
  client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  // upload single file
  uploadFile = async (
    file,
    keyPrefix = "online/user/profilePic",
    userId
  ) => {
    const key = `${keyPrefix}/${userId}/${Date.now()}-${file.originalname
      }`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.client.send(command);

    return key;
  };

  // upload large files
  uploadLargeFile = async (
    file,
    keyPrefix = "online/user/profilePic",
    uploadApproach = storageTypes.disk
  ) => {
    const key = `${keyPrefix}/${Date.now()}-${file.originalname}`;

    const command = new Upload({
      client: this.client,

      params: {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,

        Body:
          uploadApproach === storageTypes.memory
            ? file.buffer
            : createReadStream(file.path),

        ContentType: file.mimetype,
      },
      //بيرفع 4 أجزاء بالتوازي، كل جزء 5MB
      queueSize: 4,
      partSize: 5 * 1024 * 1024,
    });

    command.on("httpUploadProgress", (progress) => {
      console.log(progress);
      /*uploaded bytes
total bytes
percentage */
    });

    const response = await command.done();

    return {
      response,
      key
    };
  };

  // upload multiple files
  uploadFiles = async (
    files,
    keyPrefix = "online/user/coverPic",
    uploadApproach = storageTypes.memory,
    userId
  ) => {
    const keys = await Promise.all(
      files.map((file) => {
        return uploadApproach === storageTypes.memory
          ? this.uploadFile(file, keyPrefix, userId)
          : this.uploadLargeFile(
            file,
            keyPrefix,
            uploadApproach
          );
      })
    );

    return keys;
  };

  // generate presigned upload url
  getUploadFilePreSignedUrl = async (
    file,
    keyPrefix = "online/user/profilePic"
  ) => {
    const key = `${keyPrefix}/${Date.now()}-${file.originalname
      }`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: file.mimetype,
    });

    const url = await getSignedUrl(
      this.client,
      command,
      {
        expiresIn: 3600,
      }
    );

    return {
      key,
      url,
    };
  };

  // generate signed url to read image
  getPhotoSignedUrl = async (
    key,
    expiresIn = 3600
  ) => {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    const url = await getSignedUrl(
      this.client,
      command,
      {
        expiresIn,
      }
    );

    return {
      key,
      url,
    };
  };

  // get file object
  getFile = async (key) => {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    return await this.client.send(command);
  };

  // delete file
  deleteFile = async (key) => {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    return await this.client.send(command);
  };
}

export default new S3BucketService();