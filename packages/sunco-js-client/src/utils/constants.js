export const VENDOR_ID = 'zendesk'
export const VERSION = '0.1'

// 50 MiB
// https://github.com/zendesk/sunco/blob/fbce88710bfe1232ac0904cf5db13d8bba8a065c/src/controllers/fileHandler.js#L14
export const MAX_FILE_SIZE_IN_BYTES = 50 * 1024 * 1024

export const SUPPORTED_FILE_TYPES =
  '.csv, .doc, .docx, .eml, .gif, .heic, .ics, .jfif, .jpeg, .jpg, .key, .log, .m4a, .m4v, .mov, .mp3, .mp4, .mp4a, .mpeg, .mpg, .mpga, .neon, .numbers, .odt, .oga, .ogg, .ogv, .pages, .pdf, .png, .pps, .ppsx, .ppt, .pptx, .qt, .svg, .tif, .tiff, .txt, .vcf, .wav, .webm, .webp, .wmv, .xls, .xlsx, .xml, .yml, .yaml, .webp'
