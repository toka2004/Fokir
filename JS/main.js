const navbar = document.querySelector(".navbar");
const navigation = document.querySelector("#site-navigation");
const navigationToggle = document.querySelector(".navbar-toggler");
const navigationLinks = [...document.querySelectorAll(".nav-link-custom")];
const observedSections = navigationLinks
	.map((link) => document.querySelector(link.getAttribute("href")))
	.filter(Boolean);

const updateNavbar = () => {
	navbar?.classList.toggle("is-scrolled", window.scrollY > 24);
};

updateNavbar();
window.addEventListener("scroll", updateNavbar, { passive: true });

if ("IntersectionObserver" in window) {
	const sectionObserver = new IntersectionObserver((entries) => {
		const visibleSection = entries
			.filter((entry) => entry.isIntersecting)
			.sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

		if (!visibleSection) return;

		navigationLinks.forEach((link) => {
			const isCurrent = link.hash === `#${visibleSection.target.id}`;
			link.classList.toggle("active", isCurrent);
			if (isCurrent) link.setAttribute("aria-current", "page");
			else link.removeAttribute("aria-current");
		});
	}, { rootMargin: "-25% 0px -60% 0px", threshold: [0, 0.2, 0.5] });

	observedSections.forEach((section) => sectionObserver.observe(section));
}

navigationLinks.forEach((link) => {
	link.addEventListener("click", () => {
		if (!navigation?.classList.contains("show") || !window.bootstrap) return;
		window.bootstrap.Collapse.getOrCreateInstance(navigation).hide();
	});
});

navigation?.addEventListener("show.bs.collapse", () => {
	navbar?.classList.add("navbar-open");
	navigationToggle?.setAttribute("aria-expanded", "true");
});

navigation?.addEventListener("hide.bs.collapse", () => {
	navbar?.classList.remove("navbar-open");
	navigationToggle?.setAttribute("aria-expanded", "false");
});

const filterButtons = [...document.querySelectorAll(".filter-button")];
const portfolioItems = [...document.querySelectorAll(".portfolio-item")];

filterButtons.forEach((button) => {
	button.addEventListener("click", () => {
		const selectedFilter = button.dataset.filter;

		filterButtons.forEach((filterButton) => {
			const isSelected = filterButton === button;
			filterButton.classList.toggle("is-active", isSelected);
			filterButton.setAttribute("aria-pressed", String(isSelected));
		});

		portfolioItems.forEach((item) => {
			item.hidden = selectedFilter !== "all" && item.dataset.category !== selectedFilter;
		});
	});
});

const typewriterText = document.querySelector(".typewriter-text");
const typewriterWords = ["Designer", "Developer", "Freelancer"];

if (typewriterText) {
	const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	if (prefersReducedMotion) {
		typewriterText.textContent = typewriterWords[0];
	} else {
		let wordIndex = 0;
		let characterIndex = 0;
		let isErasing = false;

		const typeNextCharacter = () => {
			const currentWord = typewriterWords[wordIndex];
			characterIndex += isErasing ? -1 : 1;
			typewriterText.textContent = currentWord.slice(0, characterIndex);

			let delay = isErasing ? 55 : 110;
			if (!isErasing && characterIndex === currentWord.length) {
				isErasing = true;
				delay = 1400;
			} else if (isErasing && characterIndex === 0) {
				isErasing = false;
				wordIndex = (wordIndex + 1) % typewriterWords.length;
				delay = 350;
			}

			window.setTimeout(typeNextCharacter, delay);
		};

		typeNextCharacter();
	}
}
