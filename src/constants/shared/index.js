// If this changes it also needs to change in styles vars
export const FONT_SIZE = 12;

// TODO: this is an incomplete list, and should probably include exports for all the other icons we use as well
export const ICONS = {
  ELLIPSIS:             'Icon--ellipsis',
  END_CHAT:             'Icon--endChat',
  ERROR_FILL:           'Icon--error-fill',
  PAPERCLIP_SMALL:      'Icon--paperclip-small',
  PREVIEW_DEFAULT:      'Icon--preview-default',
  PREVIEW_DOCUMENT:     'Icon--preview-document',
  PREVIEW_ERROR:        'Icon--preview-error',
  PREVIEW_IMAGE:        'Icon--preview-image',
  PREVIEW_PDF:          'Icon--preview-pdf',
  PREVIEW_PRESENTATION: 'Icon--preview-presentation',
  PREVIEW_SPREADSHEET:  'Icon--preview-spreadsheet',
  PREVIEW_ZIP:          'Icon--preview-zip',
  SEND_CHAT:            'Icon--sendChat',
  MENU:                 'Icon--menu',
  DASH:                 'Icon--dash',
  BACK:                 'Icon--back',
  SUCCESS_CONTACT_FORM: 'Icon--success-contactForm',
  SUCCESS_TALK:         'Icon--success-talk',
  TALK:                 'Icon--talk'
};

export const FILETYPE_ICONS = {
  PDF:      ICONS.PREVIEW_PDF,
  PPT:      ICONS.PREVIEW_PRESENTATION,
  PPTX:     ICONS.PREVIEW_PRESENTATION,
  KEY:      ICONS.PREVIEW_PRESENTATION,
  XLS:      ICONS.PREVIEW_SPREADSHEET,
  XLSX:     ICONS.PREVIEW_SPREADSHEET,
  NUMBERS:  ICONS.PREVIEW_SPREADSHEET,
  CSV:      ICONS.PREVIEW_SPREADSHEET,
  PAGES:    ICONS.PREVIEW_DOCUMENT,
  DOC:      ICONS.PREVIEW_DOCUMENT,
  DOCX:     ICONS.PREVIEW_DOCUMENT,
  PAG:      ICONS.PREVIEW_DOCUMENT,
  RTF:      ICONS.PREVIEW_DOCUMENT,
  TXT:      ICONS.PREVIEW_DOCUMENT,
  GIF:      ICONS.PREVIEW_IMAGE,
  JPEG:     ICONS.PREVIEW_IMAGE,
  JPG:      ICONS.PREVIEW_IMAGE,
  PNG:      ICONS.PREVIEW_IMAGE,
  RAR:      ICONS.PREVIEW_ZIP,
  ZIP:      ICONS.PREVIEW_ZIP
};

export const GA_CATEGORY = 'Zendesk Web Widget';
