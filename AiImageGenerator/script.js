const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");

const PEXELS_API_KEY = "your api key here"; 
let isImageGenerating = false;

const updateImageCard = (imgUrls) => {
  imgUrls.forEach((url, index) => {
    const imgCard = imageGallery.querySelectorAll(".img-card")[index];
    const imgElement = imgCard.querySelector("img");
    const downloadBtn = imgCard.querySelector(".download-btn");
    
    imgElement.src = url;
    imgElement.onload = () => {
      imgCard.classList.remove("loading");
      downloadBtn.setAttribute("href", url);
      downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
    };
  });
};

const generateAiImages = async (userPrompt, userImgQuantity) => {
  try {
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(userPrompt)}&per_page=${userImgQuantity}`, {
      method: "GET",
      headers: {
        Authorization: PEXELS_API_KEY
      }
    });

    if (!response.ok) throw new Error("Failed to fetch images from Pexels!");

    const data = await response.json();
    if (!data.photos.length) throw new Error("No images found for that prompt.");

    // Extract only image URLs
    const imageUrls = data.photos.map(photo => photo.src.large);
    updateImageCard(imageUrls);
  } catch (error) {
    alert(error.message);
  } finally {
    isImageGenerating = false;
  }
};

const handleFormSubmission = (e) => {
  e.preventDefault();
  if (isImageGenerating) return;
  isImageGenerating = true;

  const userPrompt = e.target[0].value;
  const userImgQuantity = e.target[1].value;

  const imgCardMarkup = Array.from({ length: userImgQuantity }, () =>
    `<div class="img-card loading">
      <img src="images/loader.svg" alt="image">
      <a href="#" class="download-btn">
        <img src="images/download.svg" alt="download icon">
      </a>
    </div>`
  ).join("");

  imageGallery.innerHTML = imgCardMarkup;
  generateAiImages(userPrompt, userImgQuantity);
};

generateForm.addEventListener("submit", handleFormSubmission);
