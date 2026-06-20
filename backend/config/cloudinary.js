const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Check file type to assign correct resource_type and folder
    const ext = file.originalname.split('.').pop().toLowerCase();
    let resourceType = 'auto'; // Auto detects images, videos, etc.
    let folder = 'sigaja_uploads';
    
    // Cloudinary needs raw for documents like pdf, doc, etc if not configured otherwise
    if (['pdf', 'doc', 'docx', 'xls', 'xlsx'].includes(ext)) {
       // resourceType = 'raw'; // Un-comment if Cloudinary requires 'raw' for these, 'auto' usually works fine for pdfs nowadays, but let's be safe.
       // Actually 'auto' is generally best in Cloudinary v2 for supported docs like PDF.
       folder = 'sigaja_documents';
    } else {
       folder = 'sigaja_images';
    }

    return {
      folder: folder,
      resource_type: resourceType,
      allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'xls', 'xlsx'], // Allowed formats
      public_id: `${file.fieldname}-${Date.now()}`,
    };
  },
});

module.exports = {
  cloudinary,
  storage,
};
