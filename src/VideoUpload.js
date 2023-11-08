import { useState } from "react";
import mp4box from "mp4box";
import "./style.css";

export default function VideoUpload() {
  const [metadata, setMetadata] = useState();
  const [codec, setCodec] = useState();

  const getCodec = (data) => {
    const { tracks, otherTracks } = data;

    console.log(
      "types:",
      tracks.map((track) => track.type)
    );
    console.log(
      "types:",
      otherTracks.map((track) => track.type)
    );

    const video = tracks.find((track) => track.type === "video");
    if (!video) {
      console.warn("no video track?");
    }
    setCodec(video?.codec || "—");
  };

  const handleChange = async (event) => {
    try {
      setMetadata(null);
      setCodec(null);
      const [file] = event.target.files;
      console.log(file);

      const buffer = await file.arrayBuffer();
      buffer.fileStart = 0; // https://github.com/gpac/mp4box.js/blob/master/README.md#appendbufferdata
      const mp4boxfile = mp4box.createFile();
      mp4boxfile.onReady = (info) => {
        console.log("onReady");
        setMetadata(JSON.stringify(info, null, 2));
        getCodec(info);
      };
      mp4boxfile.onError = (error) => console.log(error);
      mp4boxfile.appendBuffer(buffer);
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <div className="videoupload">
      <form>
        <label for="file">Select a video file</label>
        <input type="file" id="file" onChange={handleChange} />
        <input type="reset" />
      </form>
      <hr />
      {metadata && (
        <>
          Codec is {codec}
          <h6>Metadata:</h6>
          <pre style={{ font: "10px/1 monospace" }}>{metadata}</pre>
        </>
      )}
    </div>
  );
}


