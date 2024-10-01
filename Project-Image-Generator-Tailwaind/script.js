const imagePrompt = document.getElementById("image-prompt");
const imgQuantity = document.getElementById("img-quantity");
const title = document.getElementById("title");
const imageResults = document.getElementById("image-results");
const pagination = document.getElementById("pagination");

const API_KEY = 'JbKHunXqaNX2ALGTuwKNR_JQXYIDI4f6jE09uhD74f8';
const formImgGenerator = document.getElementById("form-img-generator");
const customAlert = document.getElementById("custom-alert");
const alertCloseBtn = document.getElementById("alert-close-btn");

const imageModal = document.getElementById("image-modal");
const modalImage = document.getElementById("modal-image");
const modalClose = document.getElementById("modal-close");
const modalCloseBtn = document.getElementById("modal-close-btn");
const modalDownloadBtn = document.getElementById("modal-download-btn");

const showAlert = (message) => {
  customAlert.querySelector("p").textContent = message;
  customAlert.style.display = "block";
};

alertCloseBtn.addEventListener("click", () => {
  customAlert.style.display = "none";
});

window.addEventListener("DOMContentLoaded", async () => {
  await fetchRandomImages();
});

const generateImg = async (page = 1) => {
  try {
    const response = await fetch(`https://api.unsplash.com/search/photos?query=${imagePrompt.value}&per_page=${imgQuantity.value}&page=${page}&client_id=${API_KEY}`);
    title.innerHTML = `<h2 class="capitalize max-lg:text-lg">hasil pencarian dari <span class="bg-blue-500 p-1 text-white rounded-md">${imagePrompt.value}</span></h2>`;
    const data = await response.json();

    if (data.results.length === 0) {
      showAlert("Pencarian tidak ditemukan");
      imageResults.innerHTML = "";
      pagination.innerHTML = "";
      return;
    }

    displayImages(data.results);
    updatePagination(data.total_pages, page);
  } catch (error) {
    console.log(error);
  }
};

const fetchRandomImages = async (page = 1) => {
  try {
    const perPage = 16;
    const response = await fetch(`https://api.unsplash.com/photos/random?count=${perPage}&client_id=${API_KEY}`);
    const data = await response.json();
    displayImages(data);

    const totalImages = 100; 
    const totalPages = Math.ceil(totalImages / perPage);
    updateRandomPagination(totalPages, page);
  } catch (error) {
    console.log(error);
  }
};

const displayImages = (images) => {
  const imgHasil = images.map((image) =>
    `<div class="card relative">
        <img src="${image.urls.regular}" alt="${image.alt_description}" class="h-96 w-full object-cover cursor-pointer" onclick="openModal('${image.urls.regular}', '${image.urls.full}')">
        <div class="absolute bottom-1 flex justify-between w-full py-1 px-2 items-center max-lg:text-sm">
            <h2 class="rounded-lg bg-white p-1 text-xs">${image.user.name}</h2>
            <a href="${image.urls.full}" target="_blank" class="bg-white rounded-full p-1">
                <i class="fas fa-download"></i>
            </a>
        </div>
    </div>`
  ).join("");

  imageResults.innerHTML = imgHasil;
};

const updatePagination = (totalPages, currentPage) => {
  const maxPagesToShow = 5;
  let paginationHTML = '';

  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  if (startPage > 1) {
    paginationHTML += `<button class="px-4 py-2 bg-gray-200 rounded-full" onclick="changePage(1)"><<</button>`;
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `<button class="px-4 py-2 ${i === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-full" onclick="changePage(${i})">${i}</button>`;
  }

  if (endPage < totalPages) {
    paginationHTML += `<button class="px-4 py-2 bg-gray-200 rounded-full" onclick="changePage(${totalPages})">>></button>`;
  }

  pagination.innerHTML = paginationHTML;
};

const updateRandomPagination = (totalPages, currentPage) => {
  const maxPagesToShow = 5;
  let paginationHTML = '';

  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  if (startPage > 1) {
    paginationHTML += `<button class="px-4 py-2 bg-gray-200 rounded-full" onclick="changeRandomPage(1)">First</button>`;
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `<button class="px-4 py-2 ${i === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-full" onclick="changeRandomPage(${i})">${i}</button>`;
  }

  if (endPage < totalPages) {
    paginationHTML += `<button class="px-4 py-2 bg-gray-200 rounded-full" onclick="changeRandomPage(${totalPages})">Last</button>`;
  }

  pagination.innerHTML = paginationHTML;
};

const changePage = (page) => {
  generateImg(page);
};

const changeRandomPage = (page) => {
  fetchRandomImages(page);
};

formImgGenerator.addEventListener("submit", function(e) {
  e.preventDefault();

  if (imagePrompt.value.length < 3) {
    showAlert("Masukkan kata minimal 3 huruf");
    return;
  }

  generateImg();
});

const openModal = (src, downloadLink) => {
  modalImage.src = src;
  modalDownloadBtn.href = downloadLink;
  imageModal.style.display = "flex";
};

modalClose.addEventListener("click", () => {
  imageModal.style.display = "none";
});

modalCloseBtn.addEventListener("click", () => {
  imageModal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === imageModal) {
    imageModal.style.display = "none";
  }
});
