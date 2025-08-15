export const CONFIG = {
    PORT: 3000,
    DB_URL: 'mongodb://localhost:27017/pisignage-server',
    
    // Media directories
    mediaDir: './media',
    thumbnailDir: './media/_thumbnails',
    mediaPath: './media/',
    
    // File type regex patterns
    filenameRegex: /[^a-zA-Z0-9._-]/g,
    zipfileRegex: /\.zip$/i,
    brandRegex: /^brand.*\.(mp4|avi|mov)$/i,
    imageRegex: /\.(jpg|jpeg|png|gif|bmp|tiff|webp)$/i,
    videoRegex: /\.(mp4|avi|mov|mkv|wmv|flv|webm|m4v)$/i,
    audioRegex: /\.(mp3|wav|aac|flac|ogg|m4a)$/i,
    htmlRegex: /\.html?$/i,
    liveStreamRegex: /^live.*\.(mp4|m3u8)$/i,
    omxStreamRegex: /^omx.*\.(mp4|m3u8)$/i,
    mediaRss: /\.rss$/i,
    CORSLink: /^cors.*\.(mp4|m3u8)$/i,
    linkUrlRegex: /^https?:\/\//i,
    gcalRegex: /\.gcal$/i,
    pdffileRegex: /\.pdf$/i,
    txtFileRegex: /\.txt$/i,
    radioFileRegex: /\.radio$/i,
    noticeRegex: /\.notice$/i,
    
    // System assets
    systemAssets: []
};