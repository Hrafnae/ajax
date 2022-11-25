// Haetaan XML sivun latauduttua (oma funktio)
window.onload = loadXML;

// Varsinainen XML:n hakufunktio
function loadXML() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "https://www.finnkino.fi/xml/Schedule/?area=", true);
    xmlhttp.send();

    // Jos hakupyyntö valmis, vastaus saatu ja status on ok suoritetaan funktio elokuvien tietojen hakuun
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            movieDetails(this);
        } 
    };
}

// Placeholder taulukon tilalla, kunnes elokuvalista näkyy
document.getElementById("movies").innerHTML = "<h3>Odota hetki. Ladataan elokuvalistaa.</h3>";

// Haetaan tarvittavat elokuvien tiedot ja tulostetaan sivulle taulukkona
function movieDetails(xml) {
    var i;
    var xmlDoc = xml.responseXML;
    var list = ""; // Varmistetaan, että taulukko on tyhjä ennen elokuvien listausta
    var x = xmlDoc.getElementsByTagName("Show"); 

    // Tulostettavan listan muotoilu sivulle
    for (i = 0; i < x.length; i++) {
        list += '<li id="list" class="'
        + x[i].getElementsByTagName('TheatreID')[0].childNodes[0].nodeValue 
        + '"><div class="pic"><img src="' 
        + x[i].getElementsByTagName('EventSmallImagePortrait')[0].childNodes[0].nodeValue 
        + '"></div> <div class="desc"><h2>' 
        + x[i].getElementsByTagName('Title')[0].childNodes[0].nodeValue
        + '</h2> <p><span><img src="' 
        + x[i].getElementsByTagName('RatingImageUrl')[0].childNodes[0].nodeValue 
        + '"></span> <span>'
        + x[i].getElementsByTagName('LengthInMinutes')[0].childNodes[0].nodeValue 
        + ' min</span> <span>'
        + x[i].getElementsByTagName('PresentationMethodAndLanguage')[0].childNodes[0].nodeValue 
        + '</span></p> <p>'
        + x[i].getElementsByTagName('dttmShowStart')[0].childNodes[0].nodeValue
        + '<br>'
        + x[i].getElementsByTagName('Theatre')[0].childNodes[0].nodeValue 
        + '</p></div> <div class="btn"><a href="'
        + x[i].getElementsByTagName('ShowURL')[0].childNodes[0].nodeValue 
        + '" target="_blank"><button>Varaa liput</button></a></div></li>';
    }
    // Tulostetaan muotoiltu lista sivulle
    document.getElementById("movies").innerHTML = list;

    ////// LAJITTELU TEATTERIN MUKAAN --> ei toimi
    // Määritetään teatterien pudotusvalikkoon kuuntelija, joka suodattaa elokuvat valitun teatterin mukaan (tai suodattaisi jos mokoma toimisi)

    // Ideana siis olisi ollut verrata <select> optionin valueta <li> olevaan classiin, joiden pitäisi olla samat ja piilottaa
    // epätäsmäävät <li>, mutta nyt näyttää valinnasta huolimatta vain Flamingon elokuvat (for-loopin -1 ehkä syynä?? omat ongelmanratkaisukyvyt loppui :D)... 

    var theatres = document.getElementById("theatre");
    theatres.addEventListener("change", filterTheatres);

    function filterTheatres() { 
        // Käydään <select> läpi ja listataan ominaisuudet, jotka <option> pitää sisällään
        var options = document.querySelectorAll("option");
        options.forEach(function(e) {
            var optionText = e.text;             // Sivuilla näkyvä teksti
            var optionValue = e.value;           // Value (teatterin id)
            var isOptionSelected = e.selected;   // Onko vaihtoehto klikattu listasta valituksi

            // Listataan kaikki logiin seurannan helpottamiseksi
            console.log(optionText + " (" + optionValue + ") Valittu: " + (isOptionSelected === true ? 'Kyllä' : 'Ei'));

            var input, ul, li, i;
            input = document.getElementById("theatre");
            ul = document.getElementById("movies");
            li = ul.getElementsByTagName("li");

            // Varmistetaan logiin, että oikea value on valittuna
            console.log(optionValue);

            for (i = 0; i < li.length; i++) {
                // Jos tulos täsmää hakua, näytä täsmäävät tulokset ja piilota muut
                // ... jos siis höskä toimisi
                if (li[i].className.indexOf(optionValue) > -1) {
                    li[i].style.display = "list-item";
                    // Näytä lista logissa
                    console.log(li[i]);
                } else {
                    li[i].style.display = "none";
                }
            }
        }); 
    }

    ////// ELOKUVIEN HAKU
    // Määritetään hakukenttään kuuntelija, joka etsii
    // sopivia elokuvia kenttään kirjoittaessa
    var formInput = document.getElementById("search-input");
    formInput.addEventListener("keyup", filterMovies);

    function filterMovies() {
        var i, formInput, filter, li, div, movieName;
        
        formInput = document.querySelector("form input");
        filter = formInput.value.toUpperCase();
        li = document.getElementsByTagName("li");

        // Käydään elokuvalista läpi
        for (i = 0; i < li.length; i++) {
            // Tietoa haetaan 2. divistä (1. on kuvalle)
            div = li[i].getElementsByTagName("div")[1];

            // Jos tulos täsmää hakua, näytä täsmäävät tulokset ja piilota muut
            if (div) {
                // Verrataan 
                movieName = div.textContent || div.innerText;

                // Näytä / piilota
                if (movieName.toUpperCase().indexOf(filter) > -1) {
                    li[i].style.display = "list-item";
                } else {
                    li[i].style.display = "none";
                }
            }
        }
    }
}