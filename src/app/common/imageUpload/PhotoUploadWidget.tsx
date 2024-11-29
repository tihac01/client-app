import { Button, Grid, Header } from "semantic-ui-react";
import PhotoWidgetDropzone from "./PhotoWidgetDropZone";
import { useEffect, useState } from "react";
import PhotoWidgetCropper from "./PhotoWidgetCropper";

interface Props {
  uploading: boolean;
  uploadPhoto: (file: Blob) => void;
}
export default function PhotoUploadWidget({ uploading, uploadPhoto }: Props) {
  const [files, setFiles] = useState<any>([]);
  const [cropper, setCropper] = useState<Cropper>();

  function onCrop() {
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blob) => uploadPhoto(blob!));
    }
  }

  // Cleanup
  useEffect(() => {
    return () => {
      files.forEach((file: object & { preview?: string }) =>
        URL.revokeObjectURL(file.preview!)
      );
    };
  }, [files]);

  return (
    <Grid>
      <Grid.Column width={4}>
        <Header color="teal" content="Step 1 -Add Photo" />
        <PhotoWidgetDropzone setFiles={setFiles} />
      </Grid.Column>
      <Grid.Column width={1} />
      <Grid.Column width={4}>
        <Header color="teal" content="Step 2 -Resize" />
        {files && files.length > 0 && (
          <PhotoWidgetCropper
            setCropper={setCropper}
            imagePreview={files[0].preview}
          />
        )}
      </Grid.Column>
      <Grid.Column width={1} />
      <Grid.Column width={4}>
        <Header color="teal" content="Step 1 -Add Preview" />
        {files && files.length > 0 && (
          <>
            <div
              className="img-preview"
              style={{ minHeight: 200, overflow: "hidden" }}
            />
            <Button.Group widths={2}>
              <Button
                onClick={onCrop}
                positive
                icon="check"
                loading={uploading}
              />
              <Button
                onClick={() => setFiles([])}
                icon="close"
                disabled={uploading}
              />
            </Button.Group>
          </>
        )}
      </Grid.Column>
    </Grid>
  );
}
