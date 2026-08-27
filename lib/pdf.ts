let workerConfigured = false;

async function getPdfjs() {
  const pdfjsLib = await import("pdfjs-dist");
  if (!workerConfigured) {
    // Static `new URL(..., import.meta.url)` is understood by both Webpack
    // and Turbopack, which emit pdf.worker.min.mjs as its own asset.
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();
    workerConfigured = true;
  }
  return pdfjsLib;
}
