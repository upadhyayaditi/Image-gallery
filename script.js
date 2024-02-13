const imagesWrapper = document.querySelector(".images");
const LoadMoreBtn = document.querySelector(".load-more");
const SearchInput = document.querySelector(".search-box input");
const lightBox = document.querySelector(".lightbox");
const closeBtn = lightBox.querySelector(".uil-times");
const downloadImgBtn = lightBox.querySelector(".uil-import");

const apiKey = "RIIMqSBe6BeXfqEyk9sZLflmGbXCVHOuPcB2BX8IMuiBqCmNLDsgZRxk";
const perPage = 25;
let currentPage = 1;
let searchTerm = null;

const downloadImg = (imgURL) => {
    //Converting received img to blob , creating its download link , & downloading it
    fetch(imgURL).then(res => res.blob()).then(file => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        a.download = new Date().getTime();
        a.click();
    }).catch(() => alert("Failed to download image!"));
}

const showLightbox = (name, img) => {
    // Showing Lightbox  and setting img source and name and button attribute
    lightBox.querySelector("img").src = img;
    lightBox.querySelector("span").innerHTML = name;
    downloadImgBtn.setAttribute("data-img", img);
    lightBox.classList.add("show");
    document.body.style.overflow = "hidden";

}

const hideLightbox = () => {
    lightBox.classList.remove("show");
    document.body.style.overflow = "auto";
}

const generateHTML = (images) => {
    imagesWrapper.innerHTML += images.map(img =>
        `<li class="card" onclick = "showLightbox('${img.photographer}', '${img.src.large2x}')">
        <img src="${img.src.large2x}" alt="">
        <div class="details">
            <button onclick="downloadImg('${img.src.large2x}');event.stopPropagation();">
            <i class="uil uil-import"></i>
            </button>
        </div>
    </li>`

    ).join("");
}

const getImages = (apiURL) => {
    //Fetching images by api call with authorization header
    LoadMoreBtn.innerText = "Loading..."
    LoadMoreBtn.classList.add("disabled");
    fetch(apiURL, {
        headers: { Authorization: apiKey }
    }).then(res => res.json()).then(data => {
        generateHTML(data.photos);
        LoadMoreBtn.innerText = "Load More"
        LoadMoreBtn.classList.remove("disabled");
    }).catch(() => alert("Failed to load images!"));
}

const loadMoreImages = () => {
    currentPage++;       //increament  current page by 1
    //if searchTerm  has some value the call API  with search term  else call default API
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}per_page=${perPage}`;
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}per_page=${perPage}` : apiURL;
    getImages(apiURL);
}

const loadSearchImages = (e) => {
    //if the search input is empty, set the search term to null and return from here
    if (e.target.value === "") return searchTerm = null;
    //if prssed key is Enter, update the current page , search term and  call the getImages
    if (e.key === "Enter") {
        currentPage = 1;
        searchTerm = e.target.value;
        imagesWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}per_page=${perPage}`);
    }
}


getImages(`https://api.pexels.com/v1/curated?page=${currentPage}per_page=${perPage}`);



LoadMoreBtn.addEventListener("click", loadMoreImages);
SearchInput.addEventListener("keyup", loadSearchImages);
closeBtn.addEventListener("click", hideLightbox);
downloadImgBtn.addEventListener("click", (e) => downloadImg(e.target.dataset.img)); 