function test (){
  console.log("bttn worked");
}

let blurredImageData; // Variable to store the blurred image data

function applyBlur(imagePath, kernelSize, blurType, outputId) {
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
      const blurredImageData = canvas.toDataURL();

      // Set the source and ID of the final image tag
      const blurredImage = document.createElement('img');
      blurredImage.src = blurredImageData;
      blurredImage.id = outputId;

      // Append the blurred image to a container or replace an existing image
      const container = document.getElementById(outputId);
      container.parentNode.replaceChild(blurredImage, container);
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
  const radius = Math.floor(kernelSize / 2);
  const sigma = radius / 3; // Adjust the sigma value as desired

  const kernel = generateGaussianKernel(kernelSize, sigma);

  const tempData = new Uint8ClampedArray(pixels.length);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      let weightSum = 0;

      for (let ky = -radius; ky <= radius; ky++) {
        for (let kx = -radius; kx <= radius; kx++) {
          const weight = kernel[ky + radius][kx + radius];
          const pixelOffset = ((y + ky) * width + (x + kx)) * 4;

          r += pixels[pixelOffset] * weight;
          g += pixels[pixelOffset + 1] * weight;
          b += pixels[pixelOffset + 2] * weight;
          a += pixels[pixelOffset + 3] * weight;
          weightSum += weight;
        }
      }

      const pixelOffset = (y * width + x) * 4;

      tempData[pixelOffset] = r / weightSum;
      tempData[pixelOffset + 1] = g / weightSum;
      tempData[pixelOffset + 2] = b / weightSum;
      tempData[pixelOffset + 3] = a / weightSum;
    }
  }

  pixels.set(tempData);
}

function generateGaussianKernel(kernelSize, sigma) {
  const kernel = [];
  const radius = Math.floor(kernelSize / 2);

  let sum = 0;

  for (let y = -radius; y <= radius; y++) {
    const row = [];
    for (let x = -radius; x <= radius; x++) {
      const weight = gaussianFunction(x, y, sigma);
      row.push(weight);
      sum += weight;
    }
    kernel.push(row);
  }

  // Normalize the kernel
  for (let y = 0; y < kernelSize; y++) {
    for (let x = 0; x < kernelSize; x++) {
      kernel[y][x] /= sum;
    }
  }

  return kernel;
}

function gaussianFunction(x, y, sigma) {
  const exponent = -(x * x + y * y) / (2 * sigma * sigma);
  return Math.exp(exponent) / (2 * Math.PI * sigma * sigma);
}

const slider = document.getElementById('slider');
const sliderValue = document.getElementById('sliderValue');
let timeoutId;

slider.addEventListener('input', function() {
  const value = parseInt(slider.value);

  // Update the value displayed on the right side of the slider
  if (value === 0) {
    sliderValue.textContent = 'Off';
  } else {
    sliderValue.textContent = value;
  }

  // Clear the previous timeout if it exists
  clearTimeout(timeoutId);

  // Run your function after a delay of 1 second
  timeoutId = setTimeout(function() {
    applyBlur("imgs/icon.png", value, "box", "blurredImage");
  }, 200);
});
