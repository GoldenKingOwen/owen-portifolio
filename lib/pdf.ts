import type { PDFDocumentProxy } from "pdfjs-dist";

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

/**
 * Fetches a PDF as raw bytes and rasterizes its first page onto `canvas`,
 * scaled to `targetWidthCssPx` (accounting for devicePixelRatio). Used for
 * both the certification thumbnails and the full-size modal view — the
 * canvas holds only pixels, never a reference back to the file's URL.
 */
export async function renderPdfFirstPage(
  fileUrl: string,
  canvas: HTMLCanvasElement,
  targetWidthCssPx: number,
  signal?: AbortSignal
): Promise<void> {
  const pdfjsLib = await getPdfjs();
  const response = await fetch(fileUrl, { signal });
  const data = await response.arrayBuffer();
  if (signal?.aborted) return;

  const loadingTask = pdfjsLib.getDocument({ data });
  try {
    const doc: PDFDocumentProxy = await loadingTask.promise;
    if (signal?.aborted) return;
    const page = await doc.getPage(1);
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const baseViewport = page.getViewport({ scale: 1 });
    const scale = (targetWidthCssPx * dpr) / baseViewport.width;
    const viewport = page.getViewport({ scale });

    canvas.width = viewport.width;
    canvas.height = viewport.height;
    canvas.style.width = `${targetWidthCssPx}px`;
    canvas.style.height = `${targetWidthCssPx / (baseViewport.width / baseViewport.height)}px`;

    if (signal?.aborted) return;
    await page.render({ canvas, viewport }).promise;
  } finally {
    loadingTask.destroy();
  }
}
