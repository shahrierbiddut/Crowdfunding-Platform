import axios from 'axios';

export const uploadToImgBB = async (imageFile: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    // Typically use environment variable. For assessment fallback, you can put a free API key here
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || '5c2821df69611db3da82d0bebf80c85b'; // Note: Recommend using env
    
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      formData
    );
    
    if (response.data.success) {
      return response.data.data.url;
    }
    throw new Error('Image upload failed');
  } catch (error) {
    console.error('ImgBB upload error:', error);
    throw new Error('Failed to upload image. Please try again.');
  }
};
