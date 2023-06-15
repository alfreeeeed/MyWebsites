function test (){
  applyBlur("imgs/icon.png", 10, "box");
  console.log("bttn worked");
}
let blurredImageData; // Variable to store the blurred image data

function applyBlur(imagePath, kernelSize, blurType) {
  fetch(imagePath)
    .then(response => response.blob())
    .then(blob => createImageBitmap(blob))
    .then(imageBitmap => {
      // Create a canvas element and get its 2D context
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      // Set the canvas dimensions to match the image
      canvas.width = imageBitmap.width;
      canvas.height = imageBitmap.height;

      // Draw the imageBitmap onto the canvas
      context.drawImage(imageBitmap, 0, 0);

      // Get the pixel data from the canvas
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      // Apply the specified blur algorithm
      if (blurType === 'box') {
        applyBoxBlurAlgorithm(pixels, canvas.width, canvas.height, kernelSize);
      } else if (blurType === 'gaussian') {
        applyGaussianBlurAlgorithm(pixels, canvas.width, canvas.height, kernelSize);
      } else {
        console.error('Invalid blur type. Please choose either "box" or "gaussian".');
        return;
      }

      // Put the blurred pixel data back onto the canvas
      imageData.data.set(pixels);
      context.putImageData(imageData, 0, 0);

      // Save the blurred image data
      blurredImageData = canvas.toDataURL();
      document.getElementById("blurredImage").src = blurredImageData;
    })
    .catch(error => {
      console.error('Error loading the image:', error);
    });
}


function applyBoxBlurAlgorithm(pixels, width, height, kernelSize) {
  const side = Math.floor(kernelSize / 2);
  const length = pixels.length;
  const blurredPixels = new Uint8ClampedArray(length);

  for (let i = 0; i < length; i += 4) {
    const averageRGBA = [0, 0, 0, 0];
    let count = 0;

    for (let x = -side; x <= side; x++) {
      for (let y = -side; y <= side; y++) {
        const pixelIndex = i + (x * 4) + (y * width * 4);

        if (pixelIndex >= 0 && pixelIndex < length) {
          averageRGBA[0] += pixels[pixelIndex];
          averageRGBA[1] += pixels[pixelIndex + 1];
          averageRGBA[2] += pixels[pixelIndex + 2];
          averageRGBA[3] += pixels[pixelIndex + 3];
          count++;
        }
      }
    }

    blurredPixels[i] = averageRGBA[0] / count;
    blurredPixels[i + 1] = averageRGBA[1] / count;
    blurredPixels[i + 2] = averageRGBA[2] / count;
    blurredPixels[i + 3] = averageRGBA[3] / count;
  }

  pixels.set(blurredPixels);
}

function applyGaussianBlurAlgorithm(pixels, width, height, kernelSize) {
  const side = Math.floor(kernelSize / 2);
  const kernel = generateGaussianKernel(kernelSize);
  const length = pixels.length;
  const blurredPixels = new Uint8ClampedArray(length);

  for (let i = 0; i < length; i += 4) {
    const averageRGBA = [0, 0, 0, 0];

    for (let x = -side; x <= side; x++) {
      for (let y = -side; y <= side; y++) {
        const pixelIndex = i + (x * 4) + (y * width * 4);
        const kernelIndex = (x + side) * kernelSize + (y + side);

        if (pixelIndex >= 0 && pixelIndex < length) {
          averageRGBA[0] += pixels[pixelIndex] * kernel[kernelIndex];
          averageRGBA[1] += pixels[pixelIndex + 1] * kernel[kernelIndex];
          averageRGBA[2] += pixels[pixelIndex + 2] * kernel[kernelIndex];
          averageRGBA[3] += pixels[pixelIndex + 3] * kernel[kernelIndex];
        }
      }
    }

    blurredPixels[i] = averageRGBA[0];
    blurredPixels[i + 1] = averageRGBA[1];
    blurredPixels[i + 2] = averageRGBA[2];
    blurredPixels[i + 3] = averageRGBA[3];
  }

  pixels.set(blurredPixels);
}

function generateGaussianKernel(kernelSize) {
  const kernel = [];
  const sigma = kernelSize / 6;
  const mean = Math.floor(kernelSize / 2);
  let sum = 0;

  for (let x = 0; x < kernelSize; x++) {
    for (let y = 0; y < kernelSize; y++) {
      const value = gaussianFunction(x, y, mean, mean, sigma);
      kernel.push(value);
      sum += value;
    }
  }

  // Normalize the kernel
  for (let i = 0; i < kernel.length; i++) {
    kernel[i] /= sum;
  }

  return kernel;
}

function gaussianFunction(x, y, meanX, meanY, sigma) {
  const exponent = -((x - meanX) ** 2 + (y - meanY) ** 2) / (2 * sigma ** 2);
  const coefficient = 1 / (2 * Math.PI * sigma ** 2);
  return coefficient * Math.exp(exponent);
}
