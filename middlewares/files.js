import formidable from "formidable";
import { storage } from "@libs/firebase";
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
import fs from "fs/promises";

const deletaAllFiles = async () => {
  const refBucket = ref(storage, "/images/products");
  const { items } = await listAll(refBucket);
  items.map(async (item) => {
    await deleteObject(item);
  });
};

const saveFile = async (req, bucket) => {
  return new Promise((resolve, reject) => {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      if (err) reject(err);
      if (!files.image.originalFilename) {
        return resolve({ ...fields, oldImage: null });
      }
      const newImageName = Date.now() + files.image.originalFilename;
      const ext = newImageName.split(".");
      const imageRef = ref(storage, `images/${bucket}/${newImageName}`);
      try {
        const rawData = await fs.readFile(files.image.filepath);
        const metadata = {
          contentType: `image/${ext[ext.length - 1]}`,
        };
        const { ref: uploadRef } = await uploadBytes(
          imageRef,
          rawData,
          metadata
        );
        const url = await getDownloadURL(uploadRef);

        return resolve({ ...fields, imageUrl: url, image: newImageName });
      } catch (err) {
        reject(err);
      }
    });
  });
};

const deleteFile = async (bucket, image) => {
  const desertRef = ref(storage, `/images/${bucket}/${image}`);
  await deleteObject(desertRef);
};

export { saveFile, deleteFile, deletaAllFiles };
