import { createClient } from '../../../supabase/client';

export async function uploadImages(files: FileList): Promise<{ fileName: string; fileType: string }[]> {
  const supabase = createClient();
  const uploadedFiles: { fileName: string; fileType: string }[] = [];

  for (const file of files) {
    const fileName = `${Date.now()}-${file.name}`;
    console.log(`Uploading file: ${fileName}`); // Log file upload start

    // Upload the file to Supabase storage
    const { error } = await supabase.storage.from('property-image').upload(fileName, file);

    if (error) {
      console.error('Error uploading file:', error.message);
    } else {
      console.log(`File successfully uploaded: ${fileName}`);
      uploadedFiles.push({
        fileName,
        fileType: file.type,
      });
    }
  }

  return uploadedFiles;
}
