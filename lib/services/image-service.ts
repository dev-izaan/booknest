'use client';

/**
 * Image service that doesn't rely on paid cloud storage
 * This uses browser-based solutions for image handling
 */

// Convert an image file to a data URL for storage in localStorage
export const imageToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert image to data URL'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsDataURL(file);
  });
};

// Compress an image to reduce size for localStorage
export const compressImage = async (file: File, maxWidth = 800, quality = 0.7): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions while maintaining aspect ratio
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas to Blob conversion failed'));
              return;
            }
            
            // Create a new file from the compressed blob
            const compressedFile = new File(
              [blob],
              file.name,
              {
                type: 'image/jpeg',
                lastModified: Date.now()
              }
            );
            
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Error loading image'));
      };
      
      if (event.target?.result) {
        img.src = event.target.result as string;
      } else {
        reject(new Error('Error reading file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsDataURL(file);
  });
};

// Generate a placeholder image for testing without uploading
export const generatePlaceholderImage = (
  text: string, 
  width = 300, 
  height = 300, 
  bgColor = '#3498db', 
  textColor = '#ffffff'
): string => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return '';
  }
  
  // Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);
  
  // Text
  ctx.fillStyle = textColor;
  ctx.font = `${Math.floor(width / 10)}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Wrap text
  const words = text.split(' ');
  const lineHeight = Math.floor(width / 8);
  let line = '';
  let y = height / 2 - ((words.length - 1) * lineHeight) / 2;
  
  words.forEach(word => {
    const testLine = line + word + ' ';
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > width - 20 && line !== '') {
      ctx.fillText(line, width / 2, y);
      line = word + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  });
  
  ctx.fillText(line, width / 2, y);
  
  return canvas.toDataURL('image/png');
};

// Function to handle image uploads for a free solution
export const uploadImage = async (file: File): Promise<string> => {
  try {
    // First compress the image to save space in localStorage
    const compressedFile = await compressImage(file);
    
    // Convert to data URL for localStorage storage
    const dataUrl = await imageToDataUrl(compressedFile);
    
    // This is where you would normally upload to Firebase Storage
    // Instead, we'll just return the data URL to be saved in localStorage
    return dataUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}; 