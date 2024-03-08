const manageLoader = (state, id) => {
  const targetContainer = document.getElementById(id);
  if (state === "add") {
    targetContainer.innerHTML += `<div id="loader-${id}" class="w-full lg:col-span-4 flex items-center justify-center">
    <span class="loading loading-bars loading-md"></span>
  </div>`;
  } else if (state === "remove") {
    document.getElementById(`loader-${id}`).remove();
  }
};

const categoriesLoader = () => {
  manageLoader("add", "categories");
  fetch("https://openapi.programming-hero.com/api/videos/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.data));
};
const displayCategories = (categories) => {
  manageLoader("remove", "categories");
  const categoriesContainer = document.getElementById("categories");
  categories?.forEach((category) => {
    categoriesContainer.innerHTML += `<button id="${
      category.category_id
    }" class="category btn btn-sm uppercase ${
      categories?.indexOf(category) === 0 ? "btn-error text-white" : ""
    }" onclick="categoryDataLoader(${category.category_id})">${
      category.category
    }</button>`;
  });
};

let sortType = "none";
const sortVideos = () => {
  const tooltipContainer = document.getElementById("sort-tooltip");
  if (sortType === "none" || sortType === "up") {
    sortType = "down";
    tooltipContainer.dataset.tip = "Lowest to Highest";
  } else {
    sortType = "up";
    tooltipContainer.dataset.tip = "Highest to Lowest";
  }
  categoryDataLoader();
};

const cmpUp = (a, b) => {
  const viewsA = parseFloat(a.others.views.slice(0, -1));
  const viewsB = parseFloat(b.others.views.slice(0, -1));
  return viewsA > viewsB ? 1 : -1;
};
const cmpDown = (a, b) => {
  const viewsA = parseFloat(a.others.views.slice(0, -1));
  const viewsB = parseFloat(b.others.views.slice(0, -1));
  return viewsA < viewsB ? 1 : -1;
};

const videosDataSorter = (videos) => {
  if (sortType === "none") {
    return videos;
  } else if (sortType === "up") {
    return videos.sort(cmpUp);
  } else {
    return videos.sort(cmpDown);
  }
};

const categoryDataLoader = (id = 1000) => {
  const categories = document.getElementsByClassName("category");
  [...categories].forEach((category) => {
    category.classList.remove("btn-error");
    category.classList.remove("text-white");
    if (category.id == id) {
      category.classList.add("btn-error");
      category.classList.add("text-white");
    }
  });

  document.getElementById("videos").innerHTML = "";
  manageLoader("add", "videos");

  fetch(`https://openapi.programming-hero.com/api/videos/category/${id}`)
    .then((res) => res.json())
    .then((data) => videosDataSorter(data.data))
    .then((sortedData) => videosLoader(sortedData));
};

const convertTime = (time) => {
  if (time < 60) {
    return `${time} seconds ago`;
  } else if (time < 3600) {
    const minutes = Math.floor(time / 60);
    return `${minutes} minutes ago`;
  } else {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    return `${hours} hours ${minutes} minutes ago`;
  }
};

const videosLoader = (videos) => {
  manageLoader("remove", "videos");
  const videosContainer = document.getElementById("videos");
  if (videos?.length == 0) {
    videosContainer.innerHTML += `<div class="lg:col-span-4 py-20">
    <div class="flex justify-center mb-8">
      <img src="./assets/Icon.png" alt="no video" />
    </div>
    <h1 class="text-center text-3xl lg:text-4xl font-semibold">
      Oops!! Sorry, There is no<br />content here
    </h1>
  </div>`;
  } else {
    videos?.forEach((video) => {
      videosContainer.innerHTML += `<div class="cursor-pointer mb-5">
        <div class="relative">
          <img
            class="w-full min-h-[100px] h-full sm:h-[200px] rounded-lg"
            src="${video.thumbnail}"
            alt="thumbnail"
          />
          ${
            video.others.posted_date != ""
              ? `<span class="bg-gray-800 text-white text-sm px-2 rounded-lg absolute bottom-2 right-2">${convertTime(
                  video.others.posted_date
                )}</span>`
              : ""
          }
        </div>
        <div class="grid grid-cols-6 mt-5 gap-5">
          <div>
            <img
              class="w-full aspect-square rounded-full"
              src="${video.authors[0].profile_picture}"
              alt="avatar"
            />
          </div>
          <div class="col-span-5">
            <h1 class="text-xl font-medium mb-1">${video.title}</h1>
            <div class="flex items-center gap-2">
              <p class="text-sm text-gray-500 mb-1">${
                video.authors[0].profile_name
              }</p>
              ${
                video.authors[0].verified
                  ? '<img src="./assets/verified.svg" alt="verified badge"/>'
                  : ""
              }
            </div>
            <p class="text-sm text-gray-500">${video.others.views} views</p>
          </div>
        </div>
      </div>`;
    });
  }
};

categoriesLoader();
categoryDataLoader();
