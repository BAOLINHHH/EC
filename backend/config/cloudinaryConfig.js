// import { v2 as cloudinary } from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
cloudinary.config({ 
    cloud_name: 'dsiokmgdj', 
    api_key: '829151628145351', 
    api_secret: 'oLDkvFHl5KYmdYqaBmeJqtobGjA'
});
const storage = new CloudinaryStorage({ 
    cloudinary,
    allowedFormats: ['jpg', 'png','mp3','*'],
  params: {
    folder: "upload"
  }
});
const uploadCloud = multer ({storage})
export default uploadCloud
