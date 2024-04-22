document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', weatherSearch);
});

const APIKey = "46a9fd4bc168e3e4a27f122d86d96c11";

function weatherSearch() {
    const city = document.querySelector(".input").value; // Use querySelector to get the input value
    const queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=imperial`;

    fetch(queryURL)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}


