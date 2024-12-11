const pagesContent = {
    page1: {
        "subheading": "A Celebration of Art, Craft, and Culture",
        "heading": "Taj Mahotsav",
        "image": "https://modernshrines.in/wp-content/uploads/2021/01/tajmahotsav.jpg",
        "content": "Taj Mahotsav is an annual cultural festival held in Agra, celebrating the rich heritage of India through a showcase of arts, crafts, music, and dance. Set against the backdrop of the majestic Taj Mahal, the festival draws thousands of tourists and locals alike who come to experience the vibrant traditions of India. Visitors can explore intricate handicrafts, vibrant textiles, and exquisite pottery while enjoying live performances of classical and folk music. <br> The festival brings together artisans from different corners of the country, offering a platform to exhibit their unique crafts and preserving traditional art forms. Cultural performances, including dance and drama, are a major highlight, along with culinary stalls offering a taste of India’s diverse flavors. The Taj Mahotsav truly represents the cultural diversity of India and fosters a sense of unity through celebration and appreciation of art.",
        "relatedArticles": [
            { "title": "Ram Barat Festival", "no": "page2", "author": "A Grand Procession Celebrating Lord Rama", "image": "/images/rambarat.jpeg" },
            { "title": "Kailash Fair", "no": "page3", "author": "A Celebration of Lord Shiva", "image": "/images/kailash_f.jpg" }
        ]
    },
    page2: {
        "subheading": "A Grand Procession Celebrating Lord Rama",
        "heading": "Ram Barat Festival",
        "image": "/images/rambarat.jpeg",
        "content": "The Ram Barat Festival is one of the most colorful and grand processions held in North India. This annual event, celebrated in Agra, re-enacts the wedding procession of Lord Rama, as described in the epic Ramayana. The streets come alive with vibrant decorations, traditional music, and performances that bring to life the grand journey of Lord Rama's Barat (wedding procession). <br> Lavish decorations and beautifully adorned chariots are central to the festival, drawing large crowds of devotees and spectators. The festival offers an opportunity for people to engage in religious devotion while enjoying the grandeur of traditional Indian festivities, making it a captivating event for all.",
        "relatedArticles": [
            { "title": "Taj Mahotsav", "no": "page1", "author": "A Celebration of Art, Craft, and Culture", "image": "https://modernshrines.in/wp-content/uploads/2021/01/tajmahotsav.jpg" },
            { "title": "Bateshwar Fair", "no": "page4", "author": "A Sacred Festival of Cattle and Culture", "image": "/images/bateshwar.jpg" }
        ]
    },
    page3: {
        "subheading": "A Celebration of Lord Shiva",
        "heading": "Kailash Fair",
        "image": "/images/kailash_f.jpg",
        "content": "The Kailash Fair, held in the honor of Lord Shiva, takes place at Kailash Temple, a sacred site near Agra. This annual fair is a vibrant and spiritual event that draws devotees from all over to celebrate the powerful deity. The fair is marked by religious rituals, music, and dance performances dedicated to Lord Shiva. <br> Pilgrims and tourists alike participate in the fair, offering prayers and enjoying the festive atmosphere. The Kailash Fair also serves as an opportunity to witness cultural traditions up close, with stalls offering handicrafts, food, and devotional items. It is a spiritual experience that highlights the deep cultural and religious roots of India.",
        "relatedArticles": [
            { "title": "Ram Barat Festival", "no": "page2", "author": "A Grand Procession Celebrating Lord Rama", "image": "/images/rambarat.jpeg" },
            { "title": "Mudiya Purnima", "no": "page5", "author": "A Sacred Pilgrimage for Devotees", "image": "/images/mudia-purnima-mela_1563085136.jpeg" }
        ]
    },
    page4: {
        "subheading": "A Sacred Festival of Cattle and Culture",
        "heading": "Bateshwar Fair",
        "image": "/images/bateshwar.jpg",
        "content": "The Bateshwar Fair, one of the largest fairs in North India, takes place in Bateshwar, near Agra. Dedicated to Lord Shiva, the fair is primarily known for its massive cattle market, where thousands of cattle are traded, along with camels, horses, and other livestock. The fair also features a religious aspect, with devotees offering prayers and performing rituals at the Bateshwar Temple. <br> Besides its religious significance, the Bateshwar Fair is a hub of cultural activities, including folk music, dance performances, and various local art forms. Visitors can explore the lively market stalls offering everything from food to handicrafts. This unique combination of spirituality, commerce, and culture makes the Bateshwar Fair a must-visit event in the region.",
        "relatedArticles": [
            { "title": "Mudiya Purnima", "no": "page5", "author": "A Sacred Pilgrimage for Devotees", "image": "/images/mudia-purnima-mela_1563085136.jpeg" },
            { "title": "Ram Barat Festival", "no": "page2", "author": "A Grand Procession Celebrating Lord Rama", "image": "/images/rambarat.jpeg" }
        ]
    },
    page5: {
        "subheading": "A Sacred Pilgrimage for Devotees",
        "heading": "Mudiya Purnima",
        "image": "/images/mudia-purnima-mela_1563085136.jpeg",
        "content": "Mudiya Purnima is a significant religious festival held in honor of Saint Sant Tulsidas, the revered poet and author of Ramcharitmanas. Celebrated primarily in Mathura and Agra, the festival sees a massive influx of devotees who gather to pay their respects and seek blessings. During the festival, large religious processions, devotional singing, and temple ceremonies take place. <br> The vibrant atmosphere of Mudiya Purnima is marked by spiritual fervor and community celebrations. Devotees come together to share in the joy of religious devotion, making it one of the most important festivals in the region. The festival is also an opportunity for tourists to witness the rich cultural and spiritual traditions of North India.",
        "relatedArticles": [
            { "title": "Bateshwar Fair", "no": "page4", "author": "A Sacred Festival of Cattle and Culture", "image": "/images/bateshwar.jpg" },
            { "title": "Kailash Fair","no": "page3", "author": "A Celebration of Lord Shiva", "image": "/images/kailash_f.jpg" }
        ]
    },
}




function loadContent(page) {
    const content = pagesContent[page];
    if (content) {
        document.getElementById('subheading').textContent = content.subheading;
        document.getElementById('heading').textContent = content.heading;

        document.getElementById('image').src = content.image;

        document.getElementById('monument-about').textContent = "About "+content.heading;

        document.getElementById('content-paragraph').innerHTML = content.content;


        const relatedArticlesContainer = document.getElementById('related-articles');
        relatedArticlesContainer.innerHTML = "";  
        content.relatedArticles.forEach(article => {
            const articleElement = `
          <a href="/Html/cultural-events.html?page=${article.no}" class="card">
            <img src="${article.image}" alt="">
            <div>
              <p class="heading title">${article.title}</p>
              <p class="sub-heading">${article.author}</p>
            </div>
          </a>
        `;
            relatedArticlesContainer.innerHTML += articleElement;
        });
    }
}

const urlParams = new URLSearchParams(window.location.search);
const page = urlParams.get('page') || 'page1'; 

loadContent(page);