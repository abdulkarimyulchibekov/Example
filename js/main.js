const elList = document.querySelector('.js-list');
const elForm = document.querySelector('.js-form');
const elBody = document.querySelector('body');
const elInput = document.querySelector('.js-input');
const elModal = document.querySelector('.basic-modal');
const elOverlay = document.querySelector('.overlay');
const elFilmsTemplate = document.querySelector('.films-template').content;
let activePage = 1;
const elSelect = document.querySelector('.js-select');
const elPrevBtn = document.querySelector('.prev-btn');
const elNextBtn = document.querySelector('.next-btn');
const elActivePage = document.querySelector('.active-page');
let totalPages = 0;
let products = [];

elActivePage.textContent = 'Active Page ' + activePage;

elPrevBtn.setAttribute('disabled', true);

const renderItems = async () => {
	const res = await fetch('https://dummyjson.com/products/categories');
	const data = await res.json();

	data.forEach((option) => {
		const elOption = document.createElement('option');
		elOption.setAttribute('value', option);
		elOption.innerText = option;
		elSelect.appendChild(elOption);
	});
};

renderItems();

const modalgaChiqarator = (el, node) => {
	elModal.innerHTML = '';
	elBody.classList.add('hidden');
	const elImg = document.createElement('img');
	const elDiv = document.createElement('div');
	const elButton = document.createElement('button');
	const elTitle = document.createElement('h3');
	const elType = document.createElement('p');
	const elYear = document.createElement('p');

	elTitle.textContent = el.title;
	elDiv.setAttribute('width', '500');
	elDiv.classList.add('box2');
	elButton.textContent = 'X';
	elButton.setAttribute('class', 'close-btn');
	elImg.src = el.thumbnail;
	elImg.setAttribute('class', 'modal-img');
	elType.textContent = el.category;
	elYear.textContent = el.price;

	node.appendChild(elButton);
	elDiv.appendChild(elTitle);
	elDiv.appendChild(elType);
	elDiv.appendChild(elYear);
	node.appendChild(elDiv);
	node.appendChild(elImg);
};

const renderFilms = (array, node) => {
	elList.innerHTML = '';
	array.forEach((film) => {
		let newTemplate = elFilmsTemplate.cloneNode(true);

		newTemplate.querySelector('.template-img').src = film.thumbnail;
		newTemplate.querySelector('.subheader').textContent = film.title;
		newTemplate.querySelector('.description').textContent = film.description;
		newTemplate.querySelector('.modal-btn').textContent = 'More...';

		newTemplate.querySelector('.modal-btn').dataset.filmId = film.id;

		node.appendChild(newTemplate);
	});
};

getMovie = async function () {
	const response = await fetch(
		`https://dummyjson.com/products?limit=20&skip=${(activePage - 1) * 10}`,
	);
	const data = await response.json();
	console.log(data);
	totalPages = data.total / 20;
	products = data.products;
	renderFilms(products, elList);
	if (totalPages <= 1) {
		elNextBtn.setAttribute('disabled', true);
		elPrevBtn.setAttribute('disabled', true);
	} else {
		elPrevBtn.removeAttribute('disabled');
		elNextBtn.removeAttribute('disabled');
	}
};

searchMovie = async function () {
	const res = await fetch(
		`https://dummyjson.com/products/search?q=${elInput.value}`,
	);
	const data = await res.json();
	console.log(data);
	totalPages = data.total / 20;
	products = data.products;
	renderFilms(products, elList);
	console.log({ totalPages, data });
	if (totalPages <= 1) {
		elNextBtn.setAttribute('disabled', true);
		elPrevBtn.setAttribute('disabled', true);
	} else {
		elPrevBtn.removeAttribute('disabled');
		elNextBtn.removeAttribute('disabled');
	}
	elInput.value = '';
};

getMovie();

elForm.addEventListener('submit', (evt) => {
	evt.preventDefault();
	searchMovie();
});

elModal.addEventListener('click', function (evt) {
	if (evt.target.matches('.close-btn')) {
		elOverlay.classList.remove('open');
		elBody.classList.remove('hidden');
	}
});

elOverlay.addEventListener('click', function () {
	elOverlay.classList.remove('open');
	elBody.classList.remove('hidden');
});

elPrevBtn.addEventListener('click', () => {
	if (activePage === 1) {
		elPrevBtn.setAttribute('disabled', true);
	} else {
		--activePage;
		getMovie();
	}
	if (activePage < totalPages) {
		elNextBtn.removeAttribute('disabled');
	}
	elActivePage.textContent = 'Active Page ' + activePage;
});

elNextBtn.addEventListener('click', () => {
	if (activePage === totalPages) {
		elNextBtn.setAttribute('disabled', true);
	} else {
		++activePage;git 
		getMovie();
	}
	if (activePage > 1) {
		elPrevBtn.removeAttribute('disabled');
	}
	elActivePage.textContent = 'Active Page ' + activePage;
});

elList.addEventListener('click', function (evt) {
	if (evt.target.matches('.modal-btn')) {
		elOverlay.classList.add('open');
		const findedFilm = evt.target.dataset.filmId;
		const findedModalFilm = products.find((e) => e.id == findedFilm);
		console.log(findedModalFilm);
		modalgaChiqarator(findedModalFilm, elModal);
	}
});

elSelect.addEventListener('change', (evt) => {
	if (evt.currentTarget.value === 'All') {
		getMovie();
	} else {
		const getCategoryMovie = async () => {
			const res = await fetch(
				`https://dummyjson.com/products/category/${evt.currentTarget.value}`,
			);
			const data = await res.json();
			totalPages = data.total / 20;
			products = data.products;
			renderFilms(products, elList);
			console.log({ totalPages, data });
			if (totalPages <= 1) {
				elNextBtn.setAttribute('disabled', true);
				elPrevBtn.setAttribute('disabled', true);
			} else {
				elPrevBtn.removeAttribute('disabled');
				elNextBtn.removeAttribute('disabled');
			}
		};

		getCategoryMovie();
	}
});
